const jwt = require('jsonwebtoken');
const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const { publishMessageNotification } = require('../publishers/notificationPublisher');

module.exports = (io) => {
  io.use((socket, next) => {
    let token = socket.handshake.auth?.token;

    if (!token) {
      try {
        const authHeader = socket.handshake.headers?.auth;
        if (authHeader) {
          const parsed = JSON.parse(authHeader);
          token = parsed.token;
        }
      } catch {}
    }
    if (!token) {
      token = socket.handshake.query?.token;
    }
    if (!token) return next(new Error('Token manquant'));
    const cleanToken = token.replace('Bearer ', '').trim();
    try {
      const decoded = jwt.verify(cleanToken, process.env.JWT_SECRET);
      socket.userId = decoded.userId;
      next();
    } catch (err) {
      next(new Error('Auth échouée: ' + err.message));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connecté: ${socket.userId}`);

    // REJOINDRE UNE CONVERSATION
    // Fonctionne pour direct ET groupe
    socket.on('join_conversation', (data) => {
      const conversationId = typeof data === 'string' ? data : data?.conversationId;
      if (!conversationId) return;
      socket.join(conversationId);
      console.log(`User ${socket.userId} a rejoint la room: ${conversationId}`);
    });

    // ENVOYER UN MESSAGE (texte ou fichier)
    // Fonctionne pour direct ET groupe
    socket.on('send_message', async (data) => {
      const { conversationId, content, fileUrl, fileType, fileName } =
        typeof data === 'string' ? JSON.parse(data) : data;
      try {
        const message = await Message.create({
          conversationId,
          senderId: socket.userId,
          content: content || '',
          fileUrl: fileUrl || null,
          fileType: fileType || null,
          fileName: fileName || null,
          readBy: [socket.userId]
        });
        await Conversation.findByIdAndUpdate(conversationId, {
          lastMessage: content || `[${fileType || 'fichier'}]`,
          updatedAt: new Date()
        });
        // console.log("NEW MESSAGE EMIS :", message);
        io.to(conversationId).emit('new_message', message);
        const conversation = await Conversation.findById(conversationId);
        const recipientIds = conversation.participants.filter(id => id !== socket.userId);
        if (recipientIds.length > 0) {
          await publishMessageNotification({ recipientIds, senderId: socket.userId, conversationId, content: content || `[${fileType || 'fichier'}]` });
        }
      } catch (err) {
        socket.emit('error', { message: 'Erreur envoi: ' + err.message });
      }
    });

    // MESSAGES LUS (temps réel)
    // Quand un user ouvre une conversation et lit les messages
    socket.on('mark_read', async (data) => {
      const { conversationId } = typeof data === 'string' ? JSON.parse(data) : data;
      try {
        await Message.updateMany(
          { conversationId, readBy: { $ne: socket.userId } },
          { $push: { readBy: socket.userId } }
        );
        socket.to(conversationId).emit('messages_read', { conversationId, readBy: socket.userId });
        console.log(`User ${socket.userId} a lu les messages de: ${conversationId}`);
      } catch (err) {
        console.error('Erreur mark_read:', err.message);
      }
    });
    // TYPING — "est en train d'écrire..."
    // Fonctionne pour direct ET groupe
    
    // Quand un user commence à taper
    socket.on('typing_start', (data) => {
      const { conversationId } = typeof data === 'string' ? JSON.parse(data) : data;
      socket.to(conversationId).emit('user_typing', { conversationId, userId: socket.userId });
    });
    // Quand un user arrête de taper
    socket.on('typing_stop', (data) => {
      const { conversationId } = typeof data === 'string' ? JSON.parse(data) : data;
      socket.to(conversationId).emit('user_stop_typing', { conversationId, userId: socket.userId });
    });

    // DÉCONNEXION
    socket.on('disconnect', () => {
      console.log(`User déconnecté: ${socket.userId}`);
    });
  });
};