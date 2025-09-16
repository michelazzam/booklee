import { useQuery } from '@tanstack/react-query';

import { getSearchHistoryApi, searchLocationsApi } from './api';

import type { ResErrorType } from '../axios/types';
import type { GetSearchHistoryResType, SearchReqType, SearchResType } from './types';

export const useGetSearchHistory = () => {
  return useQuery<GetSearchHistoryResType, ResErrorType, GetSearchHistoryResType['history']>({
    retry: 1,
    gcTime: 5 * 60 * 1000, // 5 minutes
    queryFn: getSearchHistoryApi,
    queryKey: ['searchHistory'],
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnMount: true,
    refetchInterval: false,
    select: ({ history }) => history,
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: false,
  });
};

export const useSearchLocations = (params: SearchReqType, enabled: boolean = true) => {
  return useQuery<SearchResType, ResErrorType, SearchResType['locations']>({
    retry: 1,
    gcTime: 5 * 60 * 1000, // 5 minutes
    queryFn: () => searchLocationsApi(params),
    queryKey: ['searchLocations', params.query, params.limit, params.page],
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnMount: true,
    refetchInterval: false,
    select: ({ locations }) => locations,
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: false,
    enabled: enabled && !!params.query.trim(),
  });
};

export const SearchServices = {
  useGetSearchHistory,
  useSearchLocations,
};
