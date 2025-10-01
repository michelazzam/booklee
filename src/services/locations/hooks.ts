import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  getLocationsCategoriesApi,
  getLocationsByCategoryApi,
  deleteSearchHistoryApi,
  getSearchHistoryApi,
  searchLocationsApi,
  getLocationByIdApi,
  getLocationsApi,
} from './api';

import type { ResErrorType } from '../axios/types';
import type {
  GetLocationsCategorizedResType,
  DeleteSearchHistoryResType,
  GetSearchHistoryResType,
  GetLocationByIdResType,
  LocationCategoryType,
  DetailedLocationType,
  GetLocationsReqType,
  GetLocationsResType,
  SearchHistoryType,
  SearchReqType,
  SearchResType,
  LocationType,
  CategoryType,
} from './types';

const useGetLocationsCategories = (filters?: GetLocationsReqType) => {
  return useQuery<GetLocationsCategorizedResType, ResErrorType, CategoryType[]>({
    queryKey: ['getLocationsCategories', filters],
    queryFn: () => getLocationsCategoriesApi(filters),
    select: ({ categories }) =>
      categories.map((category) => {
        const { locations, ...rest } = category;
        return rest;
      }),
  });
};

const useGetLocationsByCategory = (categorySlug: string, filters?: GetLocationsReqType) => {
  return useInfiniteQuery<GetLocationsResType, ResErrorType, LocationType[]>({
    initialPageParam: 1,
    refetchOnMount: false,
    refetchInterval: false,
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: false,
    queryKey: ['getLocationsByCategory', categorySlug, filters],
    select: ({ pages }) => pages.flatMap((page) => page.locations),
    queryFn: ({ pageParam = 1 }) =>
      getLocationsByCategoryApi(categorySlug, pageParam as number, filters),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage && lastPage.locations.length > 0) {
        return allPages.length + 1;
      }
      return undefined;
    },
    getPreviousPageParam: (_, allPages) => {
      if (allPages.length > 1) {
        return allPages.length - 1;
      }
      return undefined;
    },
  });
};

const useGetLocations = (filters?: GetLocationsReqType) => {
  return useInfiniteQuery<GetLocationsResType, ResErrorType, LocationType[]>({
    initialPageParam: 1,
    refetchOnMount: false,
    refetchInterval: false,
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: false,
    queryKey: ['getLocations', filters],
    select: ({ pages }) => pages.flatMap((page) => page.locations),
    queryFn: ({ pageParam = 1 }) => getLocationsApi(pageParam as number, filters),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage && lastPage.locations.length > 0) {
        return allPages.length + 1;
      }
      return undefined;
    },
    getPreviousPageParam: (_, allPages) => {
      if (allPages.length > 1) {
        return allPages.length - 1;
      }
      return undefined;
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

export const LocationServices = {
  useGetLocationsCategories,
  useGetLocationsByCategory,
  useDeleteSearchHistory,
  useGetSearchHistory,
  useSearchLocations,
  useGetLocationById,
  useGetLocations,
};
