const express = require('express');
const router = express.Router();
const protect = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');
const {
  getConversationMessages,
  markMessagesRead
} = require('../controllers/messageController');
const { uploadFile } = require('../controllers/fileController');
router.get('/:id/messages', protect, getConversationMessages);
router.put('/:id/read', protect, markMessagesRead);
router.post('/upload', protect, upload.single('file'), uploadFile);
module.exports = router;
