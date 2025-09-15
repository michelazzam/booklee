import { AxiosError } from 'axios';

import { withErrorCatch } from '../axios/error';
import { apiClient } from '../axios/interceptor';

import { GetMeResType, SignUpReqType, LoginReqType } from './types';
import { authClient } from './auth-client';

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
  const { firstName, lastName, email, password, role, phone, salonName } = data;
  const name = `${firstName} ${lastName}`.trim();

  const [response] = await withErrorCatch(
    authClient.signUp.email({
      name,
      email,
      password,
      fetchOptions: {
        body: {
          role,
          phone,
          lastName,
          firstName,
          salonName,
        },
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

/*** API for forgot password ***/
export const forgotPasswordApi = async (email: string) => {
  const [response] = await withErrorCatch(
    authClient.requestPasswordReset({
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

/*** API for reset password ***/
export const resetPasswordApi = async ({
  token,
  newPassword,
}: {
  token: string;
  newPassword: string;
}) => {
  const [response] = await withErrorCatch(
    authClient.resetPassword({
      token,
      newPassword,
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

/*** API for verify email ***/
export const verifyEmailApi = async (token: string) => {
  const [response] = await withErrorCatch(
    authClient.verifyEmail({
      query: { token },
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

export const resendEmailVerificationApi = async (email: string) => {
  const [response] = await withErrorCatch(
    authClient.sendVerificationEmail({
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
