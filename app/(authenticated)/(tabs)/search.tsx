import { ActivityIndicator, TouchableOpacity, StyleSheet, FlatList, View } from 'react-native';
import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { LocationServices, LocationType } from '~/src/services';

import { useAppSafeAreaInsets } from '~/src/hooks';
import { FilterIcon } from '~/src/assets/icons';
import { theme } from '~/src/constants/theme';

import { FilterModal, SearchModal, ModalWrapperRef } from '~/src/components/modals';
import { SearchInput } from '~/src/components/textInputs';
import { FilterContainer } from '~/src/components/utils';
import { LocationCard } from '~/src/components/preview';
import { Text } from '~/src/components/base';

const Search = () => {
  /*** Refs ***/
  const searchModalRef = useRef<ModalWrapperRef>(null);

  /*** Constants ***/
  const router = useRouter();
  const { top, bottom } = useAppSafeAreaInsets();
  const { filter } = useLocalSearchParams<{ filter?: string }>();
  const {
    data: locationsData,
    hasNextPage: hasNextPage,
    fetchNextPage: fetchNextPage,
    isFetchingNextPage: isFetchingNextPage,
  } = LocationServices.useGetLocationsCategorized();

  /*** States ***/
  const [selectedFilter, setSelectedFilter] = useState<string>(filter || '');

  useEffect(() => {
    if (filter) {
      setSelectedFilter(filter);
    }
  }, [filter]);

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
    if (!locationsData || locationsData.length === 0) return [];

    if (!selectedFilter) {
      return locationsData.flatMap((category) => category.locations);
    }

    const filteredCategory = locationsData.find((category) => category._id === selectedFilter);
    return filteredCategory ? filteredCategory.locations : [];
  }, [locationsData, selectedFilter]);

  const RenderEmptyComponent = useCallback(() => {
    return (
      <View style={styles.emptyContainer}>
        <Text color={theme.colors.darkText[100]} weight="medium">
          No salons found
        </Text>
      </View>
    );
  }, []);
  const RenderFooter = useCallback(() => {
    if (!isFetchingNextPage) return null;

    return <ActivityIndicator color={theme.colors.primaryBlue[100]} />;
  }, [isFetchingNextPage]);
  const renderItem = useCallback(
    ({ item: category, index }: { item: LocationType; index: number }) => (
      <LocationCard
        data={category}
        delay={index * 100}
        animatedStyle="slideUp"
        onPress={() => router.navigate(`/(authenticated)/(screens)/store/${category._id}`)}
      />
    ),
    [router]
  );

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <>
      <View style={[styles.headerContainer, { paddingTop: top }]}>
        <View style={styles.searchContainer}>
          <SearchInput onPress={() => searchModalRef.current?.present()} />

          <TouchableOpacity activeOpacity={0.8} style={styles.filterButton} onPress={() => {}}>
            <FilterIcon />
          </TouchableOpacity>
        </View>

        <FilterContainer
          filters={filters}
          selectedFilter={selectedFilter}
          setSelectedFilter={setSelectedFilter}
        />
      </View>

      <FlatList
        renderItem={renderItem}
        data={filteredCategories}
        onEndReachedThreshold={0.5}
        onEndReached={handleEndReached}
        keyExtractor={(item) => item._id}
        ListFooterComponent={RenderFooter}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={RenderEmptyComponent}
        contentContainerStyle={[styles.listContent, { paddingBottom: bottom }]}
      />

      {/* <FilterModal
        visible={showFilterModal}
        initialFilters={selectedFilter}
        onClose={() => setShowFilterModal(false)}
        onApply={(filters) => {
          setSelectedFilter(filters.location);
        }}
      /> */}

      <SearchModal ref={searchModalRef} />
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
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    flexGrow: 1,
    gap: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
  },
});
