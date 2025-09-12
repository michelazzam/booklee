import { useQuery } from '@tanstack/react-query';

import { getLocationsApi } from './api';

import type { GetLocationsResType, GetLocationsReqType, Location } from './types';
import type { ResErrorType } from '../axios/types';

export const useGetLocations = (params?: GetLocationsReqType) => {
  return useQuery<GetLocationsResType, ResErrorType, Location[]>({
    queryKey: ['getLocations', params],
    select: ({ locations }) => locations,
    queryFn: () => getLocationsApi(params),
  });
};

export const LocationServices = {
  useGetLocations,
};
