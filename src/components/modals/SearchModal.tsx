import { forwardRef, useImperativeHandle, useRef, useCallback, useState, useMemo } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';

import { LocationServices, type SearchItemType } from '~/src/services';

import { useAppSafeAreaInsets } from '~/src/hooks';
import { theme } from '~/src/constants/theme';

import ModalWrapper, { type ModalWrapperRef } from './ModalWrapper';
import SearchHistory from '../preview/SearchHistory';
import SearchItem from '../preview/SearchItem';
import { SearchInput } from '../textInputs';
import { Icon, Text } from '../base';

const SearchModal = forwardRef<ModalWrapperRef, object>((_, ref) => {
  /*** States ***/
  const [debouncedQuery, setDebouncedQuery] = useState('');

  /*** Constants ***/
  const queryClient = useQueryClient();
  const { bottom } = useAppSafeAreaInsets();
  const modalRef = useRef<ModalWrapperRef>(null);
  const { data: searchHistory } = LocationServices.useGetSearchHistory();
  const { mutate: searchLocations, isPending: isSearching } = LocationServices.useSearchLocations();
  const { mutate: deleteSearchHistory, isPending: isDeletingSearchHistory } =
    LocationServices.useDeleteSearchHistory();

  /*** Memoization ***/
  const searchResults = useMemo(() => {
    if (!debouncedQuery) return [];

    const results = searchLocations({ query: debouncedQuery });

    return results;
  }, [searchLocations, debouncedQuery]);

  useImperativeHandle(ref, () => ({
    present: () => {
      modalRef.current?.present();
    },
    dismiss: () => {
      modalRef.current?.dismiss();
    },
  }));

  const RenderSearchResult = useCallback(
    ({ item }: { item: SearchItemType }) => <SearchItem data={item} />,
    []
  );
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
            <Text
              weight="medium"
              color={theme.colors.lightText}
              onPress={() => deleteSearchHistory()}>
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
              onPress={() => setDebouncedQuery(history.query)}
            />
          ))}
        </View>
      </View>
    );
  }, [searchHistory, deleteSearchHistory, setDebouncedQuery]);
  const RenderSearchEmpty = useCallback(() => {
    if (isSearching) {
      return (
        <Text color={theme.colors.lightText} weight="medium">
          Searching...
        </Text>
      );
    }

    if (debouncedQuery.length >= 2) {
      return (
        <Text color={theme.colors.lightText} weight="medium">
          No results found for &quot;{debouncedQuery}&quot;
        </Text>
      );
    }

    return (
      <View>
        <RenderRecentSearches />
      </View>
    );
  }, [debouncedQuery, isSearching, RenderRecentSearches]);

  const handleClose = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ['searchLocations'] });
    await queryClient.invalidateQueries({ queryKey: ['searchHistory'] });

    setDebouncedQuery('');
    modalRef.current?.dismiss();
  }, [queryClient]);
  const handleSearch = useCallback((query: string) => {
    setDebouncedQuery(query);
  }, []);

  return (
    <ModalWrapper
      ref={modalRef}
      snapPoints={['90%']}
      onDismiss={handleClose}
      contentContainerStyle={[styles.container, { paddingBottom: bottom }]}>
      <View style={styles.searchInputContainer}>
        <Icon
          size={24}
          name="arrow-left"
          onPress={handleClose}
          color={theme.colors.darkText[100]}
        />

        <SearchInput
          autoFocus
          value={debouncedQuery}
          onSearch={handleSearch}
          placeholder="Store, location, or service"
        />
      </View>

      <FlatList
        scrollEnabled={false}
        data={searchResults || []}
        renderItem={RenderSearchResult}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={RenderSearchEmpty}
      />
    </ModalWrapper>
  );
});

SearchModal.displayName = 'SearchModal';

export default SearchModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: theme.spacing.xl,
    paddingTop: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.white.DEFAULT,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
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
