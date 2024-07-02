import express from 'express';
import cors from 'cors';
// import { createUserController, getUserController } from './controllers/userController';
import { getAuthUrlController, authCallbackController } from './controllers/authController';
import { syncEmailsController } from './controllers/syncController';

const app = express();

app.use(express.json());

app.use(cors());

// app.post('/users', createUserController);
// app.get('/users/:id', getUserController);

app.get('/auth/url', getAuthUrlController);
app.get('/auth/callback', authCallbackController);

app.post('/sync/:userId', syncEmailsController);

export default app;
