import { betterAuth } from 'better-auth';
import { expo } from '@better-auth/expo';

export const auth = betterAuth({
  plugins: [expo()],
  emailAndPassword: {
    enabled: true, // Enable authentication using email and password.
  },

  social: {
    enabled: true, // Enable authentication using social providers.
    providers: [
      {
        id: 'google',
        enabled: true,
      },
    ],
  },
});
