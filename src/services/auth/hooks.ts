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
  appleLoginApi,
  signUpApi,
  logoutApi,
  getMeApi,
} from './api';

import type { GetMeResType, UserType } from './types';
import type { ResErrorType } from '../axios/types';
import { ENV } from '~/src/constants';

const setAuthHeaders = async () => {
  try {
    const cookies = await authClient.getCookie();
    const headers = {
      Cookie: cookies,
      'x-vercel-protection-bypass': ENV.VERCEL_PROTECTION_BYPASS,
    };

    apiClient.defaults.headers.common = headers;
  } catch (error) {
    console.error('Error setting auth headers', error);
  }
};

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
    // React Query will return cached data even when disabled (for guest users)
  });
};

const useLogin = () => {
  /*** Constants ***/
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loginWithEmailApi,
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['getMe'] });
      setAuthHeaders();
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
    onSuccess: setAuthHeaders,
  });
};

const useLogout = () => {
  /*** Constants ***/
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      queryClient.clear();
      setAuthHeaders();
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
      setAuthHeaders();
    },
  });
};

const useAppleLogin = () => {
  /*** Constants ***/
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: appleLoginApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getMe'] });
      setAuthHeaders();
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
  useAppleLogin,
  useSession,
  useLogout,
  useSignUp,
  useGetMe,
  useLogin,
};
