export interface User {
  id: string;
  email: string;
  accessToken: string;
  provider: string;
}

export interface EmailMessage {
  userEmail: string;
  id: string;
  sender: Sender;
  from: Sender;
  createdDateTime: string;
  receivedDateTime: string;
  sentDateTime: string;
  subject: string;
  bodyPreview: string;
  isRead: boolean;
  isDraft: boolean;
  inferenceClassification: string;
  body: any;
  parentFolderId: string;
}

export interface MailBoxDetails {
  userEmail: string;
  mailboxes: MailBox[];
}

export interface MailBox {
  id: string;
  displayName: string;
  parentFolderId: string;
  childFolderCount: string;
  unreadItemCount: string;
  totalItemCount: string;
  sizeInBytes: string;
  isHidden: string;
}
export interface Sender {
  emailAddress: {
    name: string;
    address: string;
  };
}
