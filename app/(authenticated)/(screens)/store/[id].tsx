import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useMemo, useState } from 'react';

import { useAppSafeAreaInsets } from '~/src/hooks';
import { theme } from '~/src/constants/theme';
import { LocationServices } from '~/src/services';

import { ImageCarousel, TabMenu } from '~/src/components/utils';
import { Services } from '~/src/components/preview';
import { Icon, Text } from '~/src/components/base';
import { Button } from '~/src/components/buttons';

const SalonDetailPage = () => {
  /***** Constants *****/
  const router = useRouter();
  const { top, bottom } = useAppSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();

  /***** States *****/
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'services' | 'about'>('services');

  /***** API *****/
  const {
    data: location,
    isLoading,
    error,
  } = LocationServices.useGetLocationById({ id: id || '', byId: true });

  /***** Memoized values *****/
  const operatingHoursText = useMemo(() => {
    if (!location?.operatingHours) return 'Hours not available';

    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const todayHours = location.operatingHours[today as keyof typeof location.operatingHours];

    if (todayHours?.closed) {
      return 'Closed today';
    }

    return `Open ${todayHours?.open} - ${todayHours?.close}`;
  }, [location?.operatingHours]);

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId) ? prev.filter((id) => id !== serviceId) : [...prev, serviceId]
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { paddingTop: top, paddingBottom: bottom }]}>
        <Text size={theme.typography.fontSizes.md}>Loading salon details...</Text>
      </View>
    );
  }

  // Error state
  if (error || !location) {
    return (
      <View style={[styles.errorContainer, { paddingTop: top, paddingBottom: bottom }]}>
        <Text size={theme.typography.fontSizes.md} color={theme.colors.red[100]}>
          Error loading salon details. Please try again.
        </Text>
        <Button title="Go Back" onPress={() => router.back()} />
      </View>
    );
  }

  const {
    photos,
    name,
    address,
    category,
    rating,
    phone,
    teamSize,
    bookable,
    price: _price,
  } = location;

  const RenderServices = () => {
    return (
      <View style={{ gap: theme.spacing.md }}>
        <Text size={theme.typography.fontSizes.md} weight={'medium'}>
          Services
        </Text>

        <View style={{ gap: theme.spacing.sm }}>
          {location.locationServices.map((service) => (
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
    return (
      <View style={{ gap: theme.spacing.md }}>
        <Text size={theme.typography.fontSizes.md} weight={'medium'}>
          About {name}
        </Text>

        <View style={{ gap: theme.spacing.sm }}>
          <View style={styles.infoRow}>
            <Text size={theme.typography.fontSizes.sm} weight={'medium'}>
              Address:
            </Text>
            <Text size={theme.typography.fontSizes.sm}>{address}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text size={theme.typography.fontSizes.sm} weight={'medium'}>
              Phone:
            </Text>
            <Text size={theme.typography.fontSizes.sm}>{phone}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text size={theme.typography.fontSizes.sm} weight={'medium'}>
              Team Size:
            </Text>
            <Text size={theme.typography.fontSizes.sm}>{teamSize} professionals</Text>
          </View>

          <View style={styles.infoRow}>
            <Text size={theme.typography.fontSizes.sm} weight={'medium'}>
              Bookable:
            </Text>
            <Text size={theme.typography.fontSizes.sm}>{bookable ? 'Yes' : 'No'}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <ScrollView
      bounces={false}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ flexGrow: 1, paddingBottom: bottom }}>
      <View>
        <View style={[styles.headerComponent, { top }]}>
          <TouchableOpacity onPress={() => router.back()}>
            <Icon size={32} name="chevron-left" color={theme.colors.white.DEFAULT} />
          </TouchableOpacity>

          <TouchableOpacity>
            <Icon name="heart-outline" size={32} color={theme.colors.white.DEFAULT} />
          </TouchableOpacity>
        </View>

        <ImageCarousel
          images={
            photos.length > 0
              ? photos
              : ['https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop']
          }
        />
      </View>

      <View style={styles.storeContentContainer}>
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

        <View style={styles.locationContainer}>
          <Text size={theme.typography.fontSizes.md}>{address}</Text>

          <View style={styles.tagContainer}>
            <Text size={theme.typography.fontSizes.xs} weight={'bold'}>
              {category.title}
            </Text>
          </View>
        </View>

        <TabMenu
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab as 'services' | 'about')}
          tabs={[
            { tabName: { name: 'Services', value: 'services' }, tabChildren: RenderServices() },
            { tabName: { name: 'About', value: 'about' }, tabChildren: RenderAbout() },
          ]}
        />

        {selectedServices.length > 0 && (
          <View style={styles.bookingContainer}>
            <Button
              title={`Book ${selectedServices.length} service${selectedServices.length > 1 ? 's' : ''}`}
              onPress={() => {
                // TODO: Implement booking flow
                console.log('Selected services:', selectedServices);
              }}
            />
          </View>
        )}
      </View>
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
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  tagContainer: {
    height: 30,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bookingContainer: {
    marginTop: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
});
