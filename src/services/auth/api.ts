import { AxiosError } from 'axios';

import { withErrorCatch } from '../axios/error';
import { apiClient } from '../axios/interceptor';

import { GetMeResType, SignUpReqType, LoginReqType } from './types';
import { authClient } from './auth-client';

/*** API for get me ***/
export const getMeApi = async () => {
  const [response, error] = await withErrorCatch(apiClient.get<GetMeResType>(`user/me`));

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
  const { firstName, lastName, email, password, role, phone } = data;
  const name = `${firstName} ${lastName}`.trim();

  const [response, error] = await withErrorCatch(
    authClient.signUp.email({
      name,
      email,
      password,

      role,
      phone,
      lastName,
      firstName,
    } as any)
  );

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

/*** API for login ***/
export const loginWithEmailApi = async (data: LoginReqType) => {
  const { email = '', password } = data;

  const [response, error] = await withErrorCatch(authClient.signIn.email({ email, password }));

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

/*** API for logout ***/
export const logoutApi = async () => {
  const [response, error] = await withErrorCatch(authClient.signOut());

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

/*** API for Google login ***/
export const googleLoginApi = async () => {
  const [response, error] = await withErrorCatch(
    authClient.signIn.social({
      provider: 'google',
      callbackURL: '/(authenticated)/(tabs)',
    })
  );

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

/*** API for forgot password ***/
export const forgotPasswordApi = async (email: string) => {
  const [response, error] = await withErrorCatch(
    authClient.forgetPassword({
      email,
      redirectTo: '/(unauthenticated)/login/forgot-password/reset',
    })
  );

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

/*** API for reset password ***/
export const resetPasswordApi = async ({
  token,
  newPassword,
}: {
  token: string;
  newPassword: string;
}) => {
  const [response, error] = await withErrorCatch(
    authClient.resetPassword({
      token,
      newPassword,
    })
  );

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

/*** API for verify email ***/
export const verifyEmailApi = async (token: string) => {
  const [response, error] = await withErrorCatch(
    authClient.verifyEmail({
      query: { token },
    })
  );

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
