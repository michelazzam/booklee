import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { apiClient } from '../axios/interceptor';
import { authClient } from './auth-client';

import {
  sendEmailVerificationOtpApi,
  verifyResetPasswordOtpApi,
  verifyEmailOtpApi,
  loginWithEmailApi,
  forgotPasswordApi,
  resetPasswordApi,
  googleLoginApi,
  signUpApi,
  logoutApi,
  getMeApi,
} from './api';

import type { GetMeResType, UserType } from './types';
import type { ResErrorType } from '../axios/types';

export const useSession = () => {
  return authClient.useSession();
};

export const useGetBetterAuthUser = () => {
  /*** Constants ***/
  const { data: session, isPending, error } = authClient.useSession();

  return {
    error,
    isLoading: isPending,
    user: session?.user ?? null,
    isAuthenticated: !!session?.user,
  };
};

export const useGetMe = () => {
  /*** Constants ***/
  const { data: session } = authClient.useSession();

  return useQuery<GetMeResType, ResErrorType, UserType>({
    retry: 1,
    gcTime: Infinity,
    queryFn: getMeApi,
    queryKey: ['getMe'],
    staleTime: Infinity,
    refetchOnMount: false,
    refetchInterval: false,
    select: ({ user }) => user,
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: false,
    enabled: !!session?.session?.token,
  });
};

const useLogin = () => {
  /*** Constants ***/
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loginWithEmailApi,
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['getMe'] });

      try {
        const cookies = await authClient.getCookie();
        const headers = {
          Cookie: cookies,
        };

        apiClient.defaults.headers.common = headers;
      } catch (error) {
        console.error('Error getting cookies', error);
      }
    },
  });
};

const useSignUp = () => {
  return useMutation({
    mutationFn: signUpApi,
  });
};

const useSendEmailVerificationOtp = () => {
  return useMutation({
    mutationFn: sendEmailVerificationOtpApi,
  });
};

const useVerifyEmailOtp = () => {
  return useMutation({
    mutationFn: verifyEmailOtpApi,
    onSuccess: async () => {
      try {
        const cookies = await authClient.getCookie();
        const headers = {
          Cookie: cookies,
        };

        apiClient.defaults.headers.common = headers;
      } catch (error) {
        console.error('Error getting cookies', error);
      }
    },
  });
};

const useLogout = () => {
  /*** Constants ***/
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      queryClient.clear();
      apiClient.defaults.headers.common = {};
    },
  });
};

const useGoogleLogin = () => {
  /*** Constants ***/
  const queryClient = useQueryClient();
  const cookies = authClient.getCookie();
  const headers = {
    Cookie: cookies,
  };

  return useMutation({
    mutationFn: googleLoginApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getMe'] });
      apiClient.defaults.headers.common = headers;
    },
  });
};

const useForgotPassword = () => {
  return useMutation({
    mutationFn: forgotPasswordApi,
  });
};

const useVerifyResetPasswordOtp = () => {
  return useMutation({
    mutationFn: verifyResetPasswordOtpApi,
  });
};

const useResetPassword = () => {
  return useMutation({
    mutationFn: resetPasswordApi,
  });
};

export const AuthServices = {
  useSendEmailVerificationOtp,
  useVerifyResetPasswordOtp,
  useGetBetterAuthUser,
  useForgotPassword,
  useVerifyEmailOtp,
  useResetPassword,
  useGoogleLogin,
  useSession,
  useLogout,
  useSignUp,
  useGetMe,
  useLogin,
};
