import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { useCallback, useState, useEffect, useRef } from 'react';
import * as Location from 'expo-location';

import { AppointmentServices, LocationServices, UserServices } from '~/src/services';

import { useAppSafeAreaInsets } from '~/src/hooks';
import { theme } from '~/src/constants/theme';

import { RatingModal, type RatingModalRef } from '~/src/components/modals';
import { ScreenHeader, LocationCategory } from '~/src/components/utils';
import { HomePageSkeleton } from '~/src/components/preview';
import { Text } from '~/src/components/base';

const HomePage = () => {
  /*** Refs ***/
  const ratingModalRef = useRef<RatingModalRef>(null);

  /*** States ***/
  const [isRefetching, setIsRefetching] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | undefined>(
    undefined
  );

  /*** Constants ***/
  const { bottom } = useAppSafeAreaInsets();
  const { data: userData } = UserServices.useGetMe();
  const { data: needsReviewAppointments } = AppointmentServices.useGetUserAppointmentsNeedsReview();
  const {
    refetch,
    isLoading,
    data: categories,
  } = LocationServices.useGetLocationsCategories({
    lat: userLocation?.lat,
    lng: userLocation?.lng,
  });

  useEffect(() => {
    const getUserLocation = async () => {
      try {
        // Check if location permission is granted
        const { status } = await Location.getForegroundPermissionsAsync();

        if (status === 'granted') {
          // Get the current location
          const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });

          setUserLocation({
            lat: location.coords.latitude,
            lng: location.coords.longitude,
          });
        }
      } catch (error) {
        console.error('Error getting user location:', error);
      }
    };

    getUserLocation();
  }, []);
  useEffect(() => {
    if (!needsReviewAppointments) return;

    if (needsReviewAppointments.length > 0 && categories) {
      setTimeout(() => {
        ratingModalRef.current?.present();
      }, 800);
    }
  }, [needsReviewAppointments, categories]);

  const handleRefresh = useCallback(() => {
    setIsRefetching(true);
    refetch().finally(() => {
      setIsRefetching(false);
    });
  }, [refetch]);

  const RenderRefreshControl = useCallback(() => {
    return (
      <RefreshControl
        refreshing={isRefetching}
        onRefresh={handleRefresh}
        colors={[theme.colors.primaryBlue[100]]}
        tintColor={theme.colors.primaryBlue[100]}
      />
    );
  }, [isRefetching, handleRefresh]);

  return (
    <>
      <ScreenHeader
        title={
          <View style={{ gap: theme.spacing.xs }}>
            <Text
              weight="semiBold"
              color={theme.colors.white.DEFAULT}
              size={theme.typography.fontSizes.xs}>
              Hello {`${userData?.user?.firstName || 'User'}!`}
            </Text>

            <Text
              weight="semiBold"
              color={theme.colors.white.DEFAULT}
              size={theme.typography.fontSizes.sm}>
              What would you like to do today?
            </Text>
          </View>
        }
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={RenderRefreshControl()}
        contentContainerStyle={[styles.container, { paddingBottom: bottom }]}>
        {isLoading || isRefetching ? (
          <HomePageSkeleton />
        ) : (
          categories?.map((category) => <LocationCategory key={category._id} category={category} />)
        )}
      </ScrollView>

      <RatingModal ref={ratingModalRef} appointments={needsReviewAppointments || []} />
    </>
  );
};

export default HomePage;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    gap: theme.spacing.xl,
    paddingTop: theme.spacing['2xl'],
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: theme.spacing['3xl'],
  },
  footerLoader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
