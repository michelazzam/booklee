import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { authClient } from '../auth/auth-client';

import {
  removeFromFavoritesApi,
  addToFavoritesApi,
  updateUserMeApi,
  getFavoritesApi,
  getUserMeApi,
} from './api';

import type { ResErrorType } from '../axios/types';
import type {
  RemoveFromFavoritesReqType,
  RemoveFromFavoritesResType,
  AddToFavoritesResType,
  AddToFavoritesReqType,
  GetFavoritesResType,
  GetUserMeResType,
  FavoriteType,
} from './types';

const useGetMe = () => {
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

const useGetOrganization = () => {
  /*** Constants ***/
  const { data, isLoading, error } = useGetMe();

  return {
    organization: data?.organization ?? null,
    isLoading,
    error,
  };
};

const useUpdateUser = () => {
  /*** Constants ***/
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUserMeApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getMe'] });
    },
  });
};

const useGetFavorites = () => {
  return useQuery<GetFavoritesResType, ResErrorType, FavoriteType[]>({
    queryFn: getFavoritesApi,
    queryKey: ['getFavorites'],
    select: ({ favorites }) => favorites,
  });
};

const useAddToFavorites = () => {
  /*** Constants ***/
  const queryClient = useQueryClient();

  return useMutation<AddToFavoritesResType, ResErrorType, AddToFavoritesReqType>({
    mutationFn: addToFavoritesApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getFavorites'] });
    },
  });
};

const useRemoveFromFavorites = () => {
  /*** Constants ***/
  const queryClient = useQueryClient();

  return useMutation<RemoveFromFavoritesResType, ResErrorType, RemoveFromFavoritesReqType>({
    mutationFn: removeFromFavoritesApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getFavorites'] });
    },
  });
};

export const UserServices = {
  useRemoveFromFavorites,
  useGetOrganization,
  useAddToFavorites,
  useGetFavorites,
  useUpdateUser,
  useGetMe,
};
