import { ActivityIndicator, TouchableOpacity, StyleSheet, FlatList, View } from 'react-native';
import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';

import {
  type DetailedLocationType,
  type GetLocationsReqType,
  type LocationType,
  LocationServices,
} from '~/src/services';

import { useAppSafeAreaInsets } from '~/src/hooks';
import { FilterIcon } from '~/src/assets/icons';
import { theme } from '~/src/constants/theme';

import { LocationCardSkeleton, SearchHistory, LocationCard } from '~/src/components/preview';
import { FilterModal, ModalWrapperRef } from '~/src/components/modals';
import { SearchInput } from '~/src/components/textInputs';
import { Icon, Text } from '~/src/components/base';
import { Button } from '~/src/components/buttons';

type LocalSearchParams = {
  filterCategory: string;
};

const Search = () => {
  /*** Refs ***/
  const filterModalRef = useRef<ModalWrapperRef>(null);

  /*** States ***/
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [searchResults, setSearchResults] = useState<DetailedLocationType[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<GetLocationsReqType>();

  /*** Constants ***/
  const router = useRouter();
  const queryClient = useQueryClient();
  const { top, bottom } = useAppSafeAreaInsets();
  const { filterCategory } = useLocalSearchParams<LocalSearchParams>();
  const { data: searchHistory } = LocationServices.useGetSearchHistory();
  const { mutate: searchLocations, isPending: isSearching } = LocationServices.useSearchLocations();
  const { mutate: deleteSearchHistory, isPending: isDeletingSearchHistory } =
    LocationServices.useDeleteSearchHistory();
  const {
    isLoading,
    data: locationsData,
    hasNextPage: hasNextPage,
    fetchNextPage: fetchNextPage,
    isFetchingNextPage: isFetchingNextPage,
  } = LocationServices.useGetLocations(selectedFilter);

  useEffect(() => {
    if (filterCategory) {
      setSelectedFilter({ category: filterCategory });
    }
  }, [filterCategory]);
  useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      searchLocations(
        { query: searchQuery },
        {
          onSuccess: (data) => {
            setSearchResults(data.locations);
          },
          onError: () => {
            setSearchResults([]);
          },
        }
      );
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, searchLocations]);

  /*** Memoization ***/
  const isFilterApplied = useMemo(() => {
    const keys = Object.keys(selectedFilter || {});

    if (keys.includes('category') && keys.length === 1) {
      return false;
    }

    return keys.length > 0;
  }, [selectedFilter]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);
  const handleSearchFocus = useCallback(() => {
    setIsSearchMode(true);
  }, []);
  const handleClearSearchInput = useCallback(async () => {
    setSearchQuery('');
    setIsSearchMode(false);

    await queryClient.invalidateQueries({ queryKey: ['searchLocations'] });
    await queryClient.invalidateQueries({ queryKey: ['searchHistory'] });
  }, [queryClient]);
  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);
  const handleClearSearchHistory = useCallback(async () => {
    setIsSearchMode(false);

    deleteSearchHistory();
  }, [deleteSearchHistory, setIsSearchMode]);

  const RenderRecentSearches = useCallback(() => {
    if (!searchHistory || searchHistory.length === 0) {
      return null;
    }

    return (
      <View style={styles.recentSearchesContainer}>
        <View style={styles.recentSearchesHeader}>
          <Text color={theme.colors.darkText[100]} weight="medium">
            Your Recent Searches
          </Text>

          {!isDeletingSearchHistory && searchHistory.length ? (
            <Text weight="medium" color={theme.colors.lightText} onPress={handleClearSearchHistory}>
              Clear All
            </Text>
          ) : (
            <ActivityIndicator color={theme.colors.lightText} />
          )}
        </View>

        <View style={{ gap: theme.spacing.xl }}>
          {searchHistory?.map((history) => (
            <SearchHistory
              data={history}
              key={history.query}
              onPress={() => setSearchQuery(history.query)}
            />
          ))}
        </View>

        <Button variant="ghost" onPress={() => setIsSearchMode(false)} title="Show All Location" />
      </View>
    );
  }, [searchHistory, handleClearSearchHistory, isDeletingSearchHistory]);
  const RenderEmptyComponent = useCallback(() => {
    if (isSearchMode && searchQuery.length === 0) {
      return <RenderRecentSearches />;
    }

    if (isLoading || isFetchingNextPage || isSearching) {
      return Array.from({ length: 10 }).map((_, index) => (
        <LocationCardSkeleton key={index} minWidth={230} />
      ));
    }

    return (
      <Text color={theme.colors.lightText} weight="medium" style={styles.emptyTextStyle}>
        No locations found
      </Text>
    );
  }, [isSearchMode, isLoading, isFetchingNextPage, RenderRecentSearches, isSearching, searchQuery]);
  const RenderFooter = useCallback(() => {
    if (!isFetchingNextPage) return null;

    return <ActivityIndicator color={theme.colors.primaryBlue[100]} />;
  }, [isFetchingNextPage]);
  const RenderItem = useCallback(
    ({ item: category, index }: { item: LocationType; index: number }) => (
      <LocationCard
        data={category}
        delay={index * 100}
        onPress={() => router.navigate(`/(authenticated)/(screens)/location/${category._id}`)}
      />
    ),
    [router]
  );

  return (
    <>
      <View style={[styles.headerContainer, { paddingTop: top }]}>
        <View style={styles.searchContainer}>
          <Icon
            size={24}
            name="arrow-left"
            onPress={() => router.back()}
            color={theme.colors.darkText[100]}
          />

          <SearchInput
            value={searchQuery}
            onSearch={handleSearch}
            onFocus={handleSearchFocus}
            onClear={handleClearSearchInput}
            placeholder="Store, location, or service"
          />

          {!isSearchMode && (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => filterModalRef.current?.present()}
              style={[
                styles.filterButton,
                isFilterApplied && { backgroundColor: theme.colors.primaryBlue[100] },
              ]}>
              <FilterIcon
                color={isFilterApplied ? theme.colors.white.DEFAULT : theme.colors.darkText[100]}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        renderItem={RenderItem}
        onEndReachedThreshold={0.5}
        onEndReached={handleEndReached}
        ListFooterComponent={RenderFooter}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={RenderEmptyComponent}
        keyExtractor={(item, index) => item._id + index}
        data={isSearchMode ? searchResults : locationsData}
        contentContainerStyle={[styles.listContent, { paddingBottom: bottom }]}
      />

      <FilterModal ref={filterModalRef} onApply={(filters) => setSelectedFilter(filters)} />
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
  emptyTextStyle: {
    textAlign: 'center',
    marginTop: theme.spacing.xl,
  },
  listContent: {
    flexGrow: 1,
    gap: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
  },
  recentSearchesContainer: {
    flex: 1,
    gap: theme.spacing.xl,
  },
  recentSearchesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
