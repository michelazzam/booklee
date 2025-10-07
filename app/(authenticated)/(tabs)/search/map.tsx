import { StyleSheet, View, TouchableOpacity } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { useRef, useMemo, useState, useEffect } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import * as Location from 'expo-location';

import { LocationServices, type GetLocationsReqType, type CategoryType } from '~/src/services';

import { useAppSafeAreaInsets, usePermissions } from '~/src/hooks';
import { FilterIcon, MapIcon } from '~/src/assets/icons';
import { theme } from '~/src/constants/theme';

import { SearchInput } from '~/src/components/textInputs';
import { Icon, Text } from '~/src/components/base';
import {
  type LocationsModalRef,
  type FilterModalRef,
  LocationsModal,
  FilterModal,
} from '~/src/components/modals';
import {
  type MarkerDataType,
  FilterContainer,
  type FilterType,
  Marker,
} from '~/src/components/utils';

/*** Beirut coordinates ***/
const INITIAL_REGION = {
  latitude: 33.8886,
  longitude: 35.4955,
  latitudeDelta: 0.1,
  longitudeDelta: 0.1,
};

const MapScreen = () => {
  /*** Refs ***/
  const mapRef = useRef<MapView>(null);
  const filterModalRef = useRef<FilterModalRef>(null);
  const locationsModalRef = useRef<LocationsModalRef>(null);

  /*** States ***/
  const [selectedFilter, setSelectedFilter] = useState<GetLocationsReqType>();

  /*** Constants ***/
  const { top } = useAppSafeAreaInsets();
  const { filterSlug } = useLocalSearchParams<{ filterSlug: string }>();
  const { locationPermission, requestLocationPermission } = usePermissions();
  const { data: filtersData } = LocationServices.useGetLocationsCategories();
  const { data: locationsData, isLoading } = LocationServices.useGetLocations(selectedFilter);

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
  const getMarkerDetails: MarkerDataType[] = useMemo(() => {
    if (!locationsData) return [];

    return locationsData
      .filter((marker) => marker.geo?.lat && marker.geo?.lng)
      .map((location) => ({
        _id: location._id,
        rating: location.rating || 0,
        latitude: location.geo?.lat || 0,
        longitude: location.geo?.lng || 0,
      }));
  }, [locationsData]);

  const handleLocationPress = async () => {
    try {
      // Check if location permission is granted
      if (locationPermission !== 'granted') {
        const granted = await requestLocationPermission();
        if (!granted) return;
      }

      // Get current location
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      // Animate map to user's location
      mapRef.current?.animateToRegion(
        {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        1000
      );
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  useEffect(() => {
    if (filterSlug) {
      setSelectedFilter((prev) => ({ ...prev, category: filterSlug }));
    }
  }, [filterSlug]);

  return (
    <View style={{ flex: 1 }}>
      <MapView
        ref={mapRef}
        showsUserLocation
        style={{ flex: 1 }}
        provider={PROVIDER_GOOGLE}
        initialRegion={INITIAL_REGION}>
        {getMarkerDetails?.map((marker, index) => (
          <Marker
            data={marker}
            key={marker._id + index}
            onPress={() => locationsModalRef.current?.present(marker._id)}
          />
        ))}
      </MapView>

      <View style={[styles.headerContainer, { top }]}>
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

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handleLocationPress}
        style={styles.locationButton}>
        <Icon size={24} name="crosshairs-gps" color={theme.colors.primaryBlue[100]} />
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.mapIconContainer}
        onPress={() => router.replace('/(authenticated)/(tabs)/search')}>
        <Text color={theme.colors.white.DEFAULT} size={theme.typography.fontSizes.xs}>
          Explore
        </Text>

        <Icon name="compass-outline" size={24} color={theme.colors.white.DEFAULT} />
      </TouchableOpacity>

      <LocationsModal
        isLoading={isLoading}
        ref={locationsModalRef}
        locations={locationsData || []}
        onLocationPress={(locationId) =>
          router.navigate(`/(authenticated)/(screens)/location/${locationId}`)
        }
      />

      <FilterModal
        ref={filterModalRef}
        onReset={() => setSelectedFilter((prev) => ({ category: prev?.category }))}
        onApply={(filters) => setSelectedFilter((prev) => ({ ...prev, ...filters }))}
      />
    </View>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  headerContainer: {
    left: 16,
    right: 16,
    position: 'absolute',
    gap: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.lg,
    justifyContent: 'space-between',
  },
  filterButton: {
    padding: theme.spacing.md,
    borderRadius: theme.radii.sm,
    backgroundColor: theme.colors.white.DEFAULT,
  },
  locationButton: {
    right: 16,
    width: 60,
    height: 60,
    bottom: 20,
    borderRadius: 30,
    position: 'absolute',
    alignItems: 'center',
    backgroundColor: '#fff',
    justifyContent: 'center',

    // iOS Shadows
    shadowRadius: 1,
    shadowOpacity: 0.1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },

    // Android Shadows
    elevation: 4,
  },
  mapIconContainer: {
    bottom: 16,
    height: 30,
    zIndex: 1000,
    alignSelf: 'center',
    flexDirection: 'row',
    position: 'absolute',
    alignItems: 'center',
    gap: theme.spacing.sm,
    borderRadius: theme.radii.lg,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.darkText[100],
  },
});
