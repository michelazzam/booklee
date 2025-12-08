import { useEffect, useMemo, useState } from 'react';
import { Toast } from 'toastify-react-native';

import { UserServices } from '~/src/services';
import { useUserProvider } from '~/src/store';

export const useHandleFavorites = (_id: string) => {
  /***** States *****/
  const [internalFavorites, setInternalFavorites] = useState<string[]>([]);

  /***** Constants *****/
  const { userIsGuest } = useUserProvider();
  const { data: favorites } = UserServices.useGetFavorites();
  const { mutate: addToFavorites, isPending: isAddingToFavorites } =
    UserServices.useAddToFavorites();
  const { mutate: removeFromFavorites, isPending: isRemovingFromFavorites } =
    UserServices.useRemoveFromFavorites();

  /***** Memoization *****/
  const isInFavorites = useMemo(() => {
    return internalFavorites.includes(_id);
  }, [internalFavorites, _id]);
  const isLoading = useMemo(
    () => isAddingToFavorites || isRemovingFromFavorites,
    [isAddingToFavorites, isRemovingFromFavorites]
  );

  const handleToggleFavorites = () => {
    if (userIsGuest) {
      Toast.error('Please login or create an account to add to favorites');
      return;
    }

    const favorites = internalFavorites;
    let newFavorites: string[] = [];

    if (isInFavorites) {
      newFavorites = favorites.filter((favorite: string) => favorite !== _id);
      setInternalFavorites(newFavorites);

      removeFromFavorites(
        { locationId: _id },
        {
          onError: () => {
            Toast.error('Failed to remove from favorites');
            setInternalFavorites(favorites);
          },
        }
      );
    } else {
      newFavorites = [...favorites, _id];
      setInternalFavorites(newFavorites);

      addToFavorites(
        { locationId: _id },
        {
          onError: () => {
            Toast.error('Failed to add to favorites');
            setInternalFavorites(favorites);
          },
        }
      );
    }
  };

  useEffect(() => {
    if (favorites) {
      setInternalFavorites(favorites.map((favorite) => favorite._id));
    }
  }, [favorites]);

  return {
    isLoading,
    isInFavorites,
    handleToggleFavorites,
  };
};
