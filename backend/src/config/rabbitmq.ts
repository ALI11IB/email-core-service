import amqp from 'amqplib';

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';
let connection: amqp.Connection;
let channel: amqp.Channel;

export const connectToRabbitMQ = async () => {
  if (!connection) {
    connection = await amqp.connect(RABBITMQ_URL);
    console.log('Connected to RabbitMQ');
  }
  if (!channel) {
    channel = await connection.createChannel();
    console.log('RabbitMQ channel created');
  }
};

export const getChannel = () => {
  if (!channel) {
    throw new Error('RabbitMQ channel not created. Call connectToRabbitMQ first.');
  }
  return channel;
};

process.on('exit', () => {
  if (channel) channel.close();
  if (connection) connection.close();
});
