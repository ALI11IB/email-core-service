import { indexEmailMessages, indexMailBoxDetails } from '../config/indexData';
import { User } from '../models';
import { ProviderFactory } from '../providers/ProviderFactory';
// import client from '../config/elasticsearch';
// import { getUse/rById } from './userService';

// export const syncEmails = async (userId: string) => {
//   const user = await getUserById(userId);
//   if (!user) {
//     throw new Error(`User with ID ${userId} not found`);
//   }
//   const emailProvider = ProviderFactory.getProvider(user.provider);
//   const emails = await emailProvider.fetchEmails(user.accessToken);
//   for (const email of emails) {
//     await client.index({
//       index: `emails-${userId}`,
//       id: email.id,
//       body: email,
//     });
//   }
// };

export const syncUserData = async (user: User, provider: string): Promise<void> => {
  const { accessToken, email } = user;

  const emailProvider = ProviderFactory.getProvider(provider);
  const mailboxes = await emailProvider.fetchMailboxDetails(accessToken);
  const emails = await emailProvider.fetchEmails(accessToken);

  await indexMailBoxDetails({
    userEmail: email,
    mailboxes,
  });

  for (const email of emails) {
    await indexEmailMessages(email);
  }

  // Add other providers' logic here as needed
};
