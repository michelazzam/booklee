import { AxiosError } from 'axios';

import { apiClient } from '../axios/interceptor';
import { withErrorCatch } from '../axios/error';

import type {
  GetLocationsCategorizedResType,
  GetLocationsReqType,
  GetLocationsResType,
} from './types';

/*** API for get locations ***/
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
