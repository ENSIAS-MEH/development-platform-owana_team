const mongoose = require('mongoose');
const conversationSchema = new mongoose.Schema({
  type: { type: String, enum: ['direct', 'group'], required: true },
  participants: [{ type: String, required: true }], // userIds 
  startupId: { type: String, default: null }, // pour le chat de groupe startup
  lastMessage: { type: String, default: '' }, 
}, { timestamps: true }); // ajoute createdAt ET updatedAt automatiquement
module.exports = mongoose.model('Conversation', conversationSchema);
