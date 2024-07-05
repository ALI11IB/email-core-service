const indicesConfig = {
  email_messages: {
    mappings: {
      properties: {
        userEmail: { type: 'keyword' },
        id: { type: 'keyword' },
        sender: { type: 'keyword' },
        from: { type: 'keyword' },
        createdDateTime: { type: 'date' },
        receivedDateTime: { type: 'date' },
        sentDateTime: { type: 'date' },
        subject: { type: 'text' },
        bodyPreview: { type: 'text' },
        isRead: { type: 'boolean' },
        isDraft: { type: 'boolean' },
        inferenceClassification: { type: 'keyword' },
        body: { type: 'object' },
        parentFolderId: { type: 'keyword' },
      },
    },
  },
  mailbox_details: {
    mappings: {
      properties: {
        userEmail: { type: 'keyword' },
        mailboxes: {
          type: 'nested',
          properties: {
            id: { type: 'keyword' },
            displayName: { type: 'keyword' },
            parentFolderId: { type: 'keyword' },
            childFolderCount: { type: 'integer' },
            unreadItemCount: { type: 'integer' },
            totalItemCount: { type: 'integer' },
            sizeInBytes: { type: 'integer' },
            isHidden: { type: 'boolean' },
          },
        },
      },
    },
  },
  users: {
    mappings: {
      properties: {
        id: { type: 'keyword' },
        email: { type: 'keyword' },
        accessToken: { type: 'text' },
        provider: { type: 'keyword' },
      },
    },
  },
};

export default indicesConfig;
