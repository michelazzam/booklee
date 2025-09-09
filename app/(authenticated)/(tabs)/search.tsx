import { useLocalSearchParams, useRouter, type RelativePathString } from 'expo-router';
import { View, FlatList, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useState, useMemo, useCallback } from 'react';

import { hairAndStyling, nails, barber, eyebrowsEyelashes, type Store } from '~/src/mock';
import { useAppSafeAreaInsets } from '~/src/hooks';
import { theme } from '~/src/constants/theme';

import { SearchInput } from '~/src/components/textInputs';
import { StoreCard } from '~/src/components/preview';
import { FilterModal } from '~/src/components/modals';
import { Icon, Text } from '~/src/components/base';

type Filter = {
  id: string;
  label: string;
};
const filters: Filter[] = [
  { id: '', label: 'All' },
  { id: 'hair-styling', label: 'Hair & Styling' },
  { id: 'nails', label: 'Nails' },
  { id: 'barber', label: 'Barber' },
  { id: 'eyebrows-eyelashes', label: 'Eyebrows & Eyelashes' },
];

const allSalons: Store[] = [...hairAndStyling, ...nails, ...barber, ...eyebrowsEyelashes];
const Search = () => {
  /*** Constants ***/
  const router = useRouter();
  const { top, bottom } = useAppSafeAreaInsets();
  const { filter } = useLocalSearchParams<{ filter?: string }>();

  /*** States ***/
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>(filter || '');

  /*** Memoization ***/
  const stores = useMemo(() => {
    let filtered = allSalons;

    switch (selectedFilter) {
      case 'hair-styling':
        filtered = hairAndStyling;
        break;
      case 'nails':
        filtered = nails;
        break;
      case 'barber':
        filtered = barber;
        break;
      case 'eyebrows-eyelashes':
        filtered = eyebrowsEyelashes;
        break;
      default:
        filtered = allSalons;
        break;
    }

    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (store) =>
          store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          store.city.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [selectedFilter, searchQuery]);

  const RenderItem = useCallback(
    ({ item }: { item: Store }) => (
      <View style={{ paddingHorizontal: theme.spacing.lg }}>
        <StoreCard
          data={item}
          onPress={() =>
            router.navigate(`/(authenticated)/(screens)/store/${item.id}` as RelativePathString)
          }
        />
      </View>
    ),
    [router]
  );
  const RenderHeader = useCallback(() => {
    return (
      <View style={[styles.headerContainer, { paddingTop: top }]}>
        <View style={styles.searchContainer}>
          <SearchInput onSearch={setSearchQuery} placeholder="Store, location, or service" />

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.filterButton}
            onPress={() => setShowFilterModal(true)}>
            <Icon name="filter" size={24} color={theme.colors.darkText[100]} />
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContainer}>
          {filters.map((filter) => {
            const isSelected = selectedFilter === filter.id;

            return (
              <TouchableOpacity
                key={filter.id}
                activeOpacity={0.7}
                onPress={() => setSelectedFilter(filter.id)}
                style={[
                  styles.tagContainer,
                  isSelected && {
                    backgroundColor: theme.colors.primaryBlue[100],
                    borderColor: theme.colors.primaryBlue[100],
                  },
                ]}>
                <Text color={isSelected ? theme.colors.white.DEFAULT : theme.colors.darkText[100]}>
                  {filter.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  }, [setSearchQuery, selectedFilter, top]);
  const RenderEmptyComponent = useCallback(() => {
    return (
      <View style={styles.emptyContainer}>
        <Text color={theme.colors.darkText[100]} weight="medium">
          No salons found
        </Text>
      </View>
    );
  }, []);

  return (
    <>
      <FlatList
        data={stores}
        renderItem={RenderItem}
        stickyHeaderIndices={[0]}
        stickyHeaderHiddenOnScroll
        keyExtractor={(item) => item.id}
        ListHeaderComponent={RenderHeader}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={RenderEmptyComponent}
        contentContainerStyle={[styles.listContent, { paddingBottom: bottom }]}
      />

      <FilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApply={() => {}}
      />
    </>
  );
};

export default Search;

const styles = StyleSheet.create({
  headerContainer: {
    gap: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    backgroundColor: theme.colors.white.DEFAULT,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.lg,
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
  },
  filterButton: {
    borderWidth: 1,
    padding: theme.spacing.md,
    borderRadius: theme.radii.sm,
    borderColor: theme.colors.border,
  },
  filterContainer: {
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
  },
  tagContainer: {
    borderWidth: 1,
    borderRadius: theme.radii.full,
    borderColor: theme.colors.border,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.white.DEFAULT,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    flexGrow: 1,
    gap: theme.spacing.lg,
  },
});
