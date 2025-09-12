import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { authClient } from './auth-client';
import {
  loginWithEmailApi,
  forgotPasswordApi,
  resetPasswordApi,
  verifyEmailApi,
  googleLoginApi,
  signUpApi,
  logoutApi,
  getMeApi,
} from './api';

import type { ResErrorType } from '../axios/types';
import type { GetMeResType } from './types';

import { useUserProvider } from '~/src/store';

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
  const { isInitialized } = useUserProvider();

  return useQuery<GetMeResType, ResErrorType, GetMeResType['user']>({
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
    enabled: !!session?.session?.token && isInitialized,
  });
};

const useLogin = () => {
  /*** Constants ***/
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loginWithEmailApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getMe'] });
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

  return useMutation({
    mutationFn: googleLoginApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getMe'] });
    },
  });
};

const useForgotPassword = () => {
  return useMutation({
    mutationFn: forgotPasswordApi,
  });
};

const useResetPassword = () => {
  return useMutation({
    mutationFn: resetPasswordApi,
  });
};

const useVerifyEmail = () => {
  return useMutation({
    mutationFn: verifyEmailApi,
  });
};

export const AuthServices = {
  useGetBetterAuthUser,
  useForgotPassword,
  useResetPassword,
  useGoogleLogin,
  useVerifyEmail,
  useSession,
  useLogout,
  useSignUp,
  useGetMe,
  useLogin,
};
