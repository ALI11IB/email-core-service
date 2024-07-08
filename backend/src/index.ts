import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import app from './app';
import createIndices from './config/createIndices';
import { connectToRabbitMQ } from './config/rabbitmq';
import { consumeMessages } from './workers/emailSyncWorker';
import express from 'express';
import path from 'path';

dotenv.config();

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

const isDevelopment = process.env.NODE_ENV !== 'production';
export const io = new Server(server, {
  cors: isDevelopment
    ? {
        origin: `http://localhost:3001`,
        methods: ['GET', 'POST'],
        allowedHeaders: ['email-socket'],
        credentials: true,
      }
    : {},
});

// Serve the static files from the React app
// app.use(express.static(path.join(__dirname, 'path/to/react-app/build')));

// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'path/to/react-app/build', 'index.html'));
// });

// Handle WebSocket connections
io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

createIndices()
  .then(async (res) => {
    // await client.indices.delete({ index: 'email_messages' });
    // Connect to RabbitMQ on startup
    await connectToRabbitMQ();
    // Start consuming messages
    consumeMessages();
    server.listen(PORT, async () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((er) => console.log(er));
