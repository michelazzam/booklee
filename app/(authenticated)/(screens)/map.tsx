import { useLocalSearchParams, useRouter } from 'expo-router';
import MapView, { Marker, PROVIDER_GOOGLE, Callout } from 'react-native-maps';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { theme } from '~/src/constants/theme';
import { useAppSafeAreaInsets, useDebouncing, useLocationFilters } from '~/src/hooks';
import { FilterModal, SearchModal } from '~/src/components/modals';
import { StoreCard } from '~/src/components/preview';
import { Icon, Text } from '~/src/components/base';
import { Location, LocationServices } from '~/src/services';

type MapParams = {
  focusId?: string;
};

const DEFAULT_REGION = {
  latitude: 33.8886, // Beirut as a generic default
  longitude: 35.4955,
  latitudeDelta: 0.2,
  longitudeDelta: 0.2,
};

export default function LocationsMapScreen() {
  /*** Navigation & layout ***/
  const router = useRouter();
  const { bottom, top } = useAppSafeAreaInsets();
  const { focusId } = useLocalSearchParams<MapParams>();

  /*** Filters/Search state ***/
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('');
  const debouncedSearchQuery = useDebouncing(searchQuery, 150);
  const { appliedFilters, setAppliedFilters, getApiParams } = useLocationFilters();

  /*** API params and data ***/
  const apiParams = useMemo(() => {
    const params = getApiParams({ limit: 50, categories: false, defaults: 'full' });
    if (debouncedSearchQuery.trim()) params.title = debouncedSearchQuery.trim();
    return params;
  }, [getApiParams, debouncedSearchQuery]);

  const { data: locations = [] } = LocationServices.useGetAllLocations(apiParams);

  /*** Derived values ***/
  const allLocations: Location[] = useMemo(() => locations, [locations]);

  const filters = useMemo(() => {
    if (!allLocations || allLocations.length === 0) return [{ id: '', label: 'All' }];
    const map = new Map<string, string>();
    allLocations.forEach((l) => {
      if (l?.category?._id && l?.category?.title) {
        map.set(l.category._id, l.category.title);
      }
    });
    return [
      { id: '', label: 'All' },
      ...Array.from(map.entries()).map(([id, title]) => ({ id, label: title })),
    ];
  }, [allLocations]);

  const filteredLocations = useMemo(() => {
    if (!selectedFilter) return allLocations;
    return allLocations.filter((l) => l.category?._id === selectedFilter);
  }, [allLocations, selectedFilter]);

  /*** Map/Sheet refs ***/
  const mapRef = useRef<MapView | null>(null);
  const sheetRef = useRef<BottomSheet | null>(null);

  /*** Selection ***/
  const [selected, setSelected] = useState<Location | null>(null);

  const initialRegion = useMemo(() => {
    const base = selected || allLocations[0];
    if (base?.geo) {
      return {
        latitude: base.geo.lat,
        longitude: base.geo.lng,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };
    }
    return DEFAULT_REGION;
  }, [selected, allLocations]);

  const handleMarkerPress = useCallback((loc: Location) => {
    setSelected(loc);
    sheetRef.current?.expand?.();
  }, []);

  const focusOnId = useMemo(() => focusId, [focusId]);

  // Auto-focus on a salon when navigated with focusId
  const focusLocation = useMemo(
    () => allLocations.find((l) => l._id === focusOnId),
    [allLocations, focusOnId]
  );

  const onMapReady = useCallback(() => {
    if (focusLocation?.geo && mapRef.current) {
      const { lat, lng } = focusLocation.geo;
      mapRef.current.animateToRegion(
        { latitude: lat, longitude: lng, latitudeDelta: 0.05, longitudeDelta: 0.05 },
        600
      );
      setSelected(focusLocation);
      setTimeout(() => sheetRef.current?.expand?.(), 300);
    }
  }, [focusLocation]);

  return (
    <View style={{ flex: 1 }}>
      <MapView
        ref={mapRef}
        onMapReady={onMapReady}
        provider={PROVIDER_GOOGLE}
        style={StyleSheet.absoluteFill}
        initialRegion={initialRegion}>
        {filteredLocations.map((loc) => (
          <BlinkFreeMarker key={loc._id} loc={loc} onPress={() => handleMarkerPress(loc)} />
        ))}
      </MapView>

      <View style={[styles.header, { paddingTop: top }]}>
        <View style={styles.searchRow}>
          <TouchableOpacity
            style={[styles.searchButton, searchQuery && styles.searchButtonActive]}
            onPress={() => setShowSearchModal(true)}
            activeOpacity={0.8}>
            <View style={styles.searchButtonContent}>
              <Icon
                name="magnify"
                color={searchQuery ? theme.colors.primaryBlue[100] : theme.colors.lightText}
              />
              <Text
                style={styles.searchButtonText}
                color={searchQuery ? theme.colors.darkText[100] : theme.colors.lightText}>
                {searchQuery ? `"${searchQuery}"` : 'Store, location, or service'}
              </Text>
              {searchQuery ? (
                <Icon
                  name="close"
                  size={18}
                  color={theme.colors.lightText}
                  onPress={() => setSearchQuery('')}
                />
              ) : null}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.filterButton}
            onPress={() => setShowFilterModal(true)}>
            <Icon name="tune-variant" />
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

      <BottomSheet ref={sheetRef} snapPoints={[120, '55%']} enablePanDownToClose index={-1}>
        <BottomSheetScrollView contentContainerStyle={{ paddingBottom: bottom }}>
          {selected ? (
            <View style={{ paddingHorizontal: theme.spacing.lg }}>
              <StoreCard
                data={selected}
                animatedStyle="none"
                onPress={() => router.push(`/(authenticated)/(screens)/store/${selected._id}`)}
              />
            </View>
          ) : (
            <View style={styles.sheetEmpty}>
              <Text color={theme.colors.lightText}>Tap a pin to preview a salon</Text>
            </View>
          )}
        </BottomSheetScrollView>
      </BottomSheet>

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
        onSearch={(q) => setSearchQuery(q)}
        initialQuery={searchQuery}
      />

      <StatusBar style="dark" />
    </View>
  );
}

