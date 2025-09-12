import { useQuery } from '@tanstack/react-query';

import { getLocationsApi, getLocationByIdApi, extractAllLocations } from './api';

import type {
  GetLocationsResType,
  GetLocationsByCategoriesResType,
  GetLocationByIdResType,
  GetLocationsReqType,
  GetLocationByIdReqType,
  Location,
  DetailedLocation,
} from './types';
import type { ResErrorType } from '../axios/types';

// Hook for getting locations grouped by categories (default behavior)
export const useGetLocationsByCategories = (params?: GetLocationsReqType) => {
  return useQuery<GetLocationsByCategoriesResType, ResErrorType, GetLocationsByCategoriesResType>({
    queryKey: ['getLocationsByCategories', params],
    queryFn: async () => {
      const result = await getLocationsApi(params);
      if ('categories' in result) {
        return result as GetLocationsByCategoriesResType;
      }
      throw new Error('Expected categories response but got flat list');
    },
  });
};

// Hook for getting locations as a flat list (when categories: false)
export const useGetLocations = (params?: GetLocationsReqType) => {
  return useQuery<GetLocationsResType, ResErrorType, Location[]>({
    queryKey: ['getLocations', { ...params, categories: false }],
    select: ({ locations }) => locations,
    queryFn: async () => {
      const result = await getLocationsApi({ ...params, categories: false });
      if ('locations' in result) {
        return result as GetLocationsResType;
      }
      throw new Error('Expected flat list response but got categories');
    },
  });
};

// Hook that returns all locations as a flat list regardless of grouping
export const useGetAllLocations = (params?: GetLocationsReqType) => {
  return useQuery<GetLocationsResType | GetLocationsByCategoriesResType, ResErrorType, Location[]>({
    queryKey: ['getAllLocations', params],
    select: (data) => extractAllLocations(data),
    queryFn: () => getLocationsApi(params),
  });
};

// Hook for getting a single location by ID
export const useGetLocationById = (params: GetLocationByIdReqType) => {
  return useQuery<GetLocationByIdResType, ResErrorType, DetailedLocation>({
    queryKey: ['getLocationById', params.id],
    select: ({ location }) => location,
    queryFn: () => getLocationByIdApi(params),
    enabled: !!params.id, // Only run query if ID is provided
  });
};

export const LocationServices = {
  useGetLocations,
  useGetLocationsByCategories,
  useGetAllLocations,
  useGetLocationById,
};
