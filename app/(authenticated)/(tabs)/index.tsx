import { useState } from 'react';
import { StyleSheet, ScrollView, SafeAreaView, StatusBar } from 'react-native';
import { HomeHeader, SalonSection } from '../../../src/components/utils/salon';
import { mockSalons, Salon } from '../../../src/data';

export default function HomePage() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const handleSalonPress = (salon: Salon) => {
    // TODO: Navigate to salon details
    console.log('Salon pressed:', salon.name);
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
    // TODO: Navigate to category page
    console.log('See all pressed for:', category);
  };

  // Update salon data with current favorite state
  const getSalonsWithFavorites = (salons: Salon[]) => {
    return salons.map((salon) => ({
      ...salon,
      isFavorited: favorites.has(salon.id),
    }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#476c80" />
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
          onSeeAllPress={() => handleSeeAllPress('hair-and-styling')}
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
    </SafeAreaView>
  );
}

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
