import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  getLocationsCategoriesApi,
  submitLocationRatingApi,
  deleteLocationRatingApi,
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
  LocationRatingDeleteReqType,
  LocationRatingSubmitReqType,
  LocationRatingDeleteResType,
  DeleteSearchHistoryResType,
  GetSearchHistoryResType,
  GetLocationByIdResType,
  LocationRatingResType,
  LocationRatingReqType,
  DetailedLocationType,
  LocationCategoryType,
  GetLocationsReqType,
  GetLocationsResType,
  SearchHistoryType,
  SearchReqType,
  SearchResType,
  LocationType,
} from './types';

const useGetLocationsCategories = (filters?: GetLocationsReqType) => {
  return useQuery<GetLocationsCategorizedResType, ResErrorType, LocationCategoryType[]>({
    select: ({ categories }) => categories,
    queryKey: ['getLocationsCategories', filters],
    queryFn: () => getLocationsCategoriesApi(filters),
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
    gcTime: 3 * 60 * 1000,
    refetchOnMount: false,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
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
  /*** Constants ***/
  const queryClient = useQueryClient();

  return useMutation<LocationRatingSubmitResType, ResErrorType, LocationRatingSubmitReqType>({
    mutationFn: (params) => submitLocationRatingApi(params),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['getUserAppointmentsNeedsReview'] });
    },
  });
};

const useDeleteLocationRating = () => {
  /*** Constants ***/
  const queryClient = useQueryClient();

  return useMutation<
    LocationRatingDeleteResType,
    ResErrorType,
    LocationRatingDeleteReqType | undefined
  >({
    mutationFn: (params) => deleteLocationRatingApi(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getUserAppointments', { needsReview: true }] });
    },
  });
};

export const LocationServices = {
  useGetLocationsCategories,
  useSubmitLocationRating,
  useDeleteLocationRating,
  useDeleteSearchHistory,
  useGetLocationRatings,
  useGetSearchHistory,
  useSearchLocations,
  useGetLocationById,
  useGetLocations,
};
