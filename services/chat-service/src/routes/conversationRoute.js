const express = require('express');
const router = express.Router();
const protect = require('../middlewares/authMiddleware');
const {
  getMyConversations,
  startDirectChat,
  startGroupChat
} = require('../controllers/conversationController');

router.get('/conversations', protect, getMyConversations);
router.post('/conversations/direct', protect, startDirectChat);
router.post('/conversations/group', protect, startGroupChat);

module.exports = router;