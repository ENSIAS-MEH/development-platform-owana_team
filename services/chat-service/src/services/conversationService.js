const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

// Créer ou retrouver une conversation directe entre 2 users
const getOrCreateDirectConversation = async (userId1, userId2) => {
  let conversation = await Conversation.findOne({
    type: 'direct',
    participants: { $all: [userId1, userId2], $size: 2 }
  });
  if (!conversation) {
    conversation = await Conversation.create({
      type: 'direct',
      participants: [userId1, userId2]
    });
  }
  return conversation;
};

// Récupérer toutes les conversations d'un user
const getUserConversations = async (userId) => {
  return await Conversation.find({ participants: userId })
    .sort({ updatedAt: -1 });
};

// Créer un chat de groupe pour une startup
const createGroupConversation = async (startupId, participantIds) => {
  // If a group conversation already exists for this startup, return it
  const existing = await Conversation.findOne({ type: 'group', startupId });
  if (existing) {
    return existing;
  }

  return await Conversation.create({
    type: 'group',
    participants: participantIds,
    startupId
  });
};

module.exports = {
  getOrCreateDirectConversation,
  getUserConversations,
  createGroupConversation
};