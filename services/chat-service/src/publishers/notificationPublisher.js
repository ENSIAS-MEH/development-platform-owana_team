const { getChannel } = require('../config/rabbitmq');

const NOTIFICATION_QUEUE = 'foundersync.notification.queue';

const publishMessageNotification = async ({
  recipientIds,
  senderId,
  conversationId,
  content
}) => {
  try {
    const channel = getChannel();
    await channel.assertQueue(NOTIFICATION_QUEUE, { durable: true });

    const event = {
      type: 'NEW_MESSAGE',
      senderId,
      recipientIds,
      conversationId: conversationId.toString(),
      content,
      createdAt: new Date()
    };

    channel.sendToQueue(
      NOTIFICATION_QUEUE,
      Buffer.from(JSON.stringify(event)),
      { persistent: true }
    );

    console.log(`Notification publiée pour ${recipientIds.length} destinataire(s)`);
  } catch (err) {
    console.error('Erreur notification:', err.message);
  }
};

module.exports = { publishMessageNotification };