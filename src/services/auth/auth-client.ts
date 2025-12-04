import { emailOTPClient } from 'better-auth/client/plugins';
import { expoClient } from '@better-auth/expo/client';
import { createAuthClient } from 'better-auth/react';
import * as SecureStore from 'expo-secure-store';

import { ENV } from '~/src/constants';

export const authClient = createAuthClient({
  baseURL: `${ENV.API_URL}/auth`,
  fetchOptions: {
    headers: {
      Origin: 'booklee://',
      'x-vercel-protection-bypass': ENV.VERCEL_PROTECTION_BYPASS,
    } as HeadersInit,
  },
  plugins: [
    emailOTPClient(),
    expoClient({
      scheme: 'booklee',
      storage: SecureStore,
      storagePrefix: 'booklee',
    }),
  ],
});
