import { type RelativePathString, useRouter } from 'expo-router';
import { StyleSheet, ScrollView, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { type Store } from '~/src/mock';
import { useAppSafeAreaInsets, useLocationFilters } from '~/src/hooks';
import { theme } from '~/src/constants/theme';

import { StoreCard } from '~/src/components/preview';
import { Button } from '~/src/components/buttons';
import { Text } from '~/src/components/base';
import { LocationServices } from '~/src/services';
// import { mapLocationToStore, groupLocationsByCategory } from '~/src/utils';

type SectionProps = {
  title: string;
  data: Store[];
  index?: number;
  categoryId: string;
};
const SectionCategory = ({ title, data, index = 0, categoryId }: SectionProps) => {
  /*** Constants ***/
  const router = useRouter();

  const handleSeeAllPress = () => {
    router.navigate({
      params: { filter: categoryId },
      pathname: '/(authenticated)/(tabs)/search',
    });
  };

  return (
    <>
      <StatusBar style="light" />

      <View style={{ gap: theme.spacing.xs }}>
        <View style={styles.sectionTitle}>
          <Text
            weight="medium"
            color={theme.colors.darkText[100]}
            size={theme.typography.fontSizes.md}>
            {title}
          </Text>

          <Button title="See All" variant="ghost" onPress={handleSeeAllPress} />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.sectionContainer}>
          {data.map((store, dataIndex) => (
            <StoreCard
              data={store}
              key={store.id}
              animatedStyle="slideLeft"
              delay={dataIndex * 150 + index * 150}
              onPress={() =>
                router.navigate(
                  `/(authenticated)/(screens)/store/${store.id}` as RelativePathString
                )
              }
            />
          ))}
        </ScrollView>
      </View>
    </>
  );
};

const HomePage = () => {
  /*** Constants ***/
  const { top, bottom } = useAppSafeAreaInsets();

  // Use the location filters hook
  const { getApiParams } = useLocationFilters();

  // Get API parameters based on current filters (home page shows fewer items)
  const apiParams = getApiParams({ limit: 20 });

  // Fetch data from APIs - using grouped categories with filters
  const {
    data: locationsData,
    isLoading: locationsLoading,
    error: locationsError,
  } = LocationServices.useGetLocationsByCategories(apiParams);

  const isLoading = locationsLoading;
  const hasError = locationsError;

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text size={theme.typography.fontSizes.md}>Loading...</Text>
      </View>
    );
  }

  if (hasError) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text size={theme.typography.fontSizes.md} color={theme.colors.red[100]}>
          Error loading data. Please try again.
        </Text>
      </View>
    );
  }

  // If no data is available, show a message
  if (!locationsData?.categories || locationsData.categories.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text size={theme.typography.fontSizes.md}>No stores available at the moment.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.container, { paddingBottom: bottom }]}>
        <View style={[styles.headerContainer, { paddingTop: top * 2 }]}>
          <Text
            weight="bold"
            color={theme.colors.white.DEFAULT}
            size={theme.typography.fontSizes.xl}>
            Hello Samir!
          </Text>

          <Text
            weight="medium"
            color={theme.colors.white.DEFAULT}
            size={theme.typography.fontSizes.sm}>
            What would you like to do today?
          </Text>
        </View>

        {locationsData.categories.map((category, index) => {
          // Convert locations to Store format for StoreCard
          const storeData = category.locations.map((location) => ({
            id: location._id,
            tag: category.title,
            name: location.name,
            city: location.city || 'Unknown',
            image:
              location.logo ||
              'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop',
            rating: 4.5, // Default rating
            about: 'Services available',
            openingHours: 'Hours not available',
            isFavorite: false,
          }));

          return (
            <SectionCategory
              index={index}
              key={category._id}
              data={storeData}
              title={category.title}
              categoryId={category._id}
            />
          );
        })}
      </ScrollView>
    </View>
  );
};

export default HomePage;

const styles = StyleSheet.create({
  headerContainer: {
    gap: theme.spacing.xs,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.primaryBlue[100],
  },
  container: {
    gap: 24,
    flexGrow: 1,
  },
  sectionTitle: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
  },
  sectionContainer: {
    gap: theme.spacing.xl,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.lg,
  },
});
