import * as AppleAuthentication from 'expo-apple-authentication';
import { authClient } from './auth-client';
import { randomUUID } from 'expo-crypto';
import { AxiosError } from 'axios';

import { withErrorCatch } from '../axios/error';
import { apiClient } from '../axios/interceptor';

import {
  VerifyEmailOtpReqType,
  ResetPasswordReqType,
  SignUpReqType,
  GetMeResType,
  LoginReqType,
} from './types';

/*** API for get me ***/
export const getMeApi = async () => {
  const [response, error] = await withErrorCatch(apiClient.get<GetMeResType>(`/user/me`));

  if (error instanceof AxiosError) {
    throw {
      ...error.response?.data,
      status: error.response?.status,
    };
  } else if (error) {
    throw error;
  }

  return response?.data;
};

/*** API for sign up ***/
export const signUpApi = async (data: SignUpReqType) => {
  const { email, password, ...rest } = data;

  const [response] = await withErrorCatch(
    authClient.signUp.email({
      email,
      password,
      name: `${rest.firstName} ${rest.lastName}`,
      fetchOptions: {
        body: rest,
      },
    })
  );

  if (response?.error instanceof AxiosError) {
    throw {
      ...response?.error.response?.data,
      status: response?.error.response?.status,
    };
  } else if (response?.error) {
    throw response?.error;
  }

  return response?.data;
};

/*** API for send Email Verification OTP ***/
export const sendEmailVerificationOtpApi = async (email: string) => {
  const [response] = await withErrorCatch(
    authClient.emailOtp.sendVerificationOtp({ email, type: 'email-verification' })
  );

  if (response?.error instanceof AxiosError) {
    throw {
      ...response?.error.response?.data,
      status: response?.error.response?.status,
    };
  } else if (response?.error) {
    throw response?.error;
  }

  return response?.data;
};

/*** API for verify Email OTP ***/
export const verifyEmailOtpApi = async (data: VerifyEmailOtpReqType) => {
  const { email, otp } = data;

  const [response] = await withErrorCatch(authClient.emailOtp.verifyEmail({ email, otp }));

  if (response?.error instanceof AxiosError) {
    throw {
      ...response?.error.response?.data,
      status: response?.error.response?.status,
    };
  } else if (response?.error) {
    throw response?.error;
  }

  return response?.data;
};

/*** API for login ***/
export const loginWithEmailApi = async (data: LoginReqType) => {
  const { email = '', password } = data;

  const [response] = await withErrorCatch(authClient.signIn.email({ email, password }));

  if (response?.error instanceof AxiosError) {
    throw {
      ...response?.error.response?.data,
      code: response?.error.code,
    };
  } else if (response?.error) {
    throw response?.error;
  }

  return response?.data;
};

/*** API for Google login ***/
export const googleLoginApi = async () => {
  const [response] = await withErrorCatch(
    authClient.signIn.social({
      provider: 'google',
      callbackURL: '/(authenticated)/(tabs)',
    })
  );

  if (response?.error instanceof AxiosError) {
    throw {
      ...response?.error.response?.data,
      status: response?.error.response?.status,
    };
  } else if (response?.error) {
    throw response?.error;
  }

  return response?.data;
};

/*** API for Apple login ***/
export const appleLoginApi = async () => {
  const rawNonce = randomUUID();

  const cred = await AppleAuthentication.signInAsync({
    nonce: rawNonce,
    state: randomUUID(),
    requestedScopes: [
      AppleAuthentication.AppleAuthenticationScope.EMAIL,
      AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
    ],
  });

  if (!cred?.identityToken) throw new Error('Apple login failed: no idToken');

  const [response] = await withErrorCatch(
    authClient.signIn.social({
      provider: 'apple',
      callbackURL: '/(authenticated)/(tabs)',
      idToken: { token: cred.identityToken },
    })
  );

  if (response?.error instanceof AxiosError) {
    throw {
      ...response?.error.response?.data,
      status: response?.error.response?.status,
    };
  } else if (response?.error) {
    throw response?.error;
  }

  return response?.data;
};

/*** API for logout ***/
export const logoutApi = async () => {
  const [response] = await withErrorCatch(authClient.signOut());

  if (response?.error instanceof AxiosError) {
    throw {
      ...response?.error.response?.data,
      status: response?.error.response?.status,
    };
  } else if (response?.error) {
    throw response?.error;
  }

  return response?.data;
};

/*** API for forgot password ***/
export const forgotPasswordApi = async (email: string) => {
  const [response] = await withErrorCatch(
    authClient.forgetPassword.emailOtp({
      email,
    })
  );

  if (response?.error instanceof AxiosError) {
    throw {
      ...response?.error.response?.data,
      status: response?.error.response?.status,
    };
  } else if (response?.error) {
    throw response?.error;
  }

  return response?.data;
};

/*** API for verify Reset Password Email OTP ***/
export const verifyResetPasswordOtpApi = async (data: VerifyEmailOtpReqType) => {
  const { email, otp } = data;

  const [response] = await withErrorCatch(
    authClient.emailOtp.checkVerificationOtp({
      otp,
      email,
      type: 'forget-password',
    })
  );

  if (response?.error instanceof AxiosError) {
    throw {
      ...response?.error.response?.data,
      status: response?.error.response?.status,
    };
  } else if (response?.error) {
    throw response?.error;
  }

  return response?.data;
};

/*** API for reset password ***/
export const resetPasswordApi = async (data: ResetPasswordReqType) => {
  const [response] = await withErrorCatch(authClient.emailOtp.resetPassword(data));

  if (response?.error instanceof AxiosError) {
    throw {
      ...response?.error.response?.data,
      status: response?.error.response?.status,
    };
  } else if (response?.error) {
    throw response?.error;
  }

  return response?.data;
};
