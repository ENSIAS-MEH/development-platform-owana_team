require('dotenv').config();
const { server } = require('./app');
const connectDB = require('./config/db');
const { connectRabbitMQ } = require('./config/rabbitmq');
const { startStartupConsumer } = require('./consumers/startupConsumer');

const PORT = process.env.PORT || 8085;

const start = async () => {
  await connectDB();
  await connectRabbitMQ();
  await startStartupConsumer();

  server.listen(PORT, () => {
    console.log(`Chat service running on port ${PORT}`);
  });
};
start();