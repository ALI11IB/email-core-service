import client from '../config/elasticsearch';
import { EmailMessage, MailBoxDetails } from '../models';

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
      if (!exists) {
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

export const searchMessages = async (userEmail: string, query: any): Promise<any> => {
  try {
    let esQuery;
    if (query?.length > 0) {
      esQuery = {
        index: 'email_messages',
        body: {
          query: {
            bool: {
              must: [
                {
                  multi_match: {
                    query: query,
                    fields: ['subject', 'bodyPreview', 'sender', 'recipient'],
                  },
                },
                {
                  term: {
                    userEmail: userEmail,
                  },
                },
              ],
            },
          },
        },
      };
    } else {
      console.log('================222222====================');
      console.log();
      console.log('====================================');
      esQuery = {
        index: 'email_messages',
        body: {
          query: {
            match: {
              userEmail: userEmail,
            },
          },
        },
      };
    }
    const res = await client.search(esQuery);
    const messages = res.hits.hits.map((hit: any) => hit._source);

    return messages;
  } catch (error: any) {
    console.log('error getting messages:', error);

    return null;
  }
};

export async function addMailBoxDetails(data: MailBoxDetails) {
  try {
    const exists = await client.exists({
      index: 'mailbox_details',
      id: data.userEmail,
    });

    if (exists) {
      const existingData: any = await client.get({
        index: 'mailbox_details',
        id: data.userEmail,
      });

      const existingMailboxes = existingData?._source.mailboxes;

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
      await client.index({
        index: 'mailbox_details',
        id: data.userEmail,
        body: {
          userEmail: data.userEmail,
          mailboxes: data.mailboxes,
        },
      });
      console.log('Mailbox details indexed');
    }
    await client.indices.refresh({ index: 'mailbox_details' });
  } catch (err) {
    console.error('Error indexing data:', err);
  }
}

export const getMailBoxDetails = async (userEmail: string): Promise<any> => {
  try {
    const res: any = await client.search({
      index: 'mailbox_details',
      body: {
        query: {
          match: {
            userEmail: userEmail,
          },
        },
      },
    });
    if (res.hits.hits.length > 0) {
      return res.hits.hits[0]._source;
    } else return null;
  } catch (error: any) {
    console.log('error getting mail box details', error);

    return null;
  }
};

export async function searcMailBoxDetails(email?: string) {
  try {
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
