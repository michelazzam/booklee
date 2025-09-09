import { useState } from 'react';
import { View, StyleSheet, FlatList, Image } from 'react-native';
import { theme, IMAGES, mockSalons, Salon } from '../../../../src/constants';
import Button from '../../../../src/components/buttons/button';
import CustomText from '../../../../src/components/base/text';
import SalonCard from '../../../../src/components/utils/salon/SalonCard';
import { Wrapper } from '~/src/components/utils/UI';

// Get all salons and filter for favorites (demo purposes)
const getAllSalons = (): Salon[] => {
  return [
    ...mockSalons.hairAndStyling,
    ...mockSalons.nails,
    ...mockSalons.barber,
    ...mockSalons.eyebrowsEyelashes,
  ];
};

// Mock favorite salons data for demo - using some from the shared data
const mockFavoriteSalons: Salon[] = getAllSalons()
  .filter((salon) => salon.isFavorite)
  .concat([
    // Add a few more for demo purposes
    {
      id: '4',
      image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=300&fit=crop',
      name: 'Pink Peony Nails',
      city: 'Jbeil',
      rating: 4.6,
      tag: 'Special offer this week',
      isFavorite: true,
    },
    {
      id: '6',
      image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=300&fit=crop',
      name: 'Bliss Beauty',
      city: 'Jounieh',
      rating: 4.3,
      tag: 'Special offer this week',
      isFavorite: true,
    },
  ]);

const FavoritesPage = () => {
  // Toggle between empty and populated states for demo
  const [showEmptyState, setShowEmptyState] = useState(false);

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

  const PopulatedState = () => (
    <View style={styles.populatedContainer}>
      <FlatList
        data={mockFavoriteSalons}
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
              onFavoritePress={() => {
                // Toggle favorite
                console.log('Toggle favorite for:', item.name);
              }}
            />
          </View>
        )}
      />
    </View>
  );

  return (
    <Wrapper style={styles.container}>
      <View style={styles.header}>
        <CustomText size={16} weight="medium" style={styles.headerTitle}>
          FAVORITES
        </CustomText>

        {/* Demo toggle button */}
        <Button
          title={showEmptyState ? 'Show Favorites' : 'Show Empty'}
          onPress={() => setShowEmptyState(!showEmptyState)}
          variant="outline"
          containerStyle={styles.toggleButton}
        />
      </View>

      {showEmptyState ? <EmptyState /> : <PopulatedState />}
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
});

export default FavoritesPage;
