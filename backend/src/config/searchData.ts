import client from './elasticsearch';

async function searchData() {
  try {
    // Search for email messages for a specific user
    const emailMessages: any = await client.search({
      index: 'email_messages',
      body: {
        query: {
          match: { userEmail: 'user@example.com' },
        },
      },
    });
    console.log('Email messages:', emailMessages.body.hits.hits);

    // Get mailbox details for a specific user
    const mailboxDetails: any = await client.search({
      index: 'mailbox_details',
      body: {
        query: {
          match: { userEmail: 'user@example.com' },
        },
      },
    });
    console.log('Mailbox details:', mailboxDetails.body.hits.hits);

    // Get user details by email
    const userDetails: any = await client.search({
      index: 'users',
      body: {
        query: {
          match: { email: 'user@example.com' },
        },
      },
    });
    console.log('User details:', userDetails.body.hits.hits);
  } catch (err) {
    console.error('Error searching data:', err);
  }
}

module.exports = searchData;
