import app from './app';
import dotenv from 'dotenv';
import createIndices from './config/createIndices';

dotenv.config();

const PORT = process.env.PORT || 3000;

createIndices()
  .then((res) => {
    app.listen(PORT, async () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((er) => console.log(er));
