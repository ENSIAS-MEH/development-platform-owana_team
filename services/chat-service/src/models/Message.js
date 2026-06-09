const mongoose = require('mongoose');
const messageSchema = new mongoose.Schema({
  conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true },
  senderId: { type: String, required: true }, // userId venant du JWT
  content: { type: String, default: '' },
  fileUrl: { type: String, default: null },   // URL S3
  fileType: {                                  // type du fichier
    type: String,
    enum: ['image', 'audio', 'pdf', 'video', 'file', null],
    default: null
  },
  fileName: { type: String, default: null },
  readBy: [{ type: String }],
}, { timestamps: true });
  
module.exports = mongoose.model('Message', messageSchema);


  