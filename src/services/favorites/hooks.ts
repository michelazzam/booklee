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

type MutationContext = {
  previousFavorites?: GetFavoritesResType['favorites'];
};

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

  return useMutation<AddToFavoritesResType, ResErrorType, AddToFavoritesReqType, MutationContext>({
    mutationFn: addToFavoritesApi,
    onMutate: async ({ locationId }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['getFavorites'] });

      // Snapshot the previous value
      const previousFavorites = queryClient.getQueryData<GetFavoritesResType['favorites']>([
        'getFavorites',
      ]);

      // Optimistically update to the new value
      queryClient.setQueryData<GetFavoritesResType['favorites']>(['getFavorites'], (old) => {
        if (!old) return old;
        // Add the new favorite (we'll use a placeholder until the real data comes back)
        const newFavorite = {
          _id: locationId,
          slug: '',
          name: 'Loading...',
          logo: '',
          city: '',
          tags: [],
        };
        return [...old, newFavorite];
      });

      // Return a context object with the snapshotted value
      return { previousFavorites };
    },
    onError: (_, __, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousFavorites) {
        queryClient.setQueryData(['getFavorites'], context.previousFavorites);
      }
    },
    onSettled: () => {
      // Always refetch after error or success to ensure we have the latest data
      queryClient.invalidateQueries({ queryKey: ['getFavorites'] });
    },
  });
};

/*** Hook for remove from favorites ***/
export const useRemoveFromFavorites = () => {
  /*** Constants ***/
  const queryClient = useQueryClient();

  return useMutation<
    RemoveFromFavoritesResType,
    ResErrorType,
    RemoveFromFavoritesReqType,
    MutationContext
  >({
    mutationFn: removeFromFavoritesApi,
    onMutate: async ({ locationId }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['getFavorites'] });

      // Snapshot the previous value
      const previousFavorites = queryClient.getQueryData<GetFavoritesResType['favorites']>([
        'getFavorites',
      ]);

      // Optimistically update to the new value
      queryClient.setQueryData<GetFavoritesResType['favorites']>(['getFavorites'], (old) => {
        if (!old) return old;
        // Remove the favorite
        return old.filter((fav) => fav._id !== locationId);
      });

      // Return a context object with the snapshotted value
      return { previousFavorites };
    },
    onError: (_, __, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousFavorites) {
        queryClient.setQueryData(['getFavorites'], context.previousFavorites);
      }
    },
    onSettled: () => {
      // Always refetch after error or success to ensure we have the latest data
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
