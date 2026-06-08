const express = require('express');
const router = express.Router();
const protect = require('../middlewares/authMiddleware');
const {
  getMyConversations,
  startDirectChat,
  startGroupChat
} = require('../controllers/conversationController');
const Message = require('../models/Message');

router.get('/conversations', protect, getMyConversations);
router.post('/conversations/direct', protect, startDirectChat);
router.post('/conversations/group', protect, startGroupChat);

// GET /api/chat/conversations/unread — get unread counts for all user's conversations
router.get('/conversations/unread', protect, async (req, res) => {
  try {
    const userId = req.user.userId;
    const Conversation = require('../models/Conversation');
    const conversations = await Conversation.find({ participants: userId });

    const unreadCounts = {};
    await Promise.all(
      conversations.map(async (conv) => {
        const count = await Message.countDocuments({
          conversationId: conv._id,
          senderId: { $ne: userId },
          readBy: { $ne: userId },
        });
        if (count > 0) {
          unreadCounts[conv._id.toString()] = count;
        }
      })
    );

    res.json(unreadCounts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;