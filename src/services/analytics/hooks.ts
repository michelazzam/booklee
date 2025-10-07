import { useQuery } from '@tanstack/react-query';
import { getAnalyticsApi } from './api';
import type { GetAnalyticsReqType, GetAnalyticsResType } from './types';
import type { ResErrorType } from '../axios/types';

/*** Get Analytics Hook ***/
export const useGetAnalytics = (params: GetAnalyticsReqType) => {
  return useQuery<GetAnalyticsResType, ResErrorType>({
    queryKey: ['analytics', params],
    queryFn: () => getAnalyticsApi(params),
  });
};

export const AnalyticsServices = {
  useGetAnalytics,
};

