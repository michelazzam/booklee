import { useQuery } from '@tanstack/react-query';

import { getLocationsApi } from './api';

import type { GetLocationsResType, GetLocationsReqType } from './types';
import type { ResErrorType } from '../axios/types';

export const useGetLocations = (params?: GetLocationsReqType) => {
  return useQuery<GetLocationsResType, ResErrorType, GetLocationsResType['data']>({
    retry: 1,
    gcTime: Infinity,
    queryFn: () => getLocationsApi(params),
    queryKey: ['getLocations', params],
    staleTime: Infinity,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    refetchInterval: false,
    refetchIntervalInBackground: false,
    select: ({ data }) => data,
  });
};

export const LocationServices = {
  useGetLocations,
};
