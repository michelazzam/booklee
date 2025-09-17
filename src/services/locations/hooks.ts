import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import { getLocationsCategorizedApi } from './api';

import type { ResErrorType } from '../axios/types';
import type {
  GetLocationsCategorizedResType,
  GetLocationsReqType,
  LocationCategoryType,
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

export const LocationServices = {
  useGetLocationsCategorized,
};
