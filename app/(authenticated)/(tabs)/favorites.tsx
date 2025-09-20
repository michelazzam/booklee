import { View, StyleSheet, Image, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';

import { UserServices, type LocationType } from '~/src/services';

import { useAppSafeAreaInsets } from '~/src/hooks';
import { theme, IMAGES } from '~/src/constants';

import { Text, HeaderNavigation } from '~/src/components/base';
import { LocationCard } from '~/src/components/preview';
import { Button } from '~/src/components/buttons';

const FavoritesPage = () => {
  /*** Constants ***/
  const router = useRouter();
  const { bottom } = useAppSafeAreaInsets();
  const { data: favorites } = UserServices.useGetFavorites();

  const RenderItem = useCallback(
    ({ item }: { item: LocationType }) => <LocationCard data={item} width={'48%'} />,
    []
  );
  const RenderListEmptyComponent = useCallback(
    () => (
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
    ),
    [router]
  );

  return (
    <>
      <HeaderNavigation title="FAVORITES" showBackButton={false} />

      <FlatList
        numColumns={2}
        data={favorites}
        renderItem={RenderItem}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={RenderListEmptyComponent}
        columnWrapperStyle={{ gap: theme.spacing.lg }}
        keyExtractor={(item, index) => item._id + index}
        contentContainerStyle={[styles.listContent, { paddingBottom: bottom }]}
      />
    </>
  );
};

export default FavoritesPage;

const styles = StyleSheet.create({
  emptyStateContent: {
    flex: 1,
    alignItems: 'center',
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
