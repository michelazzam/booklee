import { useMemo } from 'react';

import { UserServices, type LocationType } from '~/src/services';

export const useHandleFavorites = (_id: string) => {
  /***** Constants *****/
  const { data: favorites } = UserServices.useGetFavorites();
  const { mutate: addToFavorites, isPending: isAddingToFavorites } =
    UserServices.useAddToFavorites();
  const { mutate: removeFromFavorites, isPending: isRemovingFromFavorites } =
    UserServices.useRemoveFromFavorites();

  /***** Memoization *****/
  const isLoading = useMemo(
    () => isAddingToFavorites || isRemovingFromFavorites,
    [isAddingToFavorites, isRemovingFromFavorites]
  );
  const isInFavorites = useMemo(() => {
    return favorites?.some((favorite: LocationType) => favorite._id === _id);
  }, [favorites, _id]);

  const handleToggleFavorites = () => {
    if (isInFavorites) {
      removeFromFavorites({ locationId: _id });
    } else {
      addToFavorites({ locationId: _id });
    }
  };

  return {
    isLoading,
    isInFavorites,
    handleToggleFavorites,
  };
};
