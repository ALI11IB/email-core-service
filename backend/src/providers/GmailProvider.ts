import { IEmailProvider } from './IEmailProvider';
import axios from 'axios';
import { User } from '../models';
import { v4 as uuidv4 } from 'uuid';

export class GmailProvider implements IEmailProvider {
  private clientId = process.env.GMAIL_CLIENT_ID!;
  private clientSecret = process.env.GMAIL_CLIENT_SECRET!;
  private redirectUri = process.env.CALLBACK_URL!;

  getAuthUrl(): string {
    const params = new URLSearchParams({
      client_id: this.clientId,
      response_type: 'code',
      redirect_uri: this.redirectUri,
      scope: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/gmail.readonly',
      state: uuidv4(),
    });
    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  async handleCallback(code: string): Promise<User> {
    const tokenResponse = await axios.post(
      'https://oauth2.googleapis.com/token',
      new URLSearchParams({
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'authorization_code',
        code,
        redirect_uri: this.redirectUri,
      }),
    );
    const accessToken = tokenResponse.data.access_token;
    const userResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return {
      id: uuidv4(),
      email: userResponse.data.email,
      accessToken,
      provider: 'gmail',
    };
  }

  async fetchEmails(accessToken: string): Promise<any[]> {
    const response = await axios.get('https://www.googleapis.com/gmail/v1/users/me/messages', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.messages;
  }

  async fetchMailboxDetails(accessToken: string): Promise<any[]> {
    const response = await axios.get('https://graph.microsoft.com/v1.0/me/mailFolders', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const mailboxDetails = response.data.value.map((folder: any) => ({
      name: folder.displayName,
      folderId: folder.id,
    }));
    return response.data.value;
  }
}