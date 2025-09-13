import { useLocalSearchParams, useRouter, type RelativePathString } from 'expo-router';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useState, useMemo, useCallback, useEffect } from 'react';
import { useDebouncing } from '~/src/hooks';

import { useAppSafeAreaInsets } from '~/src/hooks';
import { theme } from '~/src/constants/theme';

import { StoreCard } from '~/src/components/preview';
import { FilterModal, SearchModal } from '~/src/components/modals';
import { Icon, Text } from '~/src/components/base';
import { LocationServices, SearchServices } from '~/src/services';

const Search = () => {
  /*** Constants ***/
  const router = useRouter();
  const { top, bottom } = useAppSafeAreaInsets();
  const { filter } = useLocalSearchParams<{ filter?: string }>();

  /*** States ***/
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>(filter || '');
  const debouncedSearchQuery = useDebouncing(searchQuery, 500);

  // Sync filter parameter with selectedFilter state
  useEffect(() => {
    if (filter) {
      setSelectedFilter(filter);
    }
  }, [filter]);

  // Fetch data from APIs - using grouped categories
  const {
    data: locationsData,
    isLoading: locationsLoading,
    error: locationsError,
  } = LocationServices.useGetLocationsByCategories();

  // Fetch search results when there's a search query
  const {
    data: searchResults,
    isLoading: searchLoading,
    error: searchError,
  } = SearchServices.useSearchLocations(
    { query: debouncedSearchQuery, limit: 50 },
    !!debouncedSearchQuery.trim()
  );

  /*** Memoization ***/
  const filters = useMemo(() => {
    if (!locationsData?.categories) return [{ id: '', label: 'All' }];

    return [
      { id: '', label: 'All' },
      ...locationsData.categories.map((category) => ({
        id: category._id,
        label: category.title,
      })),
    ];
  }, [locationsData]);

  const filteredCategories = useMemo(() => {
    // If there's a search query, use search results instead of filtered categories
    if (debouncedSearchQuery.trim() && searchResults) {
      // Group search results by category
      const groupedResults = searchResults.reduce(
        (acc, location) => {
          const categoryId = location.categoryId;
          if (!acc[categoryId]) {
            acc[categoryId] = {
              _id: categoryId,
              title: location.category.title,
              slug: location.category.slug,
              locations: [],
            };
          }
          acc[categoryId].locations.push(location);
          return acc;
        },
        {} as Record<string, any>
      );

      return Object.values(groupedResults);
    }

    // Default behavior: filter categories by selected filter
    if (!locationsData?.categories) return [];

    let categories = locationsData.categories;

    // Filter by category if selected
    if (selectedFilter) {
      categories = categories.filter((category) => category._id === selectedFilter);
    }

    return categories;
  }, [locationsData, selectedFilter, debouncedSearchQuery, searchResults]);

  const RenderCategorySection = useCallback(
    ({ category, categoryIndex }: { category: any; categoryIndex: number }) => {
      return (
        <View style={{ marginBottom: theme.spacing.xl }}>
          {/* Category Title */}
          <View style={{ paddingHorizontal: theme.spacing.lg, marginBottom: theme.spacing.md }}>
            <Text
              weight="medium"
              color={theme.colors.darkText[100]}
              size={theme.typography.fontSizes.lg}>
              {category.title}
            </Text>
          </View>

          {/* Locations in this category */}
          {category.locations.map((location: any, locationIndex: number) => {
            const storeData = {
              id: location._id,
              tag: category.title,
              name: location.name,
              city: location.city || 'Unknown',
              image:
                location.logo ||
                'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop',
              rating: location.rating || 4.5,
              about: 'Services available',
              openingHours: 'Hours not available',
              isFavorite: false,
            };

            return (
              <View
                key={location._id}
                style={{ paddingHorizontal: theme.spacing.lg, marginBottom: theme.spacing.md }}>
                <StoreCard
                  data={storeData}
                  delay={categoryIndex * 100 + locationIndex * 150}
                  animatedStyle="slideUp"
                  onPress={() =>
                    router.navigate(
                      `/(authenticated)/(screens)/store/${location._id}` as RelativePathString
                    )
                  }
                />
              </View>
            );
          })}
        </View>
      );
    },
    [router]
  );
  const RenderHeader = useCallback(() => {
    return (
      <View style={[styles.headerContainer, { paddingTop: top }]}>
        <View style={styles.searchContainer}>
          <TouchableOpacity
            style={[styles.searchButton, searchQuery && styles.searchButtonActive]}
            onPress={() => setShowSearchModal(true)}
            activeOpacity={0.8}>
            <View style={styles.searchButtonContent}>
              <Icon
                name="magnify"
                size={20}
                color={searchQuery ? theme.colors.primaryBlue[100] : theme.colors.lightText}
              />
              <Text
                style={styles.searchButtonText}
                color={searchQuery ? theme.colors.darkText[100] : theme.colors.lightText}>
                {searchQuery ? `"${searchQuery}"` : 'Store, location, or service'}
              </Text>
              {searchQuery && (
                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation();
                    setSearchQuery('');
                  }}
                  style={styles.clearButton}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <Icon name="close" size={18} color={theme.colors.lightText} />
                </TouchableOpacity>
              )}
            </View>
          </TouchableOpacity>

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
  }, [filters, selectedFilter, searchQuery, top]);

  const isLoading = debouncedSearchQuery.trim() ? searchLoading : locationsLoading;
  const hasError = debouncedSearchQuery.trim() ? searchError : locationsError;

  const RenderEmptyComponent = useCallback(() => {
    if (isLoading) {
      return (
        <View style={styles.emptyContainer}>
          <Text color={theme.colors.darkText[100]} weight="medium">
            {debouncedSearchQuery.trim() ? 'Searching...' : 'Loading salons...'}
          </Text>
        </View>
      );
    }

    if (hasError) {
      return (
        <View style={styles.emptyContainer}>
          <Text color={theme.colors.red[100]} weight="medium">
            Error loading data. Please try again.
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Text color={theme.colors.darkText[100]} weight="medium">
          {debouncedSearchQuery.trim()
            ? `No results found for "${debouncedSearchQuery}"`
            : 'No salons found'}
        </Text>
      </View>
    );
  }, [isLoading, hasError, debouncedSearchQuery]);

  return (
    <>
      <ScrollView
        stickyHeaderIndices={[0]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.listContent, { paddingBottom: bottom }]}>
        <RenderHeader />

        {filteredCategories.length === 0 ? (
          <RenderEmptyComponent />
        ) : (
          filteredCategories.map((category, index) => (
            <RenderCategorySection key={category._id} category={category} categoryIndex={index} />
          ))
        )}
      </ScrollView>

      <FilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApply={() => {}}
      />

      <SearchModal
        visible={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        onSearch={(query) => {
          setSearchQuery(query);
        }}
        initialQuery={searchQuery}
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
  searchButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.md,
    backgroundColor: theme.colors.white.DEFAULT,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  searchButtonActive: {
    borderColor: theme.colors.primaryBlue[100],
    backgroundColor: theme.colors.primaryBlue[10] || theme.colors.white.DEFAULT,
  },
  searchButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  searchButtonText: {
    flex: 1,
    fontSize: theme.typography.fontSizes.md,
  },
  clearButton: {
    padding: theme.spacing.xs,
    marginLeft: theme.spacing.xs,
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
