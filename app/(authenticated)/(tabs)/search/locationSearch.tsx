import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useState, useCallback, useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';

import { type DetailedLocationType, LocationServices } from '~/src/services';
import { useUserProvider } from '~/src/store';

import { useAppSafeAreaInsets } from '~/src/hooks';
import { theme } from '~/src/constants/theme';

import { LocationCardSkeleton, SearchHistory, LocationCard } from '~/src/components/preview';
import { SearchInput, type SearchInputRef } from '~/src/components/textInputs';
import { Text, AwareScrollView } from '~/src/components/base';
import { BackIcon } from '~/src/assets/icons';

const Search = () => {
  /*** Refs ***/
  const searchInputRef = useRef<SearchInputRef>(null);

  /*** States ***/
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<DetailedLocationType[]>([]);

  /*** Constants ***/
  const router = useRouter();
  const queryClient = useQueryClient();
  const { userIsGuest } = useUserProvider();
  const { top, bottom } = useAppSafeAreaInsets();
  const { data: searchHistory } = LocationServices.useGetSearchHistory();
  const { mutate: searchLocations, isPending: isSearching } = LocationServices.useSearchLocations();
  const { mutate: deleteSearchHistory, isPending: isDeletingSearchHistory } =
    LocationServices.useDeleteSearchHistory();

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

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);
  const handleClearSearchInput = useCallback(async () => {
    setSearchQuery('');
    searchInputRef.current?.blur();

    await queryClient.invalidateQueries({ queryKey: ['searchLocations'] });
    await queryClient.invalidateQueries({ queryKey: ['searchHistory'] });
  }, [queryClient]);
  const handleClearSearchHistory = useCallback(async () => {
    deleteSearchHistory();
  }, [deleteSearchHistory]);

  const RenderRecentSearches = useCallback(() => {
    if (searchHistory?.length === 0 && !isSearching) {
      return (
        <Text color={theme.colors.lightText} weight="medium" style={styles.emptyTextStyle}>
          You have not searched anything yet
        </Text>
      );
    }

    return (
      <View style={styles.recentSearchesContainer}>
        <View style={styles.recentSearchesHeader}>
          <Text
            weight="semiBold"
            color={theme.colors.lightText}
            size={theme.typography.fontSizes.xs}>
            Your Recent Searches
          </Text>

          {!isDeletingSearchHistory ? (
            <Text
              weight="medium"
              color={theme.colors.lightText}
              onPress={handleClearSearchHistory}
              size={theme.typography.fontSizes.xs}
              style={{ textDecorationLine: 'underline' }}>
              Clear All
            </Text>
          ) : (
            <ActivityIndicator color={theme.colors.lightText} />
          )}
        </View>

        <View style={{ gap: theme.spacing.xl }}>
          {searchHistory?.map((history, index) => (
            <SearchHistory
              key={index}
              data={history}
              onPress={() => setSearchQuery(history.query)}
            />
          ))}
        </View>
      </View>
    );
  }, [searchHistory, handleClearSearchHistory, isDeletingSearchHistory, isSearching]);
  const RenderEmptyComponent = useCallback(() => {
    if (isSearching) {
      return Array.from({ length: 10 }).map((_, index) => (
        <LocationCardSkeleton key={index} minWidth={230} />
      ));
    }

    return !userIsGuest ? <RenderRecentSearches /> : null;
  }, [RenderRecentSearches, userIsGuest, isSearching]);

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <View style={{ height: 48 }}>
        <SearchInput
          autoFocus
          value={searchQuery}
          icon={<BackIcon />}
          ref={searchInputRef}
          onSearch={handleSearch}
          onClear={handleClearSearchInput}
          onIconPress={() => router.back()}
          placeholder="Store, location, or service"
          placeholderTextColor={theme.colors.lightText}
        />
      </View>

      <AwareScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.listContent, { paddingBottom: bottom }]}>
        {!searchQuery ? (
          <RenderEmptyComponent />
        ) : (
          searchResults.map((result, index) => (
            <LocationCard
              data={result}
              key={result._id}
              delay={index * 100}
              onPress={() => router.navigate(`/(authenticated)/(screens)/location/${result._id}`)}
            />
          ))
        )}
      </AwareScrollView>

      {/* <FlatList
        data={searchResults}
        renderItem={RenderItem}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        style={{ marginTop: theme.spacing.xl }}
        ListEmptyComponent={RenderEmptyComponent}
        keyExtractor={(item, index) => item._id + index}
        contentContainerStyle={[styles.listContent, { paddingBottom: bottom }]}
      /> */}
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
  },
  emptyTextStyle: {
    textAlign: 'center',
    marginTop: theme.spacing.xl,
  },
  listContent: {
    flexGrow: 1,
    gap: theme.spacing.lg,
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
