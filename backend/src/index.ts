import app from './app';
import dotenv from 'dotenv';
import createIndices from './config/createIndices';
import { connectToRabbitMQ } from './config/rabbitmq';
import { consumeMessages } from './workers/emailSyncWorker';
import client from './config/elasticsearch';
import { Server } from 'socket.io';
import http from 'http';

dotenv.config();

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);
export const io = new Server(server);

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
    await connectToRabbitMQ(); // Connect to RabbitMQ on startup
    consumeMessages(); // Start consuming messages
    server.listen(PORT, async () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((er) => console.log(er));
