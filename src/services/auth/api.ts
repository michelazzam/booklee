import { AxiosError } from 'axios';

import { withErrorCatch } from '../axios/error';
import { apiClient } from '../axios/interceptor';
import { GetMeResType } from './types';

/*** API for get me ***/
export const getMeApi = async () => {
  const [response, error] = await withErrorCatch(apiClient.get<GetMeResType>(`user/me`));

  if (error instanceof AxiosError) {
    throw {
      ...error.response?.data,
      status: error.response?.status,
    };
  } else if (error) {
    throw error;
  }

  console.log('response', response);
  return response?.data;
};
