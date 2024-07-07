import { User } from '../models';

export interface IEmailProvider {
  getAuthUrl(): string;
  handleCallback(code: string): Promise<User>;
  fetchEmails(accessToken: string): Promise<any[]>;
  fetchMailboxDetails(accessToken: string): Promise<any[]>;
  createSubscription(accessToken: string): Promise<any>;
  fetchNewEmail(accessToken: string, messageId: string): Promise<any>;
}
