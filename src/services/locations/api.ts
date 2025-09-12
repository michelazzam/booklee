import { AxiosError } from 'axios';

import { withErrorCatch } from '../axios/error';
import { apiClient } from '../axios/interceptor';

import {
  GetLocationsResType,
  GetLocationsByCategoriesResType,
  GetLocationByIdResType,
  GetLocationsReqType,
  GetLocationByIdReqType,
  DEFAULT_LOCATIONS_PARAMS,
  isGroupedByCategories,
  extractAllLocations,
} from './types';

/*** API for get locations ***/
export const getLocationsApi = async (params?: GetLocationsReqType) => {
  // Merge provided params with defaults
  const mergedParams = { ...DEFAULT_LOCATIONS_PARAMS, ...params };

  // Log the full endpoint URL
  const fullUrl = `${apiClient.defaults.baseURL}locations`;
  console.log('Full endpoint URL:', fullUrl);
  console.log('Request params:', mergedParams);

  const [response, error] = await withErrorCatch(
    apiClient.get<GetLocationsResType | GetLocationsByCategoriesResType>('locations', {
      params: mergedParams,
    })
  );

  if (error instanceof AxiosError) {
    throw {
      ...error.response?.data,
      status: error.response?.status,
    };
  } else if (error) {
    throw error;
  }
  console.log('response', response.data);
  return response?.data;
};

/*** API for get single location by ID ***/
export const getLocationByIdApi = async (params: GetLocationByIdReqType) => {
  const { id, byId = true } = params;

  // Log the full endpoint URL
  const fullUrl = `${apiClient.defaults.baseURL}locations/${id}`;
  console.log('Full endpoint URL:', fullUrl);
  console.log('Request params:', { id, byId });

  const [response, error] = await withErrorCatch(
    apiClient.get<GetLocationByIdResType>(`locations/${id}`, {
      params: { byId },
    })
  );

  if (error instanceof AxiosError) {
    throw {
      ...error.response?.data,
      status: error.response?.status,
    };
  } else if (error) {
    throw error;
  }
  console.log('response', response.data);
  return response?.data;
};

// Export helper functions for working with the response
export { isGroupedByCategories, extractAllLocations };
