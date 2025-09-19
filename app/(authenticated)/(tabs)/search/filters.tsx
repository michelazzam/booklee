import { ActivityIndicator, TouchableOpacity, StyleSheet, FlatList, View } from 'react-native';
import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { LocationServices, type LocationType, type GetLocationsReqType } from '~/src/services';

import { useAppSafeAreaInsets } from '~/src/hooks';
import { FilterIcon } from '~/src/assets/icons';
import { theme } from '~/src/constants/theme';

import { FilterModal, SearchModal, ModalWrapperRef } from '~/src/components/modals';
import { LocationCard, LocationCardSkeleton } from '~/src/components/preview';
import { FilterContainer, type FilterType } from '~/src/components/utils';
import { SearchInput } from '~/src/components/textInputs';
import { Icon, Text } from '~/src/components/base';

type LocalSearchParams = {
  filterCategory: string;
};

const Search = () => {
  /*** Refs ***/
  const searchModalRef = useRef<ModalWrapperRef>(null);
  const filterModalRef = useRef<ModalWrapperRef>(null);

  /*** Constants ***/
  const router = useRouter();
  const { top, bottom } = useAppSafeAreaInsets();
  const { filterCategory } = useLocalSearchParams<LocalSearchParams>();

  /*** States ***/
  const [selectedFilter, setSelectedFilter] = useState<GetLocationsReqType>();

  /*** API ***/
  const {
    isLoading,
    data: locationsData,
    hasNextPage: hasNextPage,
    fetchNextPage: fetchNextPage,
    isFetchingNextPage: isFetchingNextPage,
  } = LocationServices.useGetLocations(selectedFilter);
  const { data: filtersData } = LocationServices.useGetLocationsCategorized();

  useEffect(() => {
    if (filterCategory) {
      setSelectedFilter({ category: filterCategory });
    }
  }, [filterCategory]);

  /*** Memoization ***/
  const filters: FilterType[] = useMemo(() => {
    if (!filtersData || filtersData.length === 0) return [{ slug: '', label: 'All' }];

    return [
      { slug: '', label: 'All' },
      ...filtersData.map((category) => ({
        slug: category.slug,
        label: category.title,
      })),
    ];
  }, [filtersData]);
  const isFilterApplied = useMemo(() => {
    const keys = Object.keys(selectedFilter || {});

    if (keys.includes('category') && keys.length === 1) {
      return false;
    }

    return keys.length > 0;
  }, [selectedFilter]);

  const RenderEmptyComponent = useCallback(() => {
    return isLoading || isFetchingNextPage ? (
      Array.from({ length: 10 }).map((_, index) => (
        <LocationCardSkeleton key={index} minWidth={230} />
      ))
    ) : (
      <Text color={theme.colors.lightText} weight="medium" style={styles.emptyTextStyle}>
        No locations found
      </Text>
    );
  }, [isLoading, isFetchingNextPage]);
  const RenderFooter = useCallback(() => {
    if (!isFetchingNextPage) return null;

    return <ActivityIndicator color={theme.colors.primaryBlue[100]} />;
  }, [isFetchingNextPage]);
  const renderItem = useCallback(
    ({ item: category, index }: { item: LocationType; index: number }) => (
      <LocationCard
        data={category}
        delay={index * 100}
        onPress={() => router.navigate(`/(authenticated)/(screens)/location/${category._id}`)}
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
          <Icon
            size={24}
            name="arrow-left"
            onPress={() => router.back()}
            color={theme.colors.darkText[100]}
          />

          <SearchInput onPress={() => searchModalRef.current?.present()} />

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
        </View>

        <FilterContainer
          filters={filters}
          selectedFilter={selectedFilter?.category || ''}
          setSelectedFilter={(filter) => setSelectedFilter({ category: filter })}
        />
      </View>

      <FlatList
        data={locationsData}
        renderItem={renderItem}
        onEndReachedThreshold={0.5}
        onEndReached={handleEndReached}
        ListFooterComponent={RenderFooter}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={RenderEmptyComponent}
        keyExtractor={(item, index) => item._id + index}
        contentContainerStyle={[styles.listContent, { paddingBottom: bottom }]}
      />

      <SearchModal ref={searchModalRef} />

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
});
