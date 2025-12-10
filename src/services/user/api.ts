import { AxiosError } from 'axios';

import { apiClient } from '../axios/interceptor';
import { withErrorCatch } from '../axios/error';

import type { ImageType } from '~/src/components/utils';
import {
  SendPushNotificationReqType,
  SendPushNotificationResType,
  RemoveFromFavoritesReqType,
  RemoveFromFavoritesResType,
  GetUserLocationsResType,
  UpdateUserImageResType,
  AddToFavoritesReqType,
  AddToFavoritesResType,
  GetFavoritesResType,
  UpdateUserReqType,
  UpdateUserResType,
  GetUserMeResType,
  DeleteUserResType,
} from './types';

/*** API for get user ***/
export const getUserMeApi = async () => {
  const [response, error] = await withErrorCatch(apiClient.get<GetUserMeResType>(`/user/me`));

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

/*** API for update user ***/
export const updateUserMeApi = async (data: UpdateUserReqType) => {
  const [response, error] = await withErrorCatch(
    apiClient.post<UpdateUserResType>(`/user/me`, data)
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

/*** API for update user image ***/
export const updateUserImageApi = async (data: ImageType) => {
  const formData = new FormData();
  formData.append('image', {
    uri: data.uri,
    type: data.type,
    name: data.name,
  } as any);

  const [response, error] = await withErrorCatch(
    apiClient.post<UpdateUserImageResType>('/user/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
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

/*** API for add to favorites ***/
export const addToFavoritesApi = async (data: AddToFavoritesReqType) => {
  const [response, error] = await withErrorCatch(
    apiClient.post<AddToFavoritesResType>('/user/favorites', data)
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

/*** API for remove from favorites ***/
export const removeFromFavoritesApi = async (data: RemoveFromFavoritesReqType) => {
  const [response, error] = await withErrorCatch(
    apiClient.delete<RemoveFromFavoritesResType>('/user/favorites', { data })
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

/*** API for get favorites ***/
export const getFavoritesApi = async () => {
  const [response, error] = await withErrorCatch(
    apiClient.get<GetFavoritesResType>('/user/favorites')
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

/*** API for get user locations ***/
export const getUserLocationsApi = async () => {
  const [response, error] = await withErrorCatch(
    apiClient.get<GetUserLocationsResType>('/user/locations')
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

/*** API for delete user ***/
export const deleteUserApi = async () => {
  const [response, error] = await withErrorCatch(apiClient.delete<DeleteUserResType>('/user/me'));

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

/*** API for send push notification ***/
export const sendPushNotificationApi = async (data: SendPushNotificationReqType) => {
  const [response, error] = await withErrorCatch(
    apiClient.post<SendPushNotificationResType>('/push/send-to-user', data)
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
