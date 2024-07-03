import { Request, Response } from 'express';
import { verifyToken } from '../utils';
import { searcMailBoxDetails, searchMessages } from '../services/mailService';
import { getUser } from '../services/userService';

export const getEmailsController = async (req: Request, res: Response) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401); // Unauthorized
  }
  const userId = verifyToken(token);
  if (!userId) {
    return res.sendStatus(401); // Unauthorized
  }
  const user = await getUser(userId);

  if (!userId) {
    return res.sendStatus(404); // not found
  }
  const mails = searchMessages(user?.email);
  const mailBoxDetails = searcMailBoxDetails(user?.email);
  res.status(200).json({ mails, mailBoxDetails });
};
