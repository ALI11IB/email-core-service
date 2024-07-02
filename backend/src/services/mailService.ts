import client from '../config/elasticsearch';
import { indexUser } from '../config/indexData';
import { EmailMessage, MailBoxDetails, User } from '../models';

export const addMessage = async (data: EmailMessage): Promise<void> => {
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
};

export async function addMailBoxDetails(data: MailBoxDetails) {
  try {
    // Check if the mailbox details already exist for the user
    const exists = await client.exists({
      index: 'mailbox_details',
      id: data.userEmail, // Use userEmail as the unique identifier
    });

    if (exists) {
      // Fetch existing mailbox details
      const existingData: any = await client.get({
        index: 'mailbox_details',
        id: data.userEmail,
      });

      const existingMailboxes = existingData?._source.mailboxes;

      // Check for changes
      if (JSON.stringify(existingMailboxes) !== JSON.stringify(data.mailboxes)) {
        // Update the mailbox details if they have changed
        await client.update({
          index: 'mailbox_details',
          id: data.userEmail,
          body: {
            doc: {
              mailboxes: data.mailboxes,
            },
          },
        });
        console.log('Mailbox details updated');
      } else {
        console.log('Mailbox details are up to date');
      }
    } else {
      // Index new mailbox details
      await client.index({
        index: 'mailbox_details',
        id: data.userEmail, // Use userEmail as the unique identifier
        body: {
          userEmail: data.userEmail,
          mailboxes: data.mailboxes,
        },
      });
      console.log('Mailbox details indexed');
    }

    // Refresh the index to make sure the document is immediately available for search
    await client.indices.refresh({ index: 'mailbox_details' });
  } catch (err) {
    console.error('Error indexing data:', err);
  }
}
