import { AxiosError } from 'axios';

import { apiClient } from '../axios/interceptor';
import { withErrorCatch } from '../axios/error';

import type {
  GetLocationsCategorizedResType,
  DeleteSearchHistoryResType,
  GetSearchHistoryResType,
  GetLocationByIdResType,
  LocationRatingReqType,
  LocationRatingResType,
  GetLocationsReqType,
  GetLocationsResType,
  SearchReqType,
  SearchResType,
  LocationRatingSubmitResType,
  LocationRatingSubmitReqType,
} from './types';

export const DEFAULT_LOCATION_FIELDS = 'rating,price,geo,_id,slug,name,logo,city,tags,photos';

/*** API for get locations categories ***/
export const getLocationsCategoriesApi = async (filters?: GetLocationsReqType) => {
  let url = `locations?page=1&fields=${DEFAULT_LOCATION_FIELDS}`;
  const categoriesFilters = { ...filters, categories: true };

  if (categoriesFilters) {
    url += `&${Object.entries(categoriesFilters)
      .map(([key, value]) => `${key}=${value}`)
      .join('&')}`;
  }

  const [response, error] = await withErrorCatch(
    apiClient.get<GetLocationsCategorizedResType>(url)
  );

  if (error instanceof AxiosError) {
    throw {
      ...error.response?.data,
      status: error.response?.status,
    };
  } else if (error) {
    throw error;
  }
  return response?.data;
};

/*** API for get locations by category with pagination ***/
export const getLocationsByCategoryApi = async (
  categorySlug: string,
  page: number,
  filters?: GetLocationsReqType
) => {
  let url = `locations?page=${page}&category=${categorySlug}&fields=${DEFAULT_LOCATION_FIELDS}`;

  if (filters) {
    url += `&${Object.entries(filters)
      .map(([key, value]) => `${key}=${value}`)
      .join('&')}`;
  }

  const [response, error] = await withErrorCatch(apiClient.get<GetLocationsResType>(url));

  if (error instanceof AxiosError) {
    throw {
      ...error.response?.data,
      status: error.response?.status,
    };
  } else if (error) {
    throw error;
  }
  return response?.data;
};

/*** API for get locations ***/
export const getLocationsApi = async (page: number, filters?: GetLocationsReqType) => {
  let url = `locations?page=${page}&fields=${DEFAULT_LOCATION_FIELDS}`;

  if (filters) {
    url += `&${Object.entries(filters)
      .map(([key, value]) => `${key}=${value}`)
      .join('&')}`;
  }

  const [response, error] = await withErrorCatch(apiClient.get<GetLocationsResType>(url));

  if (error instanceof AxiosError) {
    throw {
      ...error.response?.data,
      status: error.response?.status,
    };
  } else if (error) {
    throw error;
  }
  return response?.data;
};

/*** API for get location by id ***/
export const getLocationByIdApi = async (id: string) => {
  const [response, error] = await withErrorCatch(
    apiClient.get<GetLocationByIdResType>(`locations/${id}`, { params: { byId: true } })
  );

  if (error instanceof AxiosError) {
    throw {
      ...error.response?.data,
      status: error.response?.status,
    };
  } else if (error) {
    throw error;
  }

  return response?.data;
};

/*** API to get location search history ***/
export const getSearchHistoryApi = async () => {
  const [response, error] = await withErrorCatch(
    apiClient.get<GetSearchHistoryResType>('user/searchHistory')
  );

  if (error instanceof AxiosError) {
    throw {
      ...error.response?.data,
      status: error.response?.status,
    };
  } else if (error) {
    throw error;
  }

  return response?.data;
};

/*** API to search for locations ***/
export const searchLocationsApi = async (params: SearchReqType) => {
  const [response, error] = await withErrorCatch(
    apiClient.get<SearchResType>('locations/search', { params })
  );

  if (error instanceof AxiosError) {
    throw {
      ...error.response?.data,
      status: error.response?.status,
    };
  } else if (error) {
    throw error;
  }

  return response?.data;
};

/*** API to delete search history ***/
export const deleteSearchHistoryApi = async () => {
  const [response, error] = await withErrorCatch(
    apiClient.delete<DeleteSearchHistoryResType>(`user/searchHistory`)
  );

  if (error instanceof AxiosError) {
    throw {
      ...error.response?.data,
      status: error.response?.status,
    };
  } else if (error) {
    throw error;
  }

  return response?.data;
};

/*** API to get location ratings ***/
export const getLocationRatingsApi = async (filters?: LocationRatingReqType) => {
  let url = '/reviews';

  if (filters) {
    url += `?${Object.entries(filters)
      .map(([key, value]) => `${key}=${value}`)
      .join('&')}`;
  }

  const [response, error] = await withErrorCatch(apiClient.get<LocationRatingResType>(url));

  if (error instanceof AxiosError) {
    throw {
      ...error.response?.data,
      status: error.response?.status,
    };
  } else if (error) {
    throw error;
  }

  return response?.data;
};

/*** API to submit location rating ***/
export const submitLocationRatingApi = async (params: LocationRatingSubmitReqType) => {
  const [response, error] = await withErrorCatch(
    apiClient.post<LocationRatingSubmitResType>('reviews', params)
  );

  if (error instanceof AxiosError) {
    throw {
      ...error.response?.data,
      status: error.response?.status,
    };
  } else if (error) {
    throw error;
  }

  return response?.data;
};
