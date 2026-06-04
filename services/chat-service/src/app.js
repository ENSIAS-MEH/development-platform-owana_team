const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());

app.use('/api/chat', require('./routes/conversationRoute'));
app.use('/api/chat', require('./routes/messageRoute'));

require('./sockets/chatSocket')(io);

module.exports = { app, server }; 