import { useState } from 'react';
import { View, StyleSheet, FlatList, Image, ActivityIndicator } from 'react-native';
import { theme, IMAGES } from '../../../src/constants';
import Button from '../../../src/components/buttons/button';
import CustomText from '../../../src/components/base/text';
import SalonCard from '../../../src/components/utils/salon/SalonCard';
import { Wrapper } from '~/src/components/utils/UI';
import { FavoritesServices } from '~/src/services';

// Transform favorite data to match SalonCard props
const transformFavoriteToSalon = (favorite: any) => ({
  id: favorite._id,
  image: favorite.logo,
  name: favorite.name,
  city: favorite.city,
  rating: 4.5, // Default rating since it's not in the API response
  tag: favorite.tags?.[0] || 'Available',
  isFavorite: true,
});

const FavoritesPage = () => {
  // Toggle between empty and populated states for demo
  const [showEmptyState, setShowEmptyState] = useState(false);

  // Get favorites data
  const { data: favorites, isLoading, error } = FavoritesServices.useGetFavorites();
  const { toggleFavorite } = FavoritesServices.useToggleFavorite();

  // Transform favorites to salon format
  const favoriteSalons = favorites?.map(transformFavoriteToSalon) || [];

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
      <View style={styles.populatedContainer}>
        <FlatList
          data={favoriteSalons}
          numColumns={2}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.salonGrid}
          columnWrapperStyle={styles.salonRow}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.salonCardWrapper}>
              <SalonCard
                id={item.id}
                image={item.image}
                name={item.name}
                city={item.city}
                rating={item.rating}
                tag={item.tag}
                isFavorite={item.isFavorite}
                onPress={() => {
                  // Navigate to salon details
                  console.log('Navigate to salon:', item.name);
                }}
                onFavoritePress={async () => {
                  try {
                    await toggleFavorite(item.id);
                  } catch (error) {
                    console.error('Error toggling favorite:', error);
                  }
                }}
              />
            </View>
          )}
        />
      </View>
    );
  };

  return (
    <Wrapper style={styles.container}>
      <View style={styles.header}>
        <CustomText size={16} weight="medium" style={styles.headerTitle}>
          FAVORITES
        </CustomText>
      </View>

      {showEmptyState || favoriteSalons.length === 0 ? <EmptyState /> : <PopulatedState />}
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    flexGrow: 1,
    paddingHorizontal: theme.spacing.md,
  },
  salonGrid: {
    paddingVertical: theme.spacing.md,
    flexGrow: 1,
  },
  salonRow: {
    justifyContent: 'space-between',
  },
  salonCardWrapper: {
    flex: 1,
    maxWidth: '50%',
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
