import { useState } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { router } from 'expo-router';
import { HomeHeader, SalonSection } from '../../../src/components/utils/salon';
import { mockSalons, Salon } from '../../../src/constants';

const HomePage = () => {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const handleSalonPress = (salon: Salon) => {
    router.push({
      pathname: '/(authenticated)/(tabs)/search/[id]',
      params: { id: salon.id },
    });
  };

  const handleFavoritePress = (salonId: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(salonId)) {
        newFavorites.delete(salonId);
      } else {
        newFavorites.add(salonId);
      }
      return newFavorites;
    });
  };

  const handleSeeAllPress = (category: string) => {
    // Navigate to search screen with the selected category
    router.push({
      pathname: '/(authenticated)/(tabs)/search',
      params: { category },
    });
  };

  // Update salon data with current favorite state
  const getSalonsWithFavorites = (salons: Salon[]) => {
    return salons.map((salon) => ({
      ...salon,
      isFavorite: favorites.has(salon.id),
    }));
  };

  return (
    <View style={[styles.container]}>
      <HomeHeader userName="Samir" />

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        <SalonSection
          title="HAIR & STYLING"
          salons={getSalonsWithFavorites(mockSalons.hairAndStyling)}
          onSalonPress={handleSalonPress}
          onFavoritePress={handleFavoritePress}
          onSeeAllPress={() => handleSeeAllPress('hair-styling')}
        />

        <SalonSection
          title="NAILS"
          salons={getSalonsWithFavorites(mockSalons.nails)}
          onSalonPress={handleSalonPress}
          onFavoritePress={handleFavoritePress}
          onSeeAllPress={() => handleSeeAllPress('nails')}
        />

        <SalonSection
          title="BARBER"
          salons={getSalonsWithFavorites(mockSalons.barber)}
          onSalonPress={handleSalonPress}
          onFavoritePress={handleFavoritePress}
          onSeeAllPress={() => handleSeeAllPress('barber')}
        />
      </ScrollView>
    </View>
  );
};

export default HomePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
});
