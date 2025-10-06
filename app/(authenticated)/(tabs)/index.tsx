import { useCallback, memo, useState } from 'react';
import { useRouter } from 'expo-router';
import {
  TouchableOpacity,
  RefreshControl,
  ScrollView,
  StyleSheet,
  FlatList,
  View,
} from 'react-native';

import {
  type LocationCategoryType,
  LocationServices,
  UserServices,
  LocationType,
} from '~/src/services';

import { useAppSafeAreaInsets } from '~/src/hooks';
import { theme } from '~/src/constants/theme';

import { LocationCard, HomePageSkeleton } from '~/src/components/preview';
import { ScreenHeader } from '~/src/components/utils';
import { Text } from '~/src/components/base';

const CategorySection = memo(({ category }: { category: LocationCategoryType }) => {
  /*** Constants ***/
  const router = useRouter();

  const RenderItem = useCallback(
    ({ item }: { item: LocationType }) => {
      const handlePress = () => {
        router.navigate({
          pathname: `/(authenticated)/(screens)/location/[id]`,
          params: {
            id: item._id,
            image: item.photos?.[0],
          },
        });
      };

      return (
        <LocationCard
          width={230}
          data={item}
          duration={0}
          key={item._id}
          onPress={handlePress}
          animatedStyle="slideLeft"
        />
      );
    },
    [router]
  );
  const RenderListEmptyComponent = useCallback(() => {
    return (
      <Text
        weight="medium"
        style={styles.emptyTextStyle}
        color={theme.colors.darkText['50']}
        size={theme.typography.fontSizes.md}>
        No locations found
      </Text>
    );
  }, []);

  return (
    <View style={{ gap: theme.spacing.md }} key={category._id}>
      <View style={styles.sectionTitle}>
        <Text
          weight="medium"
          color={theme.colors.darkText[100]}
          size={theme.typography.fontSizes.sm}
          style={{ textTransform: 'uppercase', flex: 1 }}>
          {category.title}
        </Text>

        {category.locations.length > 0 && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() =>
              router.navigate({
                params: { filterSlug: category.slug },
                pathname: '/(authenticated)/(tabs)/search',
              })
            }>
            <Text
              weight="semiBold"
              color={theme.colors.darkText[100]}
              size={theme.typography.fontSizes.sm}
              style={{ textDecorationLine: 'underline' }}>
              see all
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        horizontal
        renderItem={RenderItem}
        data={category.locations}
        keyExtractor={(item) => item._id}
        showsHorizontalScrollIndicator={false}
        ListEmptyComponent={RenderListEmptyComponent}
        contentContainerStyle={styles.sectionContainer}
      />
    </View>
  );
});

const HomePage = () => {
  /*** Constants ***/
  const { bottom } = useAppSafeAreaInsets();
  const { data: userData } = UserServices.useGetMe();
  const { data: categories, isLoading, refetch } = LocationServices.useGetLocationsCategories();

  /*** States ***/
  const [isRefetching, setIsRefetching] = useState(false);

  const handleRefresh = useCallback(() => {
    setIsRefetching(true);
    refetch().finally(() => {
      setIsRefetching(false);
    });
  }, [refetch]);

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
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={handleRefresh} />}
        contentContainerStyle={[styles.container, { paddingBottom: bottom }]}>
        {isLoading || isRefetching ? (
          <HomePageSkeleton />
        ) : (
          categories?.map((category) => <CategorySection key={category._id} category={category} />)
        )}
      </ScrollView>
    </>
  );
};

export default HomePage;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    gap: theme.spacing.xl,
    paddingTop: theme.spacing.md,
  },
  sectionTitle: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
  },
  sectionContainer: {
    flexGrow: 1,
    gap: theme.spacing.xl,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.lg,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: theme.spacing['3xl'],
  },
  emptyTextStyle: {
    flex: 1,
    textAlign: 'center',
    paddingTop: theme.spacing.xl,
  },
  footerLoader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
