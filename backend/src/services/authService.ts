import { ProviderFactory } from '../providers/ProviderFactory';

export const getAuthUrl = (provider: string): string => {
  const emailProvider = ProviderFactory.getProvider(provider);
  return emailProvider.getAuthUrl();
};

export const handleCallback = async (provider: string, code: string) => {
  const emailProvider = ProviderFactory.getProvider(provider);
  return await emailProvider.handleCallback(code);
};

export const createSubscription = async (provider: string, accessToken: string) => {
  const emailProvider = ProviderFactory.getProvider(provider);
  return await emailProvider.createSubscription(accessToken);
};
