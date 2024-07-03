import app from './app';
import dotenv from 'dotenv';
import createIndices from './config/createIndices';
import { connectToRabbitMQ } from './config/rabbitmq';
import { consumeMessages } from './workers/emailSyncWorker';

dotenv.config();

const PORT = process.env.PORT || 3000;

createIndices()
  .then(async (res) => {
    await connectToRabbitMQ(); // Connect to RabbitMQ on startup
    consumeMessages(); // Start consuming messages
    app.listen(PORT, async () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((er) => console.log(er));
