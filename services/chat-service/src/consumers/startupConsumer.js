const { getChannel } = require('../config/rabbitmq');
const {
  createGroupConversation,
  getOrCreateDirectConversation
} = require('../services/conversationService');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

const EXCHANGE_NAME = 'foundersync.startup.exchange';
const QUEUE_NAME    = 'foundersync.chat.queue';

const startStartupConsumer = async () => {
  const channel = getChannel();

  await channel.assertExchange(EXCHANGE_NAME, 'topic', { durable: true });
  await channel.assertQueue(QUEUE_NAME, { durable: true });

  // Écouter les 3 événements qui concernent le chat
  await channel.bindQueue(QUEUE_NAME, EXCHANGE_NAME, 'startup.created');
  await channel.bindQueue(QUEUE_NAME, EXCHANGE_NAME, 'join.request.received');
  await channel.bindQueue(QUEUE_NAME, EXCHANGE_NAME, 'join.request.accepted');
  await channel.bindQueue(QUEUE_NAME, EXCHANGE_NAME, 'member.removed');

  console.log(`Chat consumer démarré sur [${QUEUE_NAME}]`);

  channel.consume(QUEUE_NAME, async (msg) => {
    if (!msg) return;
    try {
      const event = JSON.parse(msg.content.toString());
      console.log(`Événement reçu: ${event.type}`);

      // CAS 1 : Startup créée → créer le groupe
      if (event.type === 'STARTUP_CREATED') {
        const startupId = event.startupId?.toString();
        const founderId = event.founderId?.toString();
        if (!startupId || !founderId) {
          console.warn('STARTUP_CREATED: données manquantes');
          channel.ack(msg);
          return;
        }
        // Éviter les doublons
        const existing = await Conversation.findOne({ startupId, type: 'group' });
        if (existing) {
          console.log(`Groupe déjà existant pour startup: ${startupId}`);
          channel.ack(msg);
          return;
        }
        // Créer le groupe avec le fondateur comme seul membre au début
        const group = await createGroupConversation(startupId, [founderId]);
        // Message de bienvenue automatique
        await Message.create({
          conversationId: group._id,
          senderId: founderId,
          content: `Bienvenue dans le chat de votre startup ! Ce groupe est créé automatiquement pour votre équipe.`,
          readBy: [founderId]
        });
        await Conversation.findByIdAndUpdate(group._id, {
          lastMessage: 'Bienvenue dans le chat de votre startup !'
        });
        console.log(`Groupe startup créé: ${group._id}`);
      }
      // CAS 2 : Demande de rejoindre → conversation directe + message auto
      else if (event.type === 'JOIN_REQUEST_RECEIVED') {
        const requesterId = event.requesterId?.toString();
        const founderId   = event.founderId?.toString();
        const startupName = event.startupName || 'votre startup';
        const autoMessage = event.autoMessage ||
          `Bonjour ! Je suis intéressé(e) par votre startup "${startupName}" et j'aimerais en savoir plus.`;
        if (!requesterId || !founderId) {
          console.warn('JOIN_REQUEST_RECEIVED: données manquantes');
          channel.ack(msg);
          return;
        }
        // Créer ou récupérer la conversation directe entre les deux
        const conversation = await getOrCreateDirectConversation(requesterId, founderId);
        // Envoyer le message automatique de présentation
        const message = await Message.create({
          conversationId: conversation._id,
          senderId: requesterId, // le message vient du demandeur
          content: autoMessage,
          readBy: [requesterId]
        });
        await Conversation.findByIdAndUpdate(conversation._id, {
          lastMessage: autoMessage,
          updatedAt: new Date()
        });

        console.log(`Conversation directe + message auto créés: ${conversation._id}`);
      }
      // CAS 3 : Demande acceptée → ajouter membre au groupe
      else if (event.type === 'JOIN_REQUEST_ACCEPTED') {
        const startupId   = event.startupId?.toString();
        const newMemberId = event.recipientId?.toString();
        const startupName = event.startupName || 'la startup';
        if (!startupId || !newMemberId) {
          console.warn('JOIN_REQUEST_ACCEPTED: données manquantes');
          channel.ack(msg);
          return;
        }
        const group = await Conversation.findOne({ startupId, type: 'group' });
        if (group) {
          // Ajouter le nouveau membre s'il n'est pas déjà dedans
          if (!group.participants.includes(newMemberId)) {
            await Conversation.findByIdAndUpdate(group._id, {
              $push: { participants: newMemberId }
            });
            // Message automatique de bienvenue dans le groupe
            await Message.create({
              conversationId: group._id,
              senderId: newMemberId,
              content: `Je viens de rejoindre l'équipe de "${startupName}" ! Ravi(e) de vous rejoindre !`,
              readBy: [newMemberId]
            });
            await Conversation.findByIdAndUpdate(group._id, {
              lastMessage: `Un nouveau membre a rejoint l'équipe !`
            });
            console.log(`Membre ${newMemberId} ajouté au groupe ${group._id}`);
          }
        } else {
          // Groupe pas encore créé (cas rare) → le créer maintenant
          const memberIds = (event.memberIds || []).map(id => id.toString());
          const allParticipants = [...new Set([...memberIds, newMemberId])];
          const newGroup = await createGroupConversation(startupId, allParticipants);
          console.log(`Groupe créé lors de l'acceptation: ${newGroup._id}`);
        }
      }
      // CAS 4 : Membre retiré → le retirer du groupe
      else if (event.type === 'MEMBER_REMOVED') {
        const startupId     = event.startupId?.toString();
        const removedUserId = event.recipientId?.toString();
        const startupName   = event.startupName || 'la startup';
        if (!startupId || !removedUserId) {
          console.warn('MEMBER_REMOVED: données manquantes');
          channel.ack(msg);
          return;
        }
        const group = await Conversation.findOne({ startupId, type: 'group' });
        if (group) {
          if (group.participants.includes(removedUserId)) {
            await Conversation.findByIdAndUpdate(group._id, {
              $pull: { participants: removedUserId }
            });
            // System message notifying the group
            await Message.create({
              conversationId: group._id,
              senderId: 'system',
              content: `Un membre a quitté le groupe "${startupName}".`,
              readBy: []
            });
            await Conversation.findByIdAndUpdate(group._id, {
              lastMessage: `Un membre a quitté le groupe.`,
              updatedAt: new Date()
            });
            console.log(`Membre ${removedUserId} retiré du groupe ${group._id}`);
          }
        } else {
          console.log(`Pas de groupe trouvé pour startup: ${startupId}`);
        }
      }
      else {
        console.log(`Événement ignoré par le chat: ${event.type}`);
      }
      channel.ack(msg);
    } catch (err) {
      console.error('Erreur consumer chat:', err.message);
      channel.nack(msg, false, true);
    }
  });
};
module.exports = { startStartupConsumer };