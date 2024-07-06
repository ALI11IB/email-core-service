import client from '../config/elasticsearch';
import { indexUser } from '../config/indexData';
import { User } from '../models';

export const getUser = async (id: string): Promise<User | null> => {
  try {
    const res = await client.get({
      index: 'users',
      id,
    });
    return res._source as User;
  } catch (error: any) {
    console.log('error getting user', error);
    // if (error.meta.statusCode === 404) {
    //   return null;
    // }
    return null;
  }
};

export const addUser = async (data: User): Promise<void> => {
  try {
    await client.index({
      index: 'users',
      id: data?.id,
      body: {
        id: data?.id,
        email: data?.email,
        accessToken: data?.accessToken,
        provider: data?.provider,
      },
    });
    console.log('User data indexed');

    await client.indices.refresh({ index: 'users' });
  } catch (err) {
    console.error('Error indexing data:', err);
  }
};

export const updateUser = async (data: User): Promise<void> => {
  try {
    await client.update({
      index: 'users',
      id: data?.id,
      body: {
        doc: data,
      },
    });
    await client.indices.refresh({ index: 'users' });
  } catch (err) {
    console.error('Error updating user:', err);
  }
};
