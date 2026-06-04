const {
  getOrCreateDirectConversation,
  getUserConversations,
  createGroupConversation
} = require('../services/conversationService');

// GET /api/chat/conversations → mes conversations
const getMyConversations = async (req, res) => {
  try {
    const conversations = await getUserConversations(req.user.userId);
    res.json(conversations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/chat/conversations/direct → démarrer un chat 1-to-1
const startDirectChat = async (req, res) => {
  try {
    const { targetUserId } = req.body;
    const conversation = await getOrCreateDirectConversation(
      req.user.userId,
      targetUserId
    );
    res.status(201).json(conversation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/chat/conversations/group → créer un chat de groupe startup
const startGroupChat = async (req, res) => {
  try {
    const { startupId, participantIds } = req.body;
    const conversation = await createGroupConversation(startupId, participantIds);
    res.status(201).json(conversation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getMyConversations, startDirectChat, startGroupChat };