import { useLocalSearchParams, useRouter, type RelativePathString } from 'expo-router';
import { View, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useState, useMemo, useCallback, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';

import { SearchIcon, FilterIcon } from '~/src/assets/icons';
import { theme } from '~/src/constants/theme';
import {
  useAppSafeAreaInsets,
  useInfiniteLocations,
  useLocationFilters,
  useDebouncing,
} from '~/src/hooks';

import { Location } from '~/src/services';

import { FilterModal, SearchModal } from '~/src/components/modals';
import { StoreCard } from '~/src/components/preview';
import { Wrapper } from '~/src/components/utils/UI';
import { Icon, Text } from '~/src/components/base';

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
  const debouncedSearchQuery = useDebouncing(searchQuery, 100);

  // Use the location filters hook
  const { appliedFilters, setAppliedFilters, getApiParams } = useLocationFilters();

  // Sync filter parameter with selectedFilter state
  useEffect(() => {
    if (filter) {
      setSelectedFilter(filter);
    }
  }, [filter]);

  // Get API parameters based on current filters and selected category
  const apiParams = useMemo(() => {
    const params = getApiParams({ limit: 20 }); // Reduced limit for better pagination

    // Apply category filter if selected
    if (selectedFilter) {
      params.category = selectedFilter;
    }

    // Apply search query if present
    if (debouncedSearchQuery.trim()) {
      params.title = debouncedSearchQuery.trim();
    }

    return params;
  }, [getApiParams, selectedFilter, debouncedSearchQuery]);

  // Fetch data from APIs - using infinite scroll for locations (includes search)
  const {
    data: locationsData,
    isLoading: locationsLoading,
    error: locationsError,
    hasNextPage: hasNextPage,
    fetchNextPage: fetchNextPage,
    isFetchingNextPage: isFetchingNextPage,
  } = useInfiniteLocations(apiParams);

  /*** Memoization ***/
  const filters = useMemo(() => {
    if (!locationsData || locationsData.length === 0) return [{ id: '', label: 'All' }];

    return [
      { id: '', label: 'All' },
      ...locationsData.map((category) => ({
        id: category._id,
        label: category.title,
      })),
    ];
  }, [locationsData]);

  const filteredCategories = useMemo(() => {
    // Default behavior: filter categories by selected filter
    if (!locationsData || locationsData.length === 0) return [];

    let categories = locationsData;

    // Filter by category if selected
    if (selectedFilter) {
      categories = categories.filter((category) => category._id === selectedFilter);
    }

    return categories;
  }, [locationsData, selectedFilter]);

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
          {category.locations.map((location: Location, locationIndex: number) => {
            return (
              <View
                key={location._id}
                style={{ paddingHorizontal: theme.spacing.lg, marginBottom: theme.spacing.md }}>
                <StoreCard
                  data={location}
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
              <SearchIcon
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
            <FilterIcon />
          </TouchableOpacity>
        </View>

        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContainer}
          data={filters}
          renderItem={({ item: filter }) => {
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
          }}
          keyExtractor={(item) => item.id}
        />
      </View>
    );
  }, [filters, selectedFilter, searchQuery, top]);

  const RenderEmptyComponent = useCallback(() => {
    if (locationsLoading) {
      return (
        <View style={styles.emptyContainer}>
          <Text color={theme.colors.darkText[100]} weight="medium">
            {debouncedSearchQuery.trim() ? 'Searching...' : 'Loading salons...'}
          </Text>
        </View>
      );
    }

    if (locationsError) {
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
  }, [locationsLoading, locationsError, debouncedSearchQuery]);

  const RenderFooter = useCallback(() => {
    if (!isFetchingNextPage) return null;

    return (
      <View style={styles.footerContainer}>
        <Text color={theme.colors.lightText} weight="medium">
          Loading more...
        </Text>
      </View>
    );
  }, [isFetchingNextPage]);

  const renderItem = useCallback(
    ({ item: category, index }: { item: any; index: number }) => (
      <RenderCategorySection category={category} categoryIndex={index} />
    ),
    [RenderCategorySection]
  );

  const keyExtractor = useCallback(
    (item: any, index: number) => `category-${item._id}-${index}`,
    []
  );

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <Wrapper style={[{ paddingTop: top }]}>
      <FlatList
        data={filteredCategories}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={RenderHeader}
        ListEmptyComponent={RenderEmptyComponent}
        ListFooterComponent={RenderFooter}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.listContent, { paddingBottom: bottom }]}
        stickyHeaderIndices={[0]}
      />

      <FilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApply={(filters) => {
          setAppliedFilters(filters);
        }}
        initialFilters={appliedFilters}
      />

      <SearchModal
        visible={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        onSearch={(query) => {
          setSearchQuery(query);
        }}
        initialQuery={searchQuery}
      />
      <StatusBar style="dark" />
    </Wrapper>
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
    padding: theme.spacing.md,
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
  footerContainer: {
    paddingVertical: theme.spacing.lg,
    alignItems: 'center',
  },
  listContent: {
    flexGrow: 1,
    gap: theme.spacing.lg,
  },
});
