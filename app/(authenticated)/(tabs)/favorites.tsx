import { View, StyleSheet, Image, FlatList, RefreshControl } from 'react-native';
import { useCallback, useState } from 'react';
import { useRouter } from 'expo-router';

import { UserServices, type LocationType } from '~/src/services';
import { useUserProvider } from '~/src/store';

import { useAppSafeAreaInsets } from '~/src/hooks';
import { theme, IMAGES } from '~/src/constants';

import { LocationCard, LocationCardSkeleton } from '~/src/components/preview';
import { Text, HeaderNavigation } from '~/src/components/base';
import { Button } from '~/src/components/buttons';

const FavoritesPage = () => {
  /*** Constants ***/
  const router = useRouter();
  const { bottom } = useAppSafeAreaInsets();
  const { userIsGuest, logoutGuest } = useUserProvider();
  const { data: favorites, refetch, isLoading } = UserServices.useGetFavorites();

  /*** States ***/
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    refetch().finally(() => {
      setRefreshing(false);
    });
  }, [refetch]);

  const RenderItem = useCallback(
    ({ item }: { item: LocationType }) => (
      <LocationCard
        data={item}
        width={'48%'}
        onPress={() => router.navigate(`/(authenticated)/(screens)/location/${item._id}`)}
      />
    ),
    [router]
  );
  const RenderListEmptyComponent = useCallback(() => {
    if (userIsGuest) {
      return (
        <View style={styles.emptyStateContent}>
          <Image source={IMAGES.favorites.placeholder} style={styles.emptyStateImage} />

          <Text
            size={22}
            weight="bold"
            style={{ textAlign: 'center' }}
            color={theme.colors.darkText[100]}>
            Save Your Favorite Places
          </Text>

          <Text
            size={14}
            weight="regular"
            color={theme.colors.lightText}
            style={styles.emptyStateDescription}>
            Sign in to save and sync your favorite locations across all your devices. Never lose
            track of the places you love!
          </Text>

          <Button title="Login" onPress={logoutGuest} />
        </View>
      );
    }

    if (isLoading) {
      return Array.from({ length: 10 }).map((_, index) => (
        <LocationCardSkeleton key={index} minWidth={230} />
      ));
    }

    return (
      <View style={styles.emptyStateContent}>
        <Image source={IMAGES.favorites.placeholder} style={styles.emptyStateImage} />

        <Text
          size={18}
          weight="semiBold"
          style={{ textAlign: 'center' }}
          color={theme.colors.darkText[100]}>
          No favorites yet
        </Text>

        <Text
          size={14}
          weight="regular"
          color={theme.colors.lightText}
          style={styles.emptyStateDescription}>
          You can add a place to your favorites by tapping on the heart icon at the top right corner
          of the listing.
        </Text>

        <Button
          title="Start Exploring"
          onPress={() => router.navigate('/(authenticated)/(tabs)/search')}
        />
      </View>
    );
  }, [router, isLoading, userIsGuest, logoutGuest]);
  const RenderRefreshControl = useCallback(() => {
    return (
      <RefreshControl
        refreshing={refreshing}
        onRefresh={handleRefresh}
        colors={[theme.colors.primaryBlue[100]]}
        tintColor={theme.colors.primaryBlue[100]}
      />
    );
  }, [refreshing, handleRefresh]);

  return (
    <>
      <HeaderNavigation title="FAVORITES" showBackButton={false} />

      <FlatList
        numColumns={2}
        data={favorites}
        renderItem={RenderItem}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        refreshControl={RenderRefreshControl()}
        ListEmptyComponent={RenderListEmptyComponent}
        columnWrapperStyle={{ gap: theme.spacing.lg }}
        contentContainerStyle={[styles.listContent, { paddingBottom: bottom }]}
      />
    </>
  );
};

export default FavoritesPage;

const styles = StyleSheet.create({
  emptyStateContent: {
    flex: 1,
    gap: theme.spacing.lg,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.md,
  },
  emptyStateImage: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    marginBottom: theme.spacing.xl,
  },
  emptyStateDescription: {
    lineHeight: 20,
    textAlign: 'center',
  },
  listContent: {
    flexGrow: 1,
    gap: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
  },
});
