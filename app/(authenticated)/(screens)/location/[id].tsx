import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';

import { LocationServices, type SelectedService } from '~/src/services';

import { useAppSafeAreaInsets } from '~/src/hooks';
import { theme } from '~/src/constants/theme';

import { ImageCarousel, TabMenu } from '~/src/components/utils';
import { Services } from '~/src/components/preview';
import { Icon, Text } from '~/src/components/base';
import { Button } from '~/src/components/buttons';

const SalonDetailPage = () => {
  /***** Constants *****/
  const router = useRouter();
  const { top, bottom } = useAppSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: location } = LocationServices.useGetLocationById(id || '');
  const { photos, name, address, category, rating, phone, teamSize, bookable, tags } =
    location || {};

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

    return `Open ${todayHours?.open} - ${todayHours?.close}`;
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

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices((prev) => {
      const updated = prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId];

      return updated;
    });
  };
  const handleBookingNext = () => {
    const servicesParam = encodeURIComponent(JSON.stringify(selectedServiceData));
    router.push(`/(authenticated)/(screens)/booking/${id}?services=${servicesParam}` as any);
  };

  const RenderServices = () => {
    return (
      <View style={{ gap: theme.spacing.md }}>
        <Text size={theme.typography.fontSizes.md} weight={'medium'}>
          {category?.title}
        </Text>

        <View style={{ gap: theme.spacing.sm }}>
          {location?.locationServices?.map((service) => (
            <Services
              data={service}
              key={service.id}
              onPress={handleServiceToggle}
              isActive={selectedServices.includes(service.id)}
            />
          ))}
        </View>
      </View>
    );
  };
  const RenderAbout = () => {
    const formatData = [
      { title: 'Address', value: address },
      { title: 'Phone', value: phone },
      { title: 'Team Size', value: `${teamSize} professionals` },
      { title: 'Bookable', value: bookable ? 'Yes' : 'No' },
    ];

    return (
      <View style={{ gap: theme.spacing.md }}>
        <Text size={theme.typography.fontSizes.md} weight={'medium'}>
          About {name}
        </Text>

        <View style={{ gap: theme.spacing.md }}>
          {formatData.map((item, index) => (
            <View style={styles.infoRow} key={index}>
              <Text size={theme.typography.fontSizes.sm} weight={'medium'}>
                {item.title}:
              </Text>

              <Text
                size={theme.typography.fontSizes.sm}
                style={{ width: '75%', textAlign: 'right' }}>
                {item.value}
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <ScrollView
      bounces={false}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ flexGrow: 1, paddingBottom: bottom * 2 }}>
      <View>
        <View style={[styles.headerComponent, { top }]}>
          <TouchableOpacity onPress={() => router.back()}>
            <Icon size={32} name="chevron-left" color={theme.colors.white.DEFAULT} />
          </TouchableOpacity>

          <TouchableOpacity>
            <Icon name="heart-outline" size={32} color={theme.colors.white.DEFAULT} />
          </TouchableOpacity>
        </View>

        <ImageCarousel images={photos || []} />
      </View>

      <View style={styles.storeContentContainer}>
        <View style={{ gap: theme.spacing.sm }}>
          <Text size={theme.typography.fontSizes.xl} weight={'bold'}>
            {name}
          </Text>

          <View style={styles.storeInfoContainer}>
            <View style={styles.ratingContainer}>
              <Icon name="star" size={16} color="#FFD700" />

              <Text
                weight={'bold'}
                size={theme.typography.fontSizes.xs}
                style={{ textDecorationLine: 'underline' }}>
                {rating}
              </Text>
            </View>

            <Text size={theme.typography.fontSizes.xs}>{operatingHoursText}</Text>
          </View>
        </View>

        <View style={{ gap: theme.spacing.sm }}>
          <Text size={theme.typography.fontSizes.md}>{address}</Text>

          {tags && tags.length > 0 && (
            <View style={styles.tagContainer}>
              <Text size={theme.typography.fontSizes.xs} weight={'bold'}>
                {tags.join(', ')}
              </Text>
            </View>
          )}
        </View>

        <TabMenu
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab as 'services' | 'about')}
          tabs={[
            { tabName: { name: 'Services', value: 'services' }, tabChildren: RenderServices() },
            { tabName: { name: 'About', value: 'about' }, tabChildren: RenderAbout() },
          ]}
        />
      </View>

      {selectedServices.length > 0 && (
        <View style={styles.bookingBar}>
          <View style={styles.bookingInfo}>
            <Text size={theme.typography.fontSizes.md} weight="bold">
              {selectedServices.length} service{selectedServices.length > 1 ? 's' : ''} selected
            </Text>
            <Text size={theme.typography.fontSizes.sm} color={theme.colors.darkText['50']}>
              Starting $
              {selectedServiceData.reduce((total, service) => {
                if (service.priceType === 'fixed') return total + service.price;
                if (service.priceType === 'starting') return total + service.price;
                return total + (service.priceMin || service.price);
              }, 0)}
            </Text>
          </View>
          <Button title="Next" onPress={handleBookingNext} />
        </View>
      )}
    </ScrollView>
  );
};

export default SalonDetailPage;

const styles = StyleSheet.create({
  headerComponent: {
    zIndex: 2,
    width: '100%',
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
  },
  storeContentContainer: {
    gap: theme.spacing.xl,
    padding: theme.spacing.lg,
  },
  storeInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  infoRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bookingBar: {
    borderTopWidth: 1,
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.md,
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.white.DEFAULT,
  },
  bookingInfo: {
    flex: 1,
    gap: theme.spacing.xs,
  },
});
