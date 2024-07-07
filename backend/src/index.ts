import app from './app';
import dotenv from 'dotenv';
import createIndices from './config/createIndices';
import { connectToRabbitMQ } from './config/rabbitmq';
import { consumeMessages } from './workers/emailSyncWorker';
import client from './config/elasticsearch';
import { Server } from 'socket.io';
import http from 'http';
import https from 'https';
import fs from 'fs';
import path from 'path';

dotenv.config();

const PORT = process.env.PORT || 3000;
// const options = {
//   key: fs.readFileSync(path.resolve(__dirname, './utils/email-service.key')),
//   cert: fs.readFileSync(path.resolve(__dirname, './utils/email-service.crt')),
//   requestCert: false, // Do not request a certificate from clients
//   rejectUnauthorized: false, // Accept self-signed or
// };

// Create the HTTPS server
const server = http.createServer(app);
// const serverHttps = https.createServer(options, app);

// const serverHttp = http.createServer((req, res) => {
//   if(req.url!?.includes('auth/webhook'))
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');

//   // Check if the request method is OPTIONS
//   if (req.method === 'OPTIONS') {
//     // Send a 204 No Content response for preflight requests
//     res.writeHead(204);
//     res.end();
//     return;
//   }
//   res.writeHead(301, { Location: 'https://' + req.headers['host']?.replace('3000', '8443') + req.url });
//   res.end();
// });
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
    // serverHttps.listen(8443, async () => {
    //   console.log(`Server is running on port ${8443}`);
    // });
    server.listen(PORT, async () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((er) => console.log(er));
