const { getMessages, markAsRead } = require('../services/messageService');

// GET /api/chat/conversations/:id/messages
const getConversationMessages = async (req, res) => {
  try {
    const { page } = req.query;
    const messages = await getMessages(req.params.id, page);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/chat/conversations/:id/read
const markMessagesRead = async (req, res) => {
  try {
    await markAsRead(req.params.id, req.user.userId);
    res.json({ message: 'Messages marqués comme lus' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getConversationMessages, markMessagesRead };