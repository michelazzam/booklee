import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useMemo, useState } from 'react';

import { hairAndStyling, nails, barber, eyebrowsEyelashes } from '~/src/mock';
import { useAppSafeAreaInsets } from '~/src/hooks';
import { theme } from '~/src/constants/theme';

import { ImageCarousel, TabMenu } from '~/src/components/utils';
import { Services } from '~/src/components/preview';
import { Icon, Text } from '~/src/components/base';

const SalonDetailPage = () => {
  /***** Constants *****/
  const router = useRouter();
  const { top, bottom } = useAppSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();

  /***** States *****/
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'services' | 'about'>('services');

  /***** Memoization *****/
  const store = useMemo(() => {
    return [...hairAndStyling, ...nails, ...barber, ...eyebrowsEyelashes].find((s) => s.id === id);
  }, [id]);

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId) ? prev.filter((id) => id !== serviceId) : [...prev, serviceId]
    );
  };

  const RenderServices = () => {
    return (
      <View style={{ gap: theme.spacing.md }}>
        <Text size={theme.typography.fontSizes.md} weight={'medium'}>
          {store?.serviceCategories?.name}
        </Text>

        <View style={{ gap: theme.spacing.sm }}>
          {store?.serviceCategories?.services.map((data) => (
            <Services
              data={data}
              key={data.id}
              onPress={handleServiceToggle}
              isActive={selectedServices.includes(data.id)}
            />
          ))}
        </View>
      </View>
    );
  };
  const RenderAbout = () => {
    return (
      <Text size={theme.typography.fontSizes.md} weight={'medium'}>
        {store?.about}
      </Text>
    );
  };

  return (
    <ScrollView
      bounces={false}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ flexGrow: 1, paddingBottom: bottom }}>
      <View>
        <View style={[styles.headerComponent, { top }]}>
          <Icon
            size={32}
            name="chevron-left"
            onPress={() => router.back()}
            color={theme.colors.white.DEFAULT}
          />

          <Icon name="heart-outline" size={32} color={theme.colors.white.DEFAULT} />
        </View>

        <ImageCarousel images={store?.images || []} />
      </View>

      <View style={styles.storeContentContainer}>
        <Text size={theme.typography.fontSizes.xl} weight={'bold'}>
          {store?.name}
        </Text>

        <View style={styles.storeInfoContainer}>
          <View style={styles.ratingContainer}>
            <Icon name="star" size={16} color="#000000" />

            <Text
              weight={'bold'}
              size={theme.typography.fontSizes.xs}
              style={{ textDecorationLine: 'underline' }}>
              {store?.rating}
            </Text>
          </View>

          <Text size={theme.typography.fontSizes.xs}>{store?.openingHours}</Text>
        </View>

        <View style={styles.locationContainer}>
          <Text size={theme.typography.fontSizes.md}>{store?.provider}</Text>

          <View style={styles.tagContainer}>
            <Text size={theme.typography.fontSizes.xs} weight={'bold'}>
              {store?.tag}
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
});
