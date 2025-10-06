import { apiClient } from '../axios/interceptor';
import type { GetAnalyticsReqType, GetAnalyticsResType } from './types';

/*** Get Analytics ***/
export const getAnalyticsApi = async (
  params: GetAnalyticsReqType
): Promise<GetAnalyticsResType> => {
  const response = await apiClient.get<GetAnalyticsResType>('/analytics', {
    params,
  });
  return response.data;
};

