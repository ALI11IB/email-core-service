import indicesConfig from './indicesConfig';
import client from './elasticsearch';

async function createIndices() {
  try {
    for (const index of Object.keys(indicesConfig)) {
      const exists = await client.indices.exists({ index });
      if (!exists) {
        await client.indices.create({
          index,
          body: (indicesConfig as any)[index],
        });
        console.log(`${index} index created`);
      } else {
        console.log(`${index} index already exists`);
      }
    }
  } catch (err) {
    console.error('Error creating indices:', err);
  }
}

export default createIndices;
