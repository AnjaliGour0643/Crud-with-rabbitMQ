import amqp from 'amqplib';

export const createChannel = async () => {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL as string);
    const channel = await connection.createChannel();
    return channel;
  } catch (error) {
    console.error('Error creating RabbitMQ channel:', error);
    throw error;
  }
};