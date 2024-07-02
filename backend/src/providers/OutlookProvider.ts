import { IEmailProvider } from './IEmailProvider';
import axios from 'axios';
import { User } from '../models';
import { v4 as uuidv4 } from 'uuid';

export class OutlookProvider implements IEmailProvider {
  private clientId = process.env.OUTLOOK_CLIENT_ID!;
  private clientSecret = process.env.OUTLOOK_CLIENT_SECRET!;
  private redirectUri = process.env.CALLBACK_URL!;

  getAuthUrl(): string {
    const params = new URLSearchParams({
      client_id: this.clientId,
      response_type: 'code',
      redirect_uri: this.redirectUri,
      response_mode: 'query',
      scope: 'openid profile email offline_access User.Read Mail.Read',
      state: uuidv4(),
    });
    return `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?${params.toString()}`;
  }

  async handleCallback(code: string): Promise<User> {
    const tokenResponse = await axios.post(
      'https://login.microsoftonline.com/common/oauth2/v2.0/token',
      new URLSearchParams({
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'authorization_code',
        code,
        redirect_uri: this.redirectUri,
      }),
    );
    const accessToken = tokenResponse.data.access_token;
    const userResponse = await axios.get('https://graph.microsoft.com/v1.0/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return {
      id: uuidv4(),
      email: userResponse.data.mail,
      accessToken,
      provider: 'outlook',
    };
  }

  async fetchEmails(accessToken: string): Promise<any[]> {
    const response = await axios.get('https://graph.microsoft.com/v1.0/me/messages', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.value;
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
