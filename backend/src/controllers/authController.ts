import { Request, Response } from 'express';
import { fetchNewEmail, getAuthUrl, handleCallback } from '../services/authService';
import { addUser, getUser, getUserByEmail, updateUser } from '../services/userService';
import { connectToRabbitMQ, getChannel } from '../config/rabbitmq';
import jwt from 'jsonwebtoken';
import { generateToken } from '../utils';
import { addMessage } from '../services/mailService';
import { io } from '..';

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
    } else {
      // Update existing user (e.g., update accessToken)
      await updateUser(user);
    }

    // Connect to RabbitMQ
    await connectToRabbitMQ();
    const channel = getChannel();
    const queue = 'emailSyncQueue';

    const message = JSON.stringify({ user, provider });

    await channel.assertQueue(queue, { durable: true });
    channel.sendToQueue(queue, Buffer.from(message), { persistent: true });

    console.log('Message sent to RabbitMQ');
    const token = generateToken(user.id);
    // Redirect to frontend with user information (use a JWT token for production)
    res.redirect(`http://localhost:3001/sync?token=${token}`);
  } catch (error: any) {
    res.status(500).json({ error: error?.message });
  }
};

export const webHookController = async (req: Request, res: Response) => {
  try {
    if (req.query.validationToken) {
      res.status(200).send(req.query.validationToken);
      return;
    }
    const { value } = req.body;

    for (const notification of value) {
      if (notification.clientState === 'secretClientValue') {
        const userEmail = notification.resourceData.userEmail;
        const user = await getUserByEmail(userEmail);

        if (user) {
          const { accessToken, provider } = user;
          const newEmail = await fetchNewEmail(provider, accessToken, notification.resourceData.id);
          await addMessage(notification.resourceData.userEmail, [newEmail]);
          //notify frontend
          io.emit('newEmail', newEmail);
        } else {
          console.error(`User with email ${userEmail} not found.`);
        }
      }
    }

    res.sendStatus(202);
  } catch (error: any) {
    res.status(500).json({ error: error?.message });
  }
};
