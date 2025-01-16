import { ProviderTypes } from '@prisma/client';

export type OauthPayLoad = {
  id: string;
  email: string;
  emailVerified?: boolean;
  providerType: ProviderTypes;
};
