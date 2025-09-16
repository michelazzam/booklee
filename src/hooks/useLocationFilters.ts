import { useState, useCallback } from 'react';
import type { FilterState } from '~/src/components/modals/FilterModal';
import type { GetLocationsReqType } from '~/src/services/locations/types';

export const useLocationFilters = (defaultFilters?: Partial<FilterState>) => {
  const [appliedFilters, setAppliedFilters] = useState<FilterState>({
    location: '',
    priceRange: [0, 300],
    minimumRating: 0,
    maximumDistance: 30,
    ...defaultFilters,
  });

  // Convert FilterState to API parameters
  const getApiParams = useCallback(
    (additionalParams?: Partial<GetLocationsReqType>) => {
      const params: GetLocationsReqType = {
        categories: true,
        limit: 20,
        ...additionalParams,
      };

      // Apply location filter
      if (appliedFilters.location.trim()) {
        params.city = appliedFilters.location.trim();
      }

      // Apply price range filter
      if (appliedFilters.priceRange[0] > 0 || appliedFilters.priceRange[1] < 300) {
        // Convert price range to price tiers (assuming 1-3 scale)
        const minTier = Math.ceil(appliedFilters.priceRange[0] / 100);
        const maxTier = Math.ceil(appliedFilters.priceRange[1] / 100);
        params.price_min = Math.max(1, minTier);
        params.price_max = Math.min(3, maxTier);
      }

      // Apply minimum rating filter
      if (appliedFilters.minimumRating > 0) {
        params.rating_min = appliedFilters.minimumRating;
      }

      // Apply distance filter
      if (appliedFilters.maximumDistance < 30) {
        params.distance = appliedFilters.maximumDistance;
        params.unit = 'km';
        // Note: lat/lng would need to be provided from user's location
        // For now, we'll skip distance filtering if no coordinates are available
      }

      return params;
    },
    [appliedFilters]
  );

  const resetFilters = useCallback(() => {
    setAppliedFilters({
      location: '',
      priceRange: [0, 300],
      minimumRating: 0,
      maximumDistance: 30,
    });
  }, []);

  return {
    appliedFilters,
    setAppliedFilters,
    getApiParams,
    resetFilters,
  };
};
