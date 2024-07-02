import { Request, Response } from 'express';
import { getAuthUrl, handleCallback } from '../services/authService';
import { addUser, getUser, updateUser } from '../services/userService';
import { connectToRabbitMQ, getChannel } from '../config/rabbitmq';

export const getAuthUrlController = (req: Request, res: Response) => {
  const provider = req.query.provider as string;
  const url = getAuthUrl(provider);
  res.status(200).json({ url });
};

export const authCallbackController = async (req: Request, res: Response) => {
  try {
    const provider = req.query.provider as string;
    const code = req.query.code as string;
    const user = await handleCallback(provider, code);

    let existingUser = await getUser(user.id);

    if (!existingUser) {
      // Add new user if not exists
      await addUser(user);
      existingUser = user; // Set existingUser to the newly added user
    } else {
      // Update existing user (e.g., update accessToken)
      await updateUser(user);
    }

    // Connect to RabbitMQ
    await connectToRabbitMQ();
    const channel = getChannel();
    const queue = 'emailSyncQueue';

    const message = JSON.stringify({ user: existingUser, provider });

    await channel.assertQueue(queue, { durable: true });
    channel.sendToQueue(queue, Buffer.from(message), { persistent: true });

    console.log('Message sent to RabbitMQ');

    // Redirect to frontend with user information (use a JWT token for production)
    res.redirect(`http://localhost:3001/sync?token=${existingUser.id}`);
  } catch (error: any) {
    res.status(500).json({ error: error?.message });
  }
};
