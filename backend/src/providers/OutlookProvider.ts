import { IEmailProvider } from './IEmailProvider';
import axios from 'axios';
import { User } from '../models';
import { v4 as uuidv4 } from 'uuid';

export class OutlookProvider implements IEmailProvider {
  private clientId = process.env.OUTLOOK_CLIENT_ID!;
  private clientSecret = process.env.OUTLOOK_CLIENT_SECRET!;
  private redirectUri = process.env.CALLBACK_URL!;
  private webhookUrl = process.env.NGROK_URL + process.env.WEBHOOK_URL!;

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
      id: userResponse?.data?.id + '_' + userResponse?.data?.mail?.split('@')[0] ?? '',
      email: userResponse?.data?.mail,
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

    return response.data.value;
  }

  async createSubscription(accessToken: string): Promise<any> {
    const token = accessToken;
    const subscription = {
      changeType: 'created',
      notificationUrl: this.webhookUrl,
      resource: 'me/mailFolders/inbox/messages',
      expirationDateTime: new Date(Date.now() + 3600000).toISOString(),
      clientState: 'secretClientValue',
    };

    try {
      const response = await axios.post('https://graph.microsoft.com/v1.0/subscriptions', subscription, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Subscription created:', response.data);
    } catch (error: any) {
      console.error('Error creating subscription:', error?.response?.data?.error);
    }
  }

  async fetchNewEmail(accessToken: string, messageId: string): Promise<any> {
    const response = await axios.get(`https://graph.microsoft.com/v1.0/me/messages/${messageId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  }
}
