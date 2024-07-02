export interface User {
  id: string;
  email: string;
  accessToken: string;
  provider: string;
}

export interface EmailMessage {
  userEmail: string;
  id: string;
  sender: string;
  from: string;
  createdDateTime: string;
  receivedDateTime: string;
  sentDateTime: string;
  subject: string;
  bodyPreview: string;
  isRead: boolean;
  isDraft: boolean;
  inferenceClassification: string;
  body: any;
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
