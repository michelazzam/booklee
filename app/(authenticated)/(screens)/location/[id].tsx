import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';

import { LocationServices } from '~/src/services';

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
  const [selectedServices, setSelectedServices] = useState<string>('[]');
  const [activeTab, setActiveTab] = useState<'services' | 'about'>('services');

  // console.log('selectedServices', selectedServices);

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

  const handleServiceToggle = (serviceId: string) => {
    if (selectedServices.includes(serviceId)) {
      setSelectedServices('');
    } else {
      setSelectedServices(serviceId);
    }
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
    <>
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
      </ScrollView>

      {selectedServices.length > 0 && (
        <Animated.View
          style={[styles.bookingContainer, { bottom }]}
          entering={FadeIn}
          exiting={FadeOut}>
          <Button
            title={`Book now`}
            onPress={() => {
              // TODO: Implement booking flow
              console.log('Selected services:', selectedServices);
            }}
          />
        </Animated.View>
      )}
    </>
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
  bookingContainer: {
    left: 16,
    right: 16,
    borderTopWidth: 1,
    position: 'absolute',
    marginTop: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    borderTopColor: theme.colors.border,
  },
});
