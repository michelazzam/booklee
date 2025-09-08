import { useState, useMemo } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SearchBar, FilterTags, FilterCategory, FilterModal } from '~/src/components/search';
import { ExploreSalonCard } from '~/src/components/utils/salon';
import { mockSalons, Salon } from '~/src/data/mockSalons';
import { theme } from '~/src/constants/theme';
import { useAppSafeAreaInsets } from '~/src/hooks/useAppSafeAreaInsets';

const allSalons: Salon[] = [
  ...mockSalons.hairAndStyling,
  ...mockSalons.nails,
  ...mockSalons.barber,
  ...mockSalons.eyebrowsEyelashes,
];

const categories: FilterCategory[] = [
  { id: 'hair-styling', label: 'Hair & Styling' },
  { id: 'nails', label: 'Nails' },
  { id: 'barber', label: 'Barber' },
  { id: 'eyebrows-eyelashes', label: 'Eyebrows & Eyelashes' },
];

export default function Search() {
  const { category } = useLocalSearchParams<{ category?: string }>();
  const [visible, setVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(category || 'hair-styling');
  const { top } = useAppSafeAreaInsets();

  const filteredSalons = useMemo(() => {
    let filtered = allSalons;

    // Filter by category
    if (selectedCategory === 'hair-styling') {
      filtered = mockSalons.hairAndStyling;
    } else if (selectedCategory === 'nails') {
      filtered = mockSalons.nails;
    } else if (selectedCategory === 'barber') {
      filtered = mockSalons.barber;
    } else if (selectedCategory === 'eyebrows-eyelashes') {
      filtered = mockSalons.eyebrowsEyelashes;
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (salon) =>
          salon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          salon.city.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [selectedCategory, searchQuery]);

  const handleSalonPress = (salon: Salon) => {
    router.push({
      pathname: '/(authenticated)/(tabs)/search/[id]',
      params: { id: salon.id },
    });
  };

  const handleFavoritePress = (salonId: string) => {
    // TODO: Toggle favorite status
    console.log('Favorite pressed:', salonId);
  };

  const handleMapPress = (salon: Salon) => {
    // TODO: Open map with salon location
    console.log('Map pressed for:', salon.name);
  };

  const handleFilterPress = () => {
    setVisible(true);
    console.log('Filter pressed');
  };

  const renderSalonCard = ({ item }: { item: Salon }) => (
    <ExploreSalonCard
      id={item.id}
      image={item.image}
      name={item.name}
      location={item.city}
      rating={item.rating}
      tag={item.tag}
      isFavorite={item.isFavorite}
      onPress={() => handleSalonPress(item)}
      onFavoritePress={() => handleFavoritePress(item.id)}
      onMapPress={() => handleMapPress(item)}
    />
  );

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <View style={styles.content}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onFilterPress={handleFilterPress}
        />

        <FilterTags
          categories={categories}
          selectedCategoryId={selectedCategory}
          onCategorySelect={setSelectedCategory}
        />

        <FlatList
          data={filteredSalons}
          renderItem={renderSalonCard}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      </View>
      <FilterModal visible={visible} onClose={() => setVisible(false)} onApply={() => {}} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: theme.colors.white.DEFAULT,
  },
  content: {
    flex: 1,
  },
  listContent: {
    paddingBottom: theme.spacing.xl,
  },
});
