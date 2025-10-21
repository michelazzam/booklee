import { TouchableOpacity, View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Animated, { FadeIn } from 'react-native-reanimated';

import {
  type GetLocationsReqType,
  type CategoryType,
  type LocationType,
  LocationServices,
} from '~/src/services';

import { useAppSafeAreaInsets } from '~/src/hooks';
import { FilterIcon, MapIcon } from '~/src/assets/icons';
import { theme } from '~/src/constants/theme';

import { LocationCard, LocationCardSkeleton } from '~/src/components/preview';
import { FilterContainer, type FilterType } from '~/src/components/utils';
import { type FilterModalRef, FilterModal } from '~/src/components/modals';
import { SearchInput } from '~/src/components/textInputs';
import { Icon, Text } from '~/src/components/base';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);
const LocationListing = () => {
  /*** Refs ***/
  const filterModalRef = useRef<FilterModalRef>(null);

  /*** States ***/
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<GetLocationsReqType>();

  /*** Constants ***/
  const router = useRouter();
  const { top, bottom } = useAppSafeAreaInsets();
  const { filterSlug } = useLocalSearchParams<{ filterSlug: string }>();
  const { data: filtersData } = LocationServices.useGetLocationsCategories();
  const {
    data: locationsData,
    isLoading,
    refetch,
  } = LocationServices.useGetLocations(selectedFilter);

  /*** Memoization ***/
  const isFilterApplied = useMemo(() => {
    const keys = Object.keys(selectedFilter || {});

    if (keys.includes('category') && keys.length === 1) {
      return false;
    }

    return keys.length > 0;
  }, [selectedFilter]);
  const filters: FilterType[] = useMemo(() => {
    if (!filtersData || filtersData.length === 0) return [{ slug: '', label: 'All' }];

    return [
      { slug: '', label: 'All' },
      ...filtersData.map((category: CategoryType) => ({
        slug: category.slug,
        label: category.title,
      })),
    ];
  }, [filtersData]);

  useEffect(() => {
    if (filterSlug) {
      setSelectedFilter((prev) => ({ ...prev, category: filterSlug }));
    }
  }, [filterSlug]);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    refetch().finally(() => {
      setIsRefreshing(false);
    });
  }, [refetch]);

  const RenderItem = useCallback(
    ({ item }: { item: LocationType }) => (
      <LocationCard
        data={item}
        onPress={() => router.navigate(`/(authenticated)/(screens)/location/${item._id}`)}
      />
    ),
    [router]
  );
  const RenderEmptyComponent = useCallback(() => {
    if (isLoading) {
      return Array.from({ length: 10 }).map((_, index) => (
        <LocationCardSkeleton key={index} minWidth={230} />
      ));
    }

    return (
      <View style={styles.emptyStateContent}>
        <Icon name="store" size={100} color={theme.colors.primaryBlue[100]} />

        <Text
          weight="semiBold"
          color={theme.colors.darkText[100]}
          size={theme.typography.fontSizes.md}>
          No locations found
        </Text>
      </View>
    );
  }, [isLoading]);
  const RenderRefreshControl = useCallback(() => {
    return (
      <RefreshControl
        refreshing={isRefreshing}
        onRefresh={handleRefresh}
        colors={[theme.colors.primaryBlue[100]]}
        tintColor={theme.colors.primaryBlue[100]}
      />
    );
  }, [isRefreshing, handleRefresh]);

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <View style={styles.headerContainer}>
        <View style={styles.searchContainer}>
          <SearchInput
            placeholder="Store, location, or service"
            placeholderTextColor={theme.colors.lightText}
            containerStyle={{ backgroundColor: theme.colors.white.DEFAULT }}
            onPress={() => router.navigate('/(authenticated)/(tabs)/search/locationSearch')}
          />

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
          setSelectedFilter={(filter) =>
            setSelectedFilter((prev) => ({ ...prev, category: filter }))
          }
        />
      </View>

      <View style={{ flex: 1 }}>
        {!isRefreshing && (
          <AnimatedTouchable
            entering={FadeIn}
            activeOpacity={0.8}
            style={styles.mapIconContainer}
            onPress={() =>
              router.replace({
                pathname: '/(authenticated)/(tabs)/search/map',
                params: { filterSlug: selectedFilter?.category },
              })
            }>
            <Text color={theme.colors.white.DEFAULT} size={theme.typography.fontSizes.xs}>
              Map
            </Text>
            <MapIcon />
          </AnimatedTouchable>
        )}

        <FlatList
          data={locationsData}
          renderItem={RenderItem}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          refreshControl={RenderRefreshControl()}
          ListEmptyComponent={RenderEmptyComponent}
          ListHeaderComponentStyle={styles.listHeaderComponent}
          contentContainerStyle={[styles.listContent, { paddingBottom: bottom }]}
        />
      </View>

      <FilterModal
        ref={filterModalRef}
        onReset={() => setSelectedFilter((prev) => ({ category: prev?.category }))}
        onApply={(filters) => setSelectedFilter((prev) => ({ ...prev, ...filters }))}
      />
    </View>
  );
};

export default LocationListing;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
  },
  headerContainer: {
    gap: theme.spacing.lg,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.lg,
    justifyContent: 'space-between',
  },
  filterButton: {
    borderWidth: 1,
    padding: theme.spacing.md,
    borderRadius: theme.radii.sm,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.white.DEFAULT,
  },
  listContent: {
    flexGrow: 1,
    gap: theme.spacing.xl,
  },
  mapIconContainer: {
    top: 20,
    height: 32,
    zIndex: 1000,
    alignSelf: 'center',
    flexDirection: 'row',
    position: 'absolute',
    alignItems: 'center',
    gap: theme.spacing.sm,
    borderRadius: theme.radii.xl,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.darkText[100],
  },
  listHeaderComponent: {
    zIndex: 1000,
    position: 'absolute',
    alignSelf: 'center',
  },
  emptyStateContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
