const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:4200'],
    credentials: true,
  },
});

app.use(express.json());

app.use('/api/chat', require('./routes/conversationRoute'));
app.use('/api/chat', require('./routes/messageRoute'));

require('./sockets/chatSocket')(io);

module.exports = { app, server }; 