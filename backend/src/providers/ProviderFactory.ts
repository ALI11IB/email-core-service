import { IEmailProvider } from './IEmailProvider';
import { OutlookProvider } from './OutlookProvider';
import { GmailProvider } from './GmailProvider';

export class ProviderFactory {
  static getProvider(provider: string): IEmailProvider {
    switch (provider) {
      case 'gmail':
        return new GmailProvider();
      case 'outlook':
      default:
        return new OutlookProvider();
    }
  }
}
