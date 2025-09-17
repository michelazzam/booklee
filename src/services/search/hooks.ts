import { useQuery } from '@tanstack/react-query';

import { getSearchHistoryApi, searchLocationsApi } from './api';

import type { GetSearchHistoryResType, SearchReqType, SearchResType } from './types';
import type { ResErrorType } from '../axios/types';

export const useGetSearchHistory = () => {
  return useQuery<GetSearchHistoryResType, ResErrorType, GetSearchHistoryResType['history']>({
    queryFn: getSearchHistoryApi,
    queryKey: ['searchHistory'],
    select: ({ history }) => history,
  });
};

export const useSearchLocations = (params: SearchReqType, enabled: boolean = true) => {
  return useQuery<SearchResType, ResErrorType, SearchResType['locations']>({
    select: ({ locations }) => locations,
    enabled: enabled && !!params.query.trim(),
    queryFn: () => searchLocationsApi(params),
    queryKey: ['searchLocations', params.query, params.limit, params.page],
  });
};

export const SearchServices = {
  useGetSearchHistory,
  useSearchLocations,
};
