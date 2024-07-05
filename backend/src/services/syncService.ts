import { indexEmailMessages, indexMailBoxDetails } from '../config/indexData';
import { User } from '../models';
import { ProviderFactory } from '../providers/ProviderFactory';
import { addMailBoxDetails, addMessage } from './mailService';

export const syncUserData = async (user: User, provider: string): Promise<void> => {
  const { accessToken, email: userEmail } = user;

  const emailProvider = ProviderFactory.getProvider(provider);
  const mailboxes = await emailProvider.fetchMailboxDetails(accessToken);
  const emails = await emailProvider.fetchEmails(accessToken);

  await addMailBoxDetails({
    userEmail,
    mailboxes,
  });
  await addMessage(userEmail, emails);
  // for (let email of emails) {
  //   await addMessage(userEmail, email);
  // }
};
