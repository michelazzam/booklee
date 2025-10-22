import { View, ScrollView, StyleSheet, Linking, TouchableOpacity } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';

import {
  type LocationOperatingHoursType,
  type LocationServiceType,
  type SelectedService,
  LocationServices,
} from '~/src/services';

import { useAppSafeAreaInsets, useHandleFavorites } from '~/src/hooks';
import { theme } from '~/src/constants/theme';
import { BackIcon, HeartIcon, HeartIconFilled, StarIcon } from '~/src/assets/icons';

import { ImageCarousel, TabMenu, LocationSplashImage } from '~/src/components/utils';
import { Icon, Text, HeaderNavigation } from '~/src/components/base';
import { Services } from '~/src/components/preview';
import { Button } from '~/src/components/buttons';

type SalonDetailPageProps = {
  id: string;
  image: string;
};
type AboutItemData = {
  title: string;
  onPress?: () => void;
  value: string | LocationOperatingHoursType;
};

const SalonDetailPage = () => {
  /***** Constants *****/
  const router = useRouter();
  const { top, bottom } = useAppSafeAreaInsets();
  const { id, image } = useLocalSearchParams<SalonDetailPageProps>();
  const { isInFavorites, handleToggleFavorites } = useHandleFavorites(id);
  const { data: location, isLoading, isFetched } = LocationServices.useGetLocationById(id || '');
  const { photos, name, address, rating, phone, tags, operatingHours, geo } = location || {};

  /***** States *****/
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'services' | 'about'>('services');

  /***** Memoized values *****/
  const operatingHoursText = useMemo(() => {
    if (!location?.operatingHours) return 'Hours not available';

    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const todayHours = location.operatingHours[today as keyof typeof location.operatingHours];

    if (todayHours?.closed) {
      return 'Closed today';
    }

    return `OPENS ${todayHours?.open} - ${todayHours?.close}`;
  }, [location]);
  const selectedServiceData = useMemo((): SelectedService[] => {
    if (!location?.locationServices) return [];

    return location.locationServices
      .filter((service) => selectedServices.includes(service.id))
      .map((service) => ({
        id: service.id,
        name: service.service.name,
        priceMin: service.price.min,
        priceMax: service.price.max,
        duration: parseInt(service.duration, 10),
        price: service.price.value || service.price.min || 0,
        priceType: service.price.type as 'fixed' | 'range' | 'starting',
      }));
  }, [location, selectedServices]);

  const handleServiceToggle = useCallback(
    (serviceId: string) => {
      if (selectedServices.includes(serviceId)) {
        setSelectedServices((prev) => prev.filter((id) => id !== serviceId));
      } else {
        setSelectedServices((prev) => [...prev, serviceId]);
      }
    },
    [selectedServices]
  );
  const handleBookingNext = useCallback(() => {
    router.navigate({
      pathname: '/(authenticated)/(screens)/booking/[locationId]',
      params: {
        locationId: id,
        services: JSON.stringify(selectedServiceData),
      },
    });
  }, [id, router, selectedServiceData]);

  const RenderServices = useCallback(() => {
    if (!location?.locationServices) return null;

    const groupedServices = location.locationServices.reduce(
      (acc, locationService) => {
        if (!locationService.service) return acc;

        const categoryId = locationService.service.categoryId;
        if (!acc[categoryId]) {
          acc[categoryId] = {
            categoryName: locationService.service.category,
            services: [],
          };
        }
        acc[categoryId].services.push(locationService);
        return acc;
      },
      {} as Record<string, { categoryName: string; services: LocationServiceType[] }>
    );

    return (
      <View style={{ gap: theme.spacing.lg }}>
        {Object.entries(groupedServices).map(([categoryId, { categoryName, services }]) => (
          <View key={categoryId} style={{ gap: theme.spacing.md }}>
            <Text
              weight={'medium'}
              size={theme.typography.fontSizes.sm}
              style={{ textTransform: 'uppercase' }}>
              {categoryName}
            </Text>

            <View style={{ gap: theme.spacing.sm }}>
              {services.map((locationService) => (
                <Services
                  data={locationService}
                  key={locationService.id}
                  onPress={handleServiceToggle}
                  isActive={selectedServices.includes(locationService.id)}
                />
              ))}
            </View>
          </View>
        ))}
      </View>
    );
  }, [location?.locationServices, handleServiceToggle, selectedServices]);
  const RenderAbout = useCallback(() => {
    let aboutItemData: AboutItemData[] = [];

    if (phone) {
      aboutItemData.push({
        title: 'CONTACT',
        value: phone || '',
        onPress: () => {
          Linking.openURL(`tel:${phone}`);
        },
      });
    }

    if (address) {
      aboutItemData.push({
        title: 'DIRECTIONS',
        value: address || '',
        onPress: () => {
          Linking.openURL(
            `https://www.google.com/maps/dir/?api=1&destination=${geo?.lat},${geo?.lng}`
          );
        },
      });
    }

    if (operatingHours) {
      aboutItemData.push({
        title: 'OPENING HOURS',
        value: operatingHours || {},
      });
    }

    return aboutItemData.map(({ title, value, onPress }, index) => (
      <View
        key={title}
        style={[
          styles.aboutItemContainer,
          {
            paddingTop: index !== 0 ? theme.spacing.xl : 0,
            borderBottomWidth: index === aboutItemData.length - 1 ? 0 : 1,
          },
        ]}>
        <Text size={theme.typography.fontSizes.md} weight={'medium'}>
          {title}
        </Text>

        {typeof value === 'string' && (
          <Text
            key={value}
            onPress={onPress}
            weight={'semiBold'}
            size={theme.typography.fontSizes.sm}
            style={{ textDecorationLine: 'underline' }}
            color={onPress ? theme.colors.primaryBlue[100] : theme.colors.darkText[100]}>
            {value}
          </Text>
        )}

        {typeof value === 'object' &&
          Object.entries(value).map(([key, dayHours]) => (
            <View key={key} style={styles.operatingHoursContainer}>
              <Text
                weight={'semiBold'}
                size={theme.typography.fontSizes.sm}
                style={{ textTransform: 'capitalize' }}>
                {key}
              </Text>

              <Text size={theme.typography.fontSizes.sm}>
                {dayHours.closed ? 'Closed' : `${dayHours.open} - ${dayHours.close}`}
              </Text>
            </View>
          ))}
      </View>
    ));
  }, [phone, address, geo?.lat, geo?.lng, operatingHours]);

  /***** Memoization *****/
  const TabItems = useMemo(() => {
    return !!location?.locationServices.length
      ? [
          { tabName: { name: 'Services', value: 'services' }, tabChildren: RenderServices() },
          { tabName: { name: 'About', value: 'about' }, tabChildren: RenderAbout() },
        ]
      : [{ tabName: { name: 'About', value: 'about' }, tabChildren: RenderAbout() }];
  }, [RenderServices, RenderAbout, location?.locationServices]);

  if (!location && isFetched) {
    return (
      <>
        <HeaderNavigation title="Oh no!" />

        <View style={styles.emptyScreenContainer}>
          <Icon name="store" size={100} color={theme.colors.primaryBlue[100]} />

          <Text
            weight="semiBold"
            color={theme.colors.darkText[100]}
            size={theme.typography.fontSizes.md}>
            Location not found
          </Text>
        </View>
      </>
    );
  }

  return (
    <>
      {!location && <LocationSplashImage imageUri={image} isLoading={isLoading} />}

      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: bottom }}>
        <View style={[styles.headerComponent, { paddingTop: top }]}>
          <TouchableOpacity activeOpacity={0.8} onPress={() => router.back()}>
            <BackIcon width={28} height={28} color={theme.colors.white.DEFAULT} />
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.8} onPress={handleToggleFavorites}>
            {isInFavorites ? (
              <HeartIconFilled width={28} height={28} color={theme.colors.white.DEFAULT} />
            ) : (
              <HeartIcon width={28} height={28} color={theme.colors.darkText[100]} />
            )}
          </TouchableOpacity>
        </View>

        <ImageCarousel images={photos || []} />

        <View style={styles.storeContentContainer}>
          <View style={{ gap: theme.spacing.sm }}>
            <Text size={theme.typography.fontSizes['2xl']} weight={'semiBold'}>
              {name}
            </Text>

            <View style={styles.storeInfoContainer}>
              {rating && (
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.ratingContainer}
                  onPress={() => {
                    router.navigate({
                      params: { id },
                      pathname: '/(authenticated)/(screens)/location/reviews',
                    });
                  }}>
                  <StarIcon width={18} height={18} />

                  <Text
                    weight={'bold'}
                    size={theme.typography.fontSizes.xs}
                    style={{ textDecorationLine: 'underline' }}>
                    {rating}
                  </Text>
                </TouchableOpacity>
              )}

              {operatingHoursText && (
                <Text size={theme.typography.fontSizes.xs}>{operatingHoursText}</Text>
              )}
            </View>
          </View>

          <View style={{ gap: theme.spacing.sm }}>
            {address && <Text size={theme.typography.fontSizes.sm}>{address}</Text>}

            {tags && tags.length > 0 && (
              <View style={styles.tagContainer}>
                <Text size={theme.typography.fontSizes.xs} weight={'bold'}>
                  {tags.join(', ')}
                </Text>
              </View>
            )}
          </View>

          <TabMenu
            tabs={TabItems}
            activeTab={activeTab}
            onTabChange={(tab) => setActiveTab(tab as 'services' | 'about')}
          />
        </View>
      </ScrollView>

      {selectedServices.length > 0 && (
        <Animated.View
          exiting={FadeOut}
          entering={FadeIn}
          style={[styles.bookingBar, { bottom: bottom }]}>
          <View style={styles.bookingInfo}>
            <Text size={theme.typography.fontSizes.xs} weight="bold">
              Starting $
              {selectedServiceData.reduce((total, service) => {
                if (service.priceType === 'fixed') return total + service.price;
                if (service.priceType === 'starting') return total + service.price;
                return total + (service.priceMin || service.price);
              }, 0)}
            </Text>

            <Text size={theme.typography.fontSizes.xs} color={theme.colors.darkText['50']}>
              {selectedServices.length} service{selectedServices.length > 1 ? 's' : ''} selected
            </Text>
          </View>

          <Button title="Next" onPress={handleBookingNext} width={180} />
        </Animated.View>
      )}
    </>
  );
};

export default SalonDetailPage;

const styles = StyleSheet.create({
  headerComponent: {
    top: 0,
    left: 0,
    right: 0,
    height: 62,
    zIndex: 1000,
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
  },
  storeContentContainer: {
    gap: theme.spacing.sm,
    padding: theme.spacing.lg,
  },
  storeInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  ratingContainer: {
    flexDirection: 'row',
    gap: theme.spacing.xs,
  },
  tagContainer: {
    height: 30,
    alignSelf: 'flex-start',
    justifyContent: 'center',
    borderRadius: theme.radii.xs,
    paddingHorizontal: theme.spacing.sm,
    backgroundColor: theme.colors.primaryBlue[50],
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    gap: theme.spacing.md,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  infoRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bookingBar: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.md,
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.xl,
    backgroundColor: theme.colors.white.DEFAULT,
  },
  bookingInfo: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  aboutItemContainer: {
    gap: theme.spacing.md,
    alignItems: 'flex-start',
    paddingVertical: theme.spacing.xl,
    borderBottomColor: theme.colors.lightText + '50',
  },
  operatingHoursContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  emptyScreenContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
});
