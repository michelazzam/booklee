import { AxiosError } from 'axios';

import { withErrorCatch } from '../axios/error';
import { apiClient } from '../axios/interceptor';

import { GetUserMeResType, UpdateUserReqType, UpdateUserResType } from './types';

/*** API for get user/me ***/
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

/*** API for update user/me ***/
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
