import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { authClient } from '../auth/auth-client';
import { useUserProvider } from '~/src/store';

import {
  sendPushNotificationApi,
  removeFromFavoritesApi,
  getUserLocationsApi,
  updateUserImageApi,
  addToFavoritesApi,
  updateUserMeApi,
  getFavoritesApi,
  deleteUserApi,
  getUserMeApi,
} from './api';

import type { LocationType } from '../locations/types';
import type { ResErrorType } from '../axios/types';
import type {
  RemoveFromFavoritesReqType,
  RemoveFromFavoritesResType,
  GetUserLocationsResType,
  AddToFavoritesResType,
  AddToFavoritesReqType,
  UserLocationItemType,
  GetFavoritesResType,
  DeleteUserResType,
  GetUserMeResType,
  SendPushNotificationReqType,
  SendPushNotificationResType,
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

const useUpdateUserImage = () => {
  /*** Constants ***/
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUserImageApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getMe'] });
    },
  });
};

const useGetFavorites = () => {
  const { userIsGuest } = useUserProvider();

  return useQuery<GetFavoritesResType, ResErrorType, LocationType[]>({
    enabled: !userIsGuest,
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

const useGetUserLocationsWithData = () => {
  return useQuery<GetUserLocationsResType, ResErrorType>({
    queryKey: ['getUserLocations'],
    queryFn: getUserLocationsApi,
  });
};

const useDeleteUser = () => {
  /*** Constants ***/
  const queryClient = useQueryClient();

  return useMutation<DeleteUserResType, ResErrorType, void>({
    mutationFn: deleteUserApi,
    onSuccess: () => {
      queryClient.clear();
      authClient.signOut();
    },
  });
};

const useSendPushNotification = () => {
  return useMutation<SendPushNotificationResType, ResErrorType, SendPushNotificationReqType>({
    mutationFn: sendPushNotificationApi,
  });
};

export const UserServices = {
  useGetUserLocationsWithData,
  useSendPushNotification,
  useRemoveFromFavorites,
  useGetUserLocations,
  useUpdateUserImage,
  useAddToFavorites,
  useGetFavorites,
  useUpdateUser,
  useDeleteUser,
  useGetMe,
};
