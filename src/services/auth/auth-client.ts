import { createAuthClient } from 'better-auth/react';
import { expoClient } from '@better-auth/expo/client';
import * as SecureStore from 'expo-secure-store';

export const authClient = createAuthClient({
  baseURL: 'https://www.booklee.app/api/auth',
  plugins: [
    expoClient({
      scheme: 'booklee',
      storage: SecureStore,
      storagePrefix: 'booklee',
    }),
  ],
});
