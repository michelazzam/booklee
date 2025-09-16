import { AxiosError } from 'axios';

import { withErrorCatch } from '../axios/error';
import { apiClient } from '../axios/interceptor';

import {
  AddToFavoritesReqType,
  AddToFavoritesResType,
  GetFavoritesResType,
  RemoveFromFavoritesReqType,
  RemoveFromFavoritesResType,
} from './types';

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
