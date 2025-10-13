import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { apiClient } from '../axios/interceptor';
import { authClient } from './auth-client';

import {
  resendEmailVerificationApi,
  loginWithEmailApi,
  forgotPasswordApi,
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
  const cookies = authClient.getCookie();
  const headers = {
    Cookie: cookies,
  };

  return useMutation({
    mutationFn: loginWithEmailApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getMe'] });
      apiClient.defaults.headers.common = headers;
    },
  });
};

const useSignUp = () => {
  return useMutation({
    mutationFn: signUpApi,
  });
};

const useLogout = () => {
  /*** Constants ***/
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      queryClient.clear();
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

const useResendEmailVerification = () => {
  return useMutation({
    mutationFn: resendEmailVerificationApi,
  });
};

export const AuthServices = {
  useResendEmailVerification,
  useGetBetterAuthUser,
  useForgotPassword,
  useGoogleLogin,
  useSession,
  useLogout,
  useSignUp,
  useGetMe,
  useLogin,
};
