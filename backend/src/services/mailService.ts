import client from '../config/elasticsearch';
import { indexUser } from '../config/indexData';
import { EmailMessage, MailBoxDetails, User } from '../models';

import { v4 as uuidv4 } from 'uuid';

export const addMessage = async (userEmail: string, emails: Array<EmailMessage>): Promise<void> => {
  try {
    let bulkOps = [];

    for (let data of emails) {
      const id = data?.id || uuidv4();

      // Check if the email message already exists
      const exists = await client.exists({
        index: 'email_messages',
        id: id,
      });
      console.log('=============exists=======================');
      console.log(exists);
      console.log('===============exists=====================');
      if (!exists) {
        // If the message does not exist, add it to the bulk operations
        bulkOps.push({
          index: { _index: 'email_messages', _id: id },
        });
        bulkOps.push({
          userEmail: userEmail,
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
          parentFolderId: data?.parentFolderId,
        });
      }
    }

    if (bulkOps.length > 0) {
      const response = await client.bulk({ refresh: true, body: bulkOps });

      if (response.errors) {
        console.log('===============response=====================');
        console.log(response);
        console.log('================response====================');
        let erroredDocuments: any = [];
        response.items.forEach((action: any, i: number) => {
          const operation = Object.keys(action)[0];
          if (action[operation].error) {
            erroredDocuments.push({
              status: action[operation].status,
              error: action[operation].error,
              operation: bulkOps[i * 2],
              document: bulkOps[i * 2 + 1],
            });
          }
        });
        console.error('Bulk indexing errors:', erroredDocuments);
      } else {
        console.log('Email messages indexed successfully');
      }
    } else {
      console.log('No new email messages to index');
    }
  } catch (err) {
    console.error('Error indexing email_messages:', err);
  }
};

export const getMessages = async (userEmail: string): Promise<any> => {
  try {
    const res = await client.search({
      index: 'email_messages',
      body: {
        query: {
          match: {
            userEmail: userEmail,
          },
        },
      },
    });

    // Extract the messages from the response
    console.log('==============res email_messages======================');
    console.log(res);
    console.log('===================res=================');
    const messages = res.hits.hits.map((hit: any) => hit._source);

    return messages;
  } catch (error: any) {
    console.log('==============error email_messages======================');
    console.log(error);
    console.log('===================error=================');

    return null;
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

export const getMailBoxDetails = async (email: string): Promise<any> => {
  try {
    const res = await client.get({
      index: 'mailbox_details',
      id: email,
    });
    return res._source;
  } catch (error: any) {
    console.log('==============error mailbox_details======================');
    console.log(error);
    console.log('===================error=================');

    return null;
  }
};

export async function searcMailBoxDetails(email?: string) {
  try {
    // Search for email messages for a specific user
    const mailBoxDetails: any = await client.search({
      index: 'mailbox_details',
      body: {
        query: {
          match: { userEmail: email },
        },
      },
    });
    console.log('mailBoxDetails:', mailBoxDetails.hits.hits);
    return mailBoxDetails.hits.hits;
  } catch (err) {
    console.error('Error searching data:', err);
  }
}

export async function searchMessages(email?: string) {
  try {
    // Search for email messages for a specific user
    const emailMessages: any = await client.search({
      index: 'email_messages',
      body: {
        query: {
          match: { userEmail: email },
        },
      },
    });
    console.log('Email messages:', emailMessages);
    return emailMessages.hits.hits;
  } catch (err) {
    console.error('Error searching data:', err);
  }
}
