import { StyleSheet, View, TouchableOpacity } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { Icon } from '~/src/components/base';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import { useRef } from 'react';

import { useAppSafeAreaInsets, usePermissions } from '~/src/hooks';
import { theme } from '~/src/constants/theme';

import { SearchInput } from '~/src/components/textInputs';

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

  /*** Constants ***/
  const { top } = useAppSafeAreaInsets();
  const { permissions, requestLocationPermission } = usePermissions();

  const handleLocationPress = async () => {
    try {
      // Check if location permission is granted
      if (permissions.location !== 'granted') {
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

  return (
    <View style={{ flex: 1 }}>
      <MapView
        ref={mapRef}
        showsUserLocation
        style={{ flex: 1 }}
        provider={PROVIDER_GOOGLE}
        initialRegion={INITIAL_REGION}
      />

      <View style={[styles.searchInputContainer, { top }]}>
        <SearchInput
          placeholder="Can't find what you're looking for?"
          containerStyle={{ backgroundColor: theme.colors.white.DEFAULT }}
          onPress={() => router.navigate('/(authenticated)/(tabs)/search/filters')}
        />
      </View>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handleLocationPress}
        style={styles.locationButton}>
        <Icon size={24} name="crosshairs-gps" color={theme.colors.primaryBlue[100]} />
      </TouchableOpacity>
    </View>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  searchInputContainer: {
    left: 16,
    right: 16,
    position: 'absolute',
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
