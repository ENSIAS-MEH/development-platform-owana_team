const { getChannel } = require('../config/rabbitmq');
const axios = require('axios');

const NOTIFICATION_QUEUE = 'foundersync.notification.queue';
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://user-service:8082';

const resolveUserName = async (userId) => {
  try {
    const res = await axios.get(`${USER_SERVICE_URL}/api/users/${userId}`);
    const { firstName, lastName } = res.data;
    const name = `${firstName || ''} ${lastName || ''}`.trim();
    return name || 'Someone';
  } catch {
    return 'Someone';
  }
};

const publishMessageNotification = async ({
                                            recipientIds,
                                            senderId,
                                            conversationId,
                                            content
                                          }) => {
  try {
    const channel = getChannel();
    await channel.assertQueue(NOTIFICATION_QUEUE, { durable: true });

    const senderName = await resolveUserName(senderId);
    const isGroup = recipientIds.length > 1;

    const event = {
      type: 'NEW_MESSAGE',
      senderId,
      recipientIds,
      message: isGroup
          ? `${senderName} sent a message in group`
          : `${senderName} sent you a message`,
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
