import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { authClient } from '../auth/auth-client';

import { getUserMeApi, updateUserMeApi } from './api';

import type { ResErrorType } from '../axios/types';
import type { GetUserMeResType } from './types';

export const useGetUserMe = () => {
  /*** Constants ***/
  const { data: session } = authClient.useSession();

  return useQuery<GetUserMeResType, ResErrorType>({
    retry: 1,
    gcTime: Infinity,
    queryKey: ['getMe'],
    staleTime: Infinity,
    queryFn: getUserMeApi,
    refetchOnMount: false,
    refetchInterval: false,
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: false,
    enabled: !!session?.session?.token,
  });
};

export const useGetUser = () => {
  /*** Constants ***/
  const { data, isLoading, error } = useGetUserMe();

  return {
    user: data?.user ?? null,
    isLoading,
    error,
  };
};

export const useGetOrganization = () => {
  /*** Constants ***/
  const { data, isLoading, error } = useGetUserMe();

  return {
    organization: data?.organization ?? null,
    isLoading,
    error,
  };
};

export const useUpdateUser = () => {
  /*** Constants ***/
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUserMeApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getUserMe'] });
    },
  });
};

export const UserServices = {
  useGetOrganization,
  useUpdateUser,
  useGetUserMe,
  useGetUser,
};
