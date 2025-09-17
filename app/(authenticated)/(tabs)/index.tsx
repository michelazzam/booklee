import { type RelativePathString, useRouter } from 'expo-router';
import { StyleSheet, FlatList, View, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { useAppSafeAreaInsets, useLocationFilters, useInfiniteLocations } from '~/src/hooks';
import { theme } from '~/src/constants/theme';
import { type Store } from '~/src/mock'; //TODO: This needs to be removed

import { StoreCard } from '~/src/components/preview';
import { Button } from '~/src/components/buttons';
import { Text } from '~/src/components/base';

//TODO: This needs fixing
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
              data={store} //TODO: This needs fixing
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

  // Get API parameters based on current filters (home page shows fewer items per category)
  const apiParams = getApiParams({ limit: 10 }); // Reduced limit for better pagination

  // Fetch data from APIs - using infinite scroll for categories
  const {
    data: locationsData,
    isLoading: locationsLoading,
    error: locationsError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteLocations(apiParams);

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

  if (!locationsData || locationsData.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text size={theme.typography.fontSizes.md}>No stores available at the moment.</Text>
      </View>
    );
  }

  const renderHeader = () => (
    <View style={[styles.headerContainer, { paddingTop: top * 2 }]}>
      <Text weight="bold" color={theme.colors.white.DEFAULT} size={theme.typography.fontSizes.xl}>
        Hello Samir!
      </Text>

      <Text weight="medium" color={theme.colors.white.DEFAULT} size={theme.typography.fontSizes.sm}>
        What would you like to do today?
      </Text>
    </View>
  );

  const renderCategory = ({ item: category, index }: { item: any; index: number }) => {
    // Convert locations to Store format for StoreCard
    const storeData = category.locations.map((location: any) => ({
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
        data={storeData}
        title={category.title}
        categoryId={category._id}
      />
    );
  };

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;

    return (
      <View style={styles.footerContainer}>
        <Text color={theme.colors.lightText} weight="medium">
          Loading more categories...
        </Text>
      </View>
    );
  };

  const handleEndReached = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={locationsData}
        renderItem={renderCategory}
        keyExtractor={(item, index) => `category-${item._id}-${index}`}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.container, { paddingBottom: bottom }]}
        bounces={false}
      />
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
  footerContainer: {
    paddingVertical: theme.spacing.lg,
    alignItems: 'center',
  },
});
