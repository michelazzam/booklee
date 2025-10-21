import { expoClient } from '@better-auth/expo/client';
import { createAuthClient } from 'better-auth/react';
import * as SecureStore from 'expo-secure-store';

import { ENV } from '~/src/constants';

export const authClient = createAuthClient({
  baseURL: `${ENV.API_URL}/auth`,
  plugins: [
    expoClient({
      scheme: 'booklee',
      storage: SecureStore,
      storagePrefix: 'booklee',
    }),
  ],
});
