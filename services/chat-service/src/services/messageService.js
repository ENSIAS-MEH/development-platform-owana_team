const Message = require('../models/Message');

// Récupérer les messages d'une conversation (paginés)
const getMessages = async (conversationId, page = 1, limit = 50) => {
  return await Message.find({ conversationId })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
};

// Marquer les messages comme lus par un user
const markAsRead = async (conversationId, userId) => {
  await Message.updateMany(
    { conversationId, readBy: { $ne: userId } },
    { $push: { readBy: userId } }
  );
};

module.exports = { getMessages, markAsRead };