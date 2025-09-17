import { View, StyleSheet, Image, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';

import { theme, IMAGES } from '~/src/constants';

import { FavoritesServices } from '~/src/services';
import { useAppSafeAreaInsets } from '~/src/hooks';

import { Text, HeaderNavigation } from '~/src/components/base';
import { StoreCard } from '~/src/components/preview';
import { Button } from '~/src/components/buttons';

const FavoritesPage = () => {
  /*** Constants ***/
  const router = useRouter();
  const { bottom } = useAppSafeAreaInsets();
  const { data: favorites } = FavoritesServices.useGetFavorites();

  const RenderItem = useCallback(({ item }: { item: any }) => <StoreCard data={item} />, []);
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
        keyExtractor={(_, index) => index.toString()}
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
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  emptyStateImage: {
    width: 200,
    height: 200,
    alignSelf: 'center',
  },
  emptyStateDescription: {
    lineHeight: 20,
    marginBottom: theme.spacing.xl,
  },
  cardWrapper: {
    width: '48%',
    marginBottom: theme.spacing.md,
  },
  listContent: {
    flexGrow: 1,
    gap: theme.spacing.lg,
  },
});
