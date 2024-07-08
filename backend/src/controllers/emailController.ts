import { Request, Response } from 'express';
import { getMailBoxDetails, searchMessages } from '../services/mailService';
import { getUser } from '../services/userService';
import { verifyToken } from '../utils';

export const getMailBoxesController = async (req: Request, res: Response) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }
  const { userId } = verifyToken(token);
  if (!userId) {
    return res.sendStatus(401);
  }
  const user = await getUser(userId);
  if (!user) {
    return res.sendStatus(401);
  }
  const mailBoxDetails = await getMailBoxDetails(user?.email);
  res.status(200).json(mailBoxDetails);
};

export const getEmailsController = async (req: Request, res: Response) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }
  const { userId } = verifyToken(token);
  if (!userId) {
    return res.sendStatus(401);
  }
  const user = await getUser(userId);
  if (!user) {
    return res.sendStatus(401);
  }
  const { query } = req.query;
  const messages = await searchMessages(user?.email, query);
  res.status(200).json(messages);
};
