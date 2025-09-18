import { AxiosError } from 'axios';

import { apiClient } from '../axios/interceptor';
import { withErrorCatch } from '../axios/error';

import type {
  GetLocationsCategorizedResType,
  GetSearchHistoryResType,
  GetLocationsReqType,
  GetLocationsResType,
  SearchReqType,
  SearchResType,
  DeleteSearchHistoryResType,
  GetLocationByIdResType,
} from './types';

/*** API for get locations categorized ***/
export const getLocationsCategorizedApi = async (page: number, filters?: GetLocationsReqType) => {
  let url = `locations?page=${page}`;

  if (filters) {
    url += `&${Object.entries(filters)
      .map(([key, value]) => `${key}=${value}`)
      .join('&')}`;
  }

  const [response, error] = await withErrorCatch(
    apiClient.get<GetLocationsCategorizedResType>(url)
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

/*** API for get locations ***/
export const getLocationsApi = async (page: number, filters?: GetLocationsReqType) => {
  let url = `locations?page=${page}`;

  if (filters) {
    url += `&${Object.entries(filters)
      .map(([key, value]) => `${key}=${value}`)
      .join('&')}`;
  }

  const [response, error] = await withErrorCatch(apiClient.get<GetLocationsResType>(url));

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

/*** API for get location by id ***/
export const getLocationByIdApi = async (id: string) => {
  const [response, error] = await withErrorCatch(
    apiClient.get<GetLocationByIdResType>(`locations/${id}`, { params: { byId: true } })
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

/*** API to get location search history ***/
export const getSearchHistoryApi = async () => {
  const [response, error] = await withErrorCatch(
    apiClient.get<GetSearchHistoryResType>('user/searchHistory')
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

/*** API to search for locations ***/
export const searchLocationsApi = async (params: SearchReqType) => {
  const [response, error] = await withErrorCatch(
    apiClient.get<SearchResType>('locations/search', { params })
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

/*** API to delete search history ***/
export const deleteSearchHistoryApi = async () => {
  const [response, error] = await withErrorCatch(
    apiClient.delete<DeleteSearchHistoryResType>(`user/searchHistory`)
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
