const amqp = require('amqplib');
let channel = null;
const connectRabbitMQ = async () => {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    channel = await connection.createChannel();
    console.log('RabbitMQ Connected');
    // Reconnexion automatique si connexion perdue
    connection.on('close', () => {
      console.error('RabbitMQ déconnecté, reconnexion...');
      setTimeout(connectRabbitMQ, 5000);
    });

    return channel;
  } catch (error) {
    console.error('RabbitMQ Error:', error.message);
    setTimeout(connectRabbitMQ, 5000); // réessayer après 5s
  }
};
const getChannel = () => {
  if (!channel) throw new Error('RabbitMQ non connecté');
  return channel;
};

module.exports = { connectRabbitMQ, getChannel };