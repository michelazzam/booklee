import { StyleSheet, View, TouchableOpacity } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { useRef, useMemo, useState } from 'react';
import { Icon } from '~/src/components/base';
import * as Location from 'expo-location';
import { router } from 'expo-router';

import { LocationServices, type GetLocationsReqType } from '~/src/services';

import { useAppSafeAreaInsets, usePermissions } from '~/src/hooks';
import { theme } from '~/src/constants/theme';

import { type LocationModalRef, LocationModal } from '~/src/components/modals';
import { SearchInput } from '~/src/components/textInputs';
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
  const locationModalRef = useRef<LocationModalRef>(null);

  /*** States ***/
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<GetLocationsReqType>();

  /*** Constants ***/
  const { top } = useAppSafeAreaInsets();
  const { locationPermission, requestLocationPermission } = usePermissions();
  const { data: filtersData } = LocationServices.useGetLocationsCategorized();
  const { data: locationsData } = LocationServices.useGetLocations(selectedFilter);

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
  const handleMarkerPress = (_id: string) => {
    if (selectedMarker === _id) {
      setSelectedMarker(null);
      locationModalRef.current?.dismiss();
    } else {
      setSelectedMarker(_id);
      locationModalRef.current?.present(_id);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <MapView
        ref={mapRef}
        showsUserLocation
        style={{ flex: 1 }}
        provider={PROVIDER_GOOGLE}
        initialRegion={INITIAL_REGION}>
        {getMarkerDetails?.map((marker, index) => (
          <Marker data={marker} key={marker._id + index} onPress={handleMarkerPress} />
        ))}
      </MapView>

      <View style={[styles.headerContainer, { top }]}>
        <SearchInput
          placeholder="Search for a location"
          containerStyle={{ backgroundColor: theme.colors.white.DEFAULT }}
          onPress={() => router.navigate('/(authenticated)/(tabs)/search/locationSearch')}
        />

        <FilterContainer
          filters={filters}
          selectedFilter={selectedFilter?.category || ''}
          setSelectedFilter={(filter) => setSelectedFilter({ ...selectedFilter, category: filter })}
        />
      </View>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handleLocationPress}
        style={styles.locationButton}>
        <Icon size={24} name="crosshairs-gps" color={theme.colors.primaryBlue[100]} />
      </TouchableOpacity>

      <LocationModal ref={locationModalRef} onDismiss={() => setSelectedMarker(null)} />
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
  locationButton: {
    right: 16,
    width: 60,
    height: 60,
    bottom: 100,
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
});
