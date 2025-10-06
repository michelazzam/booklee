import { StyleSheet, FlatList, View, ScrollView } from 'react-native';
import { useCallback, memo } from 'react';
import { useRouter } from 'expo-router';

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
import { Button } from '~/src/components/buttons';
import { Text } from '~/src/components/base';

const CategorySection = memo(({ category }: { category: LocationCategoryType }) => {
  /*** Constants ***/
  const router = useRouter();

  const RenderItem = useCallback(
    ({ item }: { item: LocationType }) => {
      return (
        <LocationCard
          width={230}
          data={item}
          duration={0}
          key={item._id}
          animatedStyle="slideLeft"
          onPress={() =>
            router.navigate({
              pathname: `/(authenticated)/(screens)/location/[id]`,
              params: {
                id: item._id,
                image: item.photos?.[0],
              },
            })
          }
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
    <View style={{ gap: theme.spacing.xs }} key={category._id}>
      <View style={styles.sectionTitle}>
        <Text
          weight="semiBold"
          color={theme.colors.darkText[100]}
          size={theme.typography.fontSizes.xl}>
          {category.title}
        </Text>

        {category.locations.length > 0 && (
          <Button
            title="See All"
            variant="ghost"
            onPress={() =>
              router.navigate({
                params: { filterSlug: category.slug },
                pathname: '/(authenticated)/(tabs)/search',
              })
            }
          />
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
  const { data: categories, isLoading } = LocationServices.useGetLocationsCategories();

  return (
    <>
      <ScreenHeader
        title={
          <View style={{ gap: theme.spacing.xs }}>
            <Text
              weight="bold"
              color={theme.colors.white.DEFAULT}
              size={theme.typography.fontSizes.xl}>
              Hello {`${userData?.user?.firstName || 'User'} ${userData?.user?.lastName || ''}`}!
            </Text>

            <Text
              weight="medium"
              color={theme.colors.white.DEFAULT}
              size={theme.typography.fontSizes.sm}>
              What would you like to do today?
            </Text>
          </View>
        }
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.container, { paddingBottom: bottom }]}>
        {isLoading ? (
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
