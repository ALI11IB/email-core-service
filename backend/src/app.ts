import express from 'express';
import cors from 'cors';
// import { createUserController, getUserController } from './controllers/userController';
import { getAuthUrlController, authCallbackController, webHookController } from './controllers/authController';
import { getEmailsController } from './controllers/emailController';

const app = express();

app.use(express.json());

app.use(cors());

app.get('/auth/url', getAuthUrlController);
app.get('/auth/callback', authCallbackController);
app.get('/auth/webhook', webHookController);
app.get('/emails', getEmailsController);

export default app;
