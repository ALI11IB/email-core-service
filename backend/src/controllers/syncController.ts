import { Request, Response } from 'express';
import { syncEmails } from '../services/syncService';

export const syncEmailsController = async (req: Request, res: Response) => {
    const { userId } = req.params;
    await syncEmails(userId);
    res.status(200).json({ message: 'Emails synchronized successfully' });
};
