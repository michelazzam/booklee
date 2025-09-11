import { createAuthClient } from 'better-auth/react';
import { expoClient } from '@better-auth/expo/client';
import * as SecureStore from 'expo-secure-store';

export const authClient = createAuthClient({
  baseURL: 'https://booklee.app/api/auth', // Base URL of your Better Auth backend.
  plugins: [
    expoClient({
      scheme: 'booklee',
      storagePrefix: 'booklee',
      storage: SecureStore,
    }),
  ],
});
