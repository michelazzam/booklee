import { AxiosError } from 'axios';

import { withErrorCatch } from '../axios/error';
import { apiClient } from '../axios/interceptor';

import { GetSearchHistoryResType, SearchReqType, SearchResType } from './types';

/*** API for get search history ***/
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

/*** API for search locations ***/
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
