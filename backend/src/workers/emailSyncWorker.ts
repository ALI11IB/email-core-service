import { connectToRabbitMQ, getChannel } from '../config/rabbitmq';
import { User } from '../models';
import { syncUserData } from '../services/syncService';

export const consumeMessages = async () => {
  debugger;
  await connectToRabbitMQ();
  const channel = getChannel();
  const queue = 'emailSyncQueue';

  await channel.assertQueue(queue, { durable: true });

  console.log('Waiting for messages in %s. To exit press CTRL+C', queue);

  channel.consume(
    queue,
    async (msg: any) => {
      if (msg !== null) {
        const content = msg.content.toString();
        const { user, provider }: { user: User; provider: string } = JSON.parse(content);

        console.log('Received message', content);

        try {
          await syncUserData(user, provider);
          console.log('Email sync completed for user:', user.email);
        } catch (error) {
          console.error('Error syncing email for user:', user.email, error);
        }

        channel.ack(msg);
      }
    },
    { noAck: false },
  );
};

consumeMessages().catch((err) => {
  console.error('Error in consumer', err);
});
