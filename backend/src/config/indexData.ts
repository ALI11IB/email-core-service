import { EmailMessage, MailBoxDetails, User } from '../models';

const client = require('../config/elasticsearch');

export async function indexUser(data: User) {
  try {
    await client.index({
      index: 'users',
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
}

export async function indexEmailMessages(data: EmailMessage) {
  try {
    await client.index({
      index: 'email_messages',
      body: {
        userEmail: data?.userEmail,
        id: data?.id,
        sender: data?.sender,
        from: data?.from,
        createdDateTime: data?.createdDateTime,
        receivedDateTime: data?.receivedDateTime,
        sentDateTime: data?.sentDateTime,
        subject: data?.subject,
        bodyPreview: data?.bodyPreview,
        isRead: data?.isRead,
        isDraft: data?.isDraft,
        inferenceClassification: data?.inferenceClassification,
        body: data?.body,
      },
    });
    console.log('Email message indexed');

    await client.indices.refresh({ index: 'email_messages' });
  } catch (err) {
    console.error('Error indexing data:', err);
  }
}

export async function indexMailBoxDetails(data: MailBoxDetails) {
  try {
    await client.index({
      index: 'mailbox_details',
      body: {
        userEmail: data.userEmail,
        mailboxes: data.mailboxes,
      },
    });
    console.log('Mailbox details indexed');

    await client.indices.refresh({ index: 'mailbox_details' });
  } catch (err) {
    console.error('Error indexing data:', err);
  }
}
