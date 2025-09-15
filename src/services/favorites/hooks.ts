import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { addToFavoritesApi, removeFromFavoritesApi, getFavoritesApi } from './api';

import type { ResErrorType } from '../axios/types';
import type {
  AddToFavoritesReqType,
  AddToFavoritesResType,
  GetFavoritesResType,
  RemoveFromFavoritesReqType,
  RemoveFromFavoritesResType,
} from './types';

import { authClient } from '../auth/auth-client';

/*** Hook for get favorites ***/
export const useGetFavorites = () => {
  /*** Constants ***/
  const { data: session } = authClient.useSession();

  return useQuery<GetFavoritesResType, ResErrorType, GetFavoritesResType['favorites']>({
    retry: 1,
    gcTime: 5 * 60 * 1000, // 5 minutes
    queryFn: getFavoritesApi,
    queryKey: ['getFavorites'],
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnMount: true,
    refetchInterval: false,
    select: ({ favorites }) => favorites,
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: false,
    enabled: !!session?.user,
  });
};

/*** Hook for add to favorites ***/
export const useAddToFavorites = () => {
  /*** Constants ***/
  const queryClient = useQueryClient();

  return useMutation<AddToFavoritesResType, ResErrorType, AddToFavoritesReqType>({
    mutationFn: addToFavoritesApi,
    onSuccess: () => {
      // Simply refetch the favorites data after successful add
      queryClient.invalidateQueries({ queryKey: ['getFavorites'] });
    },
  });
};

/*** Hook for remove from favorites ***/
export const useRemoveFromFavorites = () => {
  /*** Constants ***/
  const queryClient = useQueryClient();

  return useMutation<RemoveFromFavoritesResType, ResErrorType, RemoveFromFavoritesReqType>({
    mutationFn: removeFromFavoritesApi,
    onSuccess: () => {
      // Simply refetch the favorites data after successful remove
      queryClient.invalidateQueries({ queryKey: ['getFavorites'] });
    },
  });
};

/*** Hook for toggle favorite (add or remove) ***/
export const useToggleFavorite = () => {
  /*** Constants ***/
  const addToFavorites = useAddToFavorites();
  const removeFromFavorites = useRemoveFromFavorites();
  const { data: favorites } = useGetFavorites();

  const toggleFavorite = async (locationId: string) => {
    // Use the current favorites data from the hook instead of cache
    const isFavorite = Array.isArray(favorites)
      ? favorites.some((fav) => fav._id === locationId)
      : false;

    if (isFavorite) {
      return removeFromFavorites.mutateAsync({ locationId });
    } else {
      return addToFavorites.mutateAsync({ locationId });
    }
  };

  return {
    toggleFavorite,
    isLoading: addToFavorites.isPending || removeFromFavorites.isPending,
    error: addToFavorites.error || removeFromFavorites.error,
  };
};

export const FavoritesServices = {
  useGetFavorites,
  useAddToFavorites,
  useRemoveFromFavorites,
  useToggleFavorite,
};
