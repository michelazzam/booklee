import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useState } from 'react';
import { theme } from '~/src/constants/theme';
import { mockSalons, Salon } from '~/src/data/mockSalons';
import {
  SalonImageCarousel,
  SalonInfoSection,
  SalonTabs,
  ServicesTab,
  AboutTab,
} from '~/src/components/utils/salon/single-salon';
import SingleSalonHeader from '~/src/components/utils/salon/single-salon/SingleSalonHeader';
import { useAppSafeAreaInsets } from '~/src/hooks';

export default function SalonDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'services' | 'about'>('services');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const insets = useAppSafeAreaInsets();

  // Find salon data from all categories
  const allSalons = Object.values(mockSalons).flat();
  const salon: Salon | undefined = allSalons.find((s) => s.id === id);

  if (!salon) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Salon not found</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId) ? prev.filter((id) => id !== serviceId) : [...prev, serviceId]
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <SingleSalonHeader isFavorite={salon.isFavorite || false} />
        {/* Image Carousel */}
        <SalonImageCarousel images={salon.images || [salon.image]} />

        {/* Salon Info Section */}
        <SalonInfoSection salon={salon} />

        {/* Tabs */}
        <SalonTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Tab Content */}
        <View style={styles.tabContent}>
          {activeTab === 'services' ? (
            <ServicesTab
              serviceCategories={salon.serviceCategories || []}
              selectedServices={selectedServices}
              onServiceToggle={handleServiceToggle}
            />
          ) : (
            <AboutTab about={salon.about || ''} />
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white.DEFAULT,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  errorText: {
    ...theme.typography.textVariants.headline,
    color: theme.colors.darkText[100],
    marginBottom: theme.spacing.lg,
  },
  backButton: {
    padding: theme.spacing.sm,
  },
  backButtonText: {
    ...theme.typography.textVariants.bodyPrimaryBold,
    color: theme.colors.primaryBlue[100],
  },
  header: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    zIndex: 10,
  },
  backButtonIcon: {
    fontSize: 24,
    color: theme.colors.white.DEFAULT,
    fontWeight: 'bold',
  },
  favoriteButton: {
    width: 32,
    height: 32,
    borderRadius: theme.radii.full,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteIcon: {
    fontSize: 20,
    color: theme.colors.white.DEFAULT,
  },
  scrollView: {
    flex: 1,
  },
  tabContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing['2xl'],
  },
});
