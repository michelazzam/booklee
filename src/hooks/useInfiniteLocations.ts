import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { getLocationsApi } from '~/src/services/locations/api';
import type {
  GetLocationsByCategoriesResType,
  GetLocationsReqType,
} from '~/src/services/locations/types';
import type { ResErrorType } from '~/src/services/axios/types';

interface UseInfiniteLocationsParams extends Omit<GetLocationsReqType, 'page'> {
  enabled?: boolean;
}

export const useInfiniteLocations = (params?: UseInfiniteLocationsParams) => {
  const { enabled = true, ...apiParams } = params || {};

  const query = useInfiniteQuery<GetLocationsByCategoriesResType, ResErrorType>({
    queryKey: ['infiniteLocations', apiParams],
    queryFn: async ({ pageParam = 1 }) => {
      const result = await getLocationsApi({
        ...apiParams,
        page: pageParam as number,
      });

      if ('categories' in result) {
        return result as GetLocationsByCategoriesResType;
      }
      throw new Error('Expected categories response but got flat list');
    },
    getNextPageParam: (lastPage, allPages) => {
      // Check if we have any locations in the last page
      const hasLocations = lastPage.categories.some((category) => category.locations.length > 0);

      if (!hasLocations) {
        return undefined; // No more pages
      }

      // Return next page number
      return allPages.length + 1;
    },
    initialPageParam: 1,
    enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  // Flatten all pages into a single categories array
  const allCategories = useMemo(() => {
    if (!query.data?.pages) return [];

    const categoryMap = new Map<string, any>();

    query.data.pages.forEach((page: GetLocationsByCategoriesResType) => {
      page.categories.forEach((category: any) => {
        if (categoryMap.has(category._id)) {
          // Merge locations for existing category, avoiding duplicates
          const existingCategory = categoryMap.get(category._id);
          const existingLocationIds = new Set(
            existingCategory.locations.map((loc: any) => loc._id)
          );

          // Only add locations that don't already exist
          const newLocations = category.locations.filter(
            (loc: any) => !existingLocationIds.has(loc._id)
          );
          existingCategory.locations.push(...newLocations);
        } else {
          // Add new category
          categoryMap.set(category._id, { ...category });
        }
      });
    });

    return Array.from(categoryMap.values());
  }, [query.data?.pages]);

  return {
    ...query,
    data: allCategories,
    hasNextPage: query.hasNextPage,
    fetchNextPage: query.fetchNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
  };
};
