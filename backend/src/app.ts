import cors from 'cors';
import express from 'express';
import { authCallbackController, getAuthUrlController, webHookController } from './controllers/authController';
import { getEmailsController, getMailBoxesController } from './controllers/emailController';

const app = express();

app.use(express.json());

app.use(cors());

app.get('/api/auth/url', getAuthUrlController);
app.get('/auth/callback', authCallbackController);
app.get('/auth/webhook', webHookController);
app.get('/api/emails/search', getEmailsController);
app.get('/api/mailBoxes', getMailBoxesController);

export default app;
