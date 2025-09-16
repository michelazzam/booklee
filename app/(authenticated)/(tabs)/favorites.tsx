import { useState } from 'react';
import { View, StyleSheet, ScrollView, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { type RelativePathString } from 'expo-router';
import { theme, IMAGES } from '../../../src/constants';
import Button from '../../../src/components/buttons/button';
import CustomText from '../../../src/components/base/text';
import { FavoriteCard } from '../../../src/components/preview';
import { Wrapper } from '~/src/components/utils/UI';
import { FavoritesServices } from '~/src/services';

// Transform favorite data to match Store props
const transformFavoriteToStore = (favorite: any): any => ({
  id: favorite._id,
  image:
    favorite.logo ||
    'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop',
  name: favorite.name,
  city: favorite.city,
  rating: 4.5, // Default rating since it's not in the API response
  tag: favorite.tags?.[0] || 'Available',
  about: 'Services available',
  openingHours: 'Hours not available',
  isFavorite: true,
});

const FavoritesPage = () => {
  // Toggle between empty and populated states for demo
  const [showEmptyState, setShowEmptyState] = useState(false);
  const router = useRouter();

  // Get favorites data
  const { data: favorites, isLoading, error } = FavoritesServices.useGetFavorites();

  // Transform favorites to store format
  const favoriteStores = favorites?.map(transformFavoriteToStore) || [];

  const EmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <View style={styles.emptyStateContent}>
        <View style={styles.emptyStateImageContainer}>
          <Image source={IMAGES.favorites.placeholder} style={styles.emptyStateImage} />
        </View>

        <CustomText
          weight="semiBold"
          size={18}
          color={theme.colors.darkText[100]}
          style={styles.emptyStateTitle}>
          No favorites yet
        </CustomText>

        <CustomText
          weight="regular"
          size={14}
          color={theme.colors.lightText}
          style={styles.emptyStateDescription}>
          You can add a place to your favorites by tapping on the heart icon at the top right corner
          of the listing.
        </CustomText>

        <Button
          title="Start Exploring"
          onPress={() => setShowEmptyState(false)}
          containerStyle={styles.startExploringButton}
        />
      </View>
    </View>
  );

  const PopulatedState = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.darkText[100]} />
          <CustomText
            weight="medium"
            size={14}
            color={theme.colors.lightText}
            style={styles.loadingText}>
            Loading favorites...
          </CustomText>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.errorContainer}>
          <CustomText
            weight="medium"
            size={14}
            color={theme.colors.darkText[100]}
            style={styles.errorText}>
            Failed to load favorites. Please try again.
          </CustomText>
        </View>
      );
    }

    return (
      <ScrollView
        style={styles.populatedContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.gridContainer}>
          {favoriteStores.map((store, index) => (
            <View key={store.id} style={styles.cardWrapper}>
              <FavoriteCard
                data={store}
                animatedStyle="slideUp"
                delay={index * 100}
                onPress={() => {
                  router.navigate(
                    `/(authenticated)/(screens)/store/${store.id}` as RelativePathString
                  );
                }}
              />
            </View>
          ))}
        </View>
      </ScrollView>
    );
  };

  return (
    <Wrapper style={styles.container}>
      <View style={styles.header}>
        <CustomText size={16} weight="medium" style={styles.headerTitle}>
          FAVORITES
        </CustomText>
      </View>

      {showEmptyState || favoriteStores.length === 0 ? <EmptyState /> : <PopulatedState />}
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: theme.colors.white.DEFAULT,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  headerTitle: {
    textAlign: 'center',
    flex: 1,
  },
  toggleButton: {
    width: 120,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  emptyStateContent: {
    alignItems: 'center',
    maxWidth: 300,
  },
  emptyStateImageContainer: {
    marginBottom: theme.spacing.xl,
  },
  emptyStateImage: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  emptyStateTitle: {
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  emptyStateDescription: {
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: theme.spacing.xl,
  },
  startExploringButton: {
    width: '100%',
  },
  populatedContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: theme.spacing.md,
  },
  cardWrapper: {
    width: '48%',
    marginBottom: theme.spacing.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  loadingText: {
    marginTop: theme.spacing.md,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  errorText: {
    textAlign: 'center',
  },
});

export default FavoritesPage;
