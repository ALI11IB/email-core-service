import client from '../config/elasticsearch';
import { indexUser } from '../config/indexData';
import { User } from '../models';

export const getUser = async (userId: string): Promise<User | null> => {
  try {
    const res = await client.search({
      index: 'users',
      body: {
        query: {
          match: {
            id: userId,
          },
        },
      },
    });

    if (res.hits.hits.length > 0) {
      return res.hits.hits[0]._source as User;
    } else return null;
  } catch (error: any) {
    console.log('error getting user', error);
    // if (error.meta.statusCode === 404) {
    //   return null;
    // }
    return null;
  }
};

export async function getUserByEmail(email: string): Promise<any> {
  try {
    const res = await client.search({
      index: 'users',
      body: {
        query: {
          match: { email },
        },
      },
    });

    if (res.hits.hits.length > 0) {
      return res.hits.hits[0]._source;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching user by email:', error);
    throw error;
  }
}

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
