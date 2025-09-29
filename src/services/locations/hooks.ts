import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  getLocationsCategorizedApi,
  submitLocationRatingApi,
  deleteSearchHistoryApi,
  getLocationRatingsApi,
  getSearchHistoryApi,
  searchLocationsApi,
  getLocationByIdApi,
  getLocationsApi,
} from './api';

import type { ResErrorType } from '../axios/types';
import type {
  GetLocationsCategorizedResType,
  LocationRatingSubmitResType,
  LocationRatingSubmitReqType,
  DeleteSearchHistoryResType,
  GetSearchHistoryResType,
  GetLocationByIdResType,
  LocationRatingResType,
  LocationRatingReqType,
  LocationCategoryType,
  DetailedLocationType,
  GetLocationsReqType,
  GetLocationsResType,
  SearchHistoryType,
  SearchReqType,
  SearchResType,
  LocationType,
} from './types';

const useGetLocationsCategorized = (filters?: GetLocationsReqType) => {
  const categoriesFilters = { ...filters, categories: true };

  return useInfiniteQuery<GetLocationsCategorizedResType, ResErrorType, LocationCategoryType[]>({
    initialPageParam: 1,
    queryKey: ['getLocationsCategorized', categoriesFilters],
    select: ({ pages }) => pages.flatMap((page) => page.categories),
    queryFn: ({ pageParam = 1 }) =>
      getLocationsCategorizedApi(pageParam as number, categoriesFilters),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.categories.length > 0 ? allPages.length + 1 : undefined;
    },
  });
};

const useGetLocations = (filters?: GetLocationsReqType) => {
  return useInfiniteQuery<GetLocationsResType, ResErrorType, LocationType[]>({
    initialPageParam: 1,
    queryKey: ['getLocations', filters],
    select: ({ pages }) => pages.flatMap((page) => page.locations),
    queryFn: ({ pageParam = 1 }) => getLocationsApi(pageParam as number, filters),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.locations.length > 0 ? allPages.length + 1 : undefined;
    },
  });
};

const useGetLocationById = (id: string) => {
  return useQuery<GetLocationByIdResType, ResErrorType, DetailedLocationType>({
    enabled: !!id,
    queryKey: ['getLocationById', id],
    select: ({ location }) => location,
    queryFn: () => getLocationByIdApi(id),
  });
};

const useGetSearchHistory = () => {
  return useQuery<GetSearchHistoryResType, ResErrorType, SearchHistoryType[]>({
    queryKey: ['searchHistory'],
    queryFn: getSearchHistoryApi,
    select: ({ history }) => history,
  });
};

const useSearchLocations = () => {
  /*** Constants ***/
  const queryClient = useQueryClient();

  return useMutation<SearchResType, ResErrorType, SearchReqType>({
    mutationFn: (params) => searchLocationsApi(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['searchHistory'] });
    },
  });
};

const useDeleteSearchHistory = () => {
  /*** Constants ***/
  const queryClient = useQueryClient();

  return useMutation<DeleteSearchHistoryResType, ResErrorType, void>({
    mutationFn: deleteSearchHistoryApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['searchHistory'] });
    },
  });
};

const useGetLocationRatings = (filters?: LocationRatingReqType) => {
  return useQuery<LocationRatingResType, ResErrorType, LocationRatingResType>({
    queryKey: ['getLocationRatings', filters],
    queryFn: () => getLocationRatingsApi(filters),
  });
};

const useSubmitLocationRating = () => {
  return useMutation<LocationRatingSubmitResType, ResErrorType, LocationRatingSubmitReqType>({
    mutationFn: (params) => submitLocationRatingApi(params),
  });
};

export const LocationServices = {
  useGetLocationsCategorized,
  useSubmitLocationRating,
  useDeleteSearchHistory,
  useGetLocationRatings,
  useGetSearchHistory,
  useSearchLocations,
  useGetLocationById,
  useGetLocations,
};