const BlinkFreeMarker = React.memo(function BlinkFreeMarker({
  loc,
  onPress,
}: {
  loc: Location;
  onPress: () => void;
}) {
  const [tracks, setTracks] = useState(true);

  const handleLayout = useCallback(() => {
    requestAnimationFrame(() => setTimeout(() => setTracks(false), 50));
  }, []);

  return (
    <Marker
      coordinate={{ latitude: loc.geo.lat, longitude: loc.geo.lng }}
      onPress={onPress}
      anchor={{ x: 0.5, y: 1 }}
      tracksViewChanges={tracks}>
      <View style={styles.pinContainer} onLayout={handleLayout}>
        <View style={styles.pinBubble}>
          <Text style={styles.pinText}>{Number(loc.rating ?? 0).toFixed(1)}</Text>
        </View>
        <View style={styles.pinTail} />
      </View>
      <Callout tooltip>
        <View style={styles.callout}>
          <Text>{loc.name}</Text>
        </View>
      </Callout>
    </Marker>
  );
});

const styles = StyleSheet.create({
  header: {
    gap: theme.spacing.lg,
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
  },
  searchRow: {
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
  filterButton: {
    borderWidth: 1,
    padding: theme.spacing.md,
    borderRadius: theme.radii.sm,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.white.DEFAULT,
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
  pinContainer: {
    alignItems: 'center',
  },
  pinBubble: {
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 14,
  },
  pinText: {
    color: '#fff',
    fontWeight: '600',
  },
  pinTail: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#1a1a1a',
    alignSelf: 'center',
  },
  callout: {
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 8,
  },
  sheetEmpty: {
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
});
