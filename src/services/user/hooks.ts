import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { authClient } from '../auth/auth-client';

import {
  removeFromFavoritesApi,
  addToFavoritesApi,
  updateUserMeApi,
  getFavoritesApi,
  getUserMeApi,
  getUserLocationsApi,
} from './api';

import type { LocationType } from '../locations/types';
import type { ResErrorType } from '../axios/types';
import type {
  RemoveFromFavoritesReqType,
  RemoveFromFavoritesResType,
  AddToFavoritesResType,
  AddToFavoritesReqType,
  GetFavoritesResType,
  GetUserMeResType,
  GetUserLocationsResType,
  UserLocationItemType,
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
  return useQuery<GetFavoritesResType, ResErrorType, LocationType[]>({
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

const useGetUserLocations = () => {
  return useQuery<GetUserLocationsResType, ResErrorType, UserLocationItemType[]>({
    queryKey: ['getUserLocations'],
    queryFn: getUserLocationsApi,
    select: ({ locations }) => locations,
  });
};

export const UserServices = {
  useRemoveFromFavorites,
  useAddToFavorites,
  useGetFavorites,
  useUpdateUser,
  useGetMe,
  useGetUserLocations,
};
