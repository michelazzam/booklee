import { AxiosError } from 'axios';

import { withErrorCatch } from '../axios/error';
import { apiClient } from '../axios/interceptor';

import { GetCategoriesResType, GetCategoriesReqType } from './types';

/*** API for get categories ***/
export const getCategoriesApi = async (params?: GetCategoriesReqType) => {
  const [response, error] = await withErrorCatch(
    apiClient.get<GetCategoriesResType>('categories', { params })
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
