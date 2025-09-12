import { AxiosError } from 'axios';

import { withErrorCatch } from '../axios/error';
import { apiClient } from '../axios/interceptor';

import { GetLocationsResType, GetLocationsReqType } from './types';

/*** API for get locations ***/
export const getLocationsApi = async (params?: GetLocationsReqType) => {
  const [response, error] = await withErrorCatch(
    apiClient.get<GetLocationsResType>('locations', { params })
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
