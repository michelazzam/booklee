import { StyleSheet, FlatList, View, ScrollView, ActivityIndicator } from 'react-native';
import { useCallback, useState } from 'react';
import { useRouter } from 'expo-router';

import { LocationServices, type LocationCategoryType, UserServices } from '~/src/services';

import { useAppSafeAreaInsets } from '~/src/hooks';
import { theme } from '~/src/constants/theme';

import { LocationCard, HomePageSkeleton } from '~/src/components/preview';
import { ScreenHeader } from '~/src/components/utils';
import { Button } from '~/src/components/buttons';
import { Text } from '~/src/components/base';

const HomePage = () => {
  /*** States ***/
  const [isRefetching, setIsRefetching] = useState(false);

  /*** Constants ***/
  const router = useRouter();
  const { bottom } = useAppSafeAreaInsets();
  const { data: userData } = UserServices.useGetMe();
  const {
    refetch,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    data: locationsData,
  } = LocationServices.useGetLocationsCategorized();

  const renderCategory = useCallback(
    ({ item }: { item: LocationCategoryType }) => {
      const { title, _id } = item;

      const handleSeeAllPress = () => {
        router.navigate({
          params: { filter: _id },
          pathname: '/(authenticated)/(tabs)/search',
        });
      };

      return (
        <View style={{ gap: theme.spacing.xs }}>
          <View style={styles.sectionTitle}>
            <Text
              weight="semiBold"
              color={theme.colors.darkText[100]}
              size={theme.typography.fontSizes.xl}>
              {title}
            </Text>

            <Button title="See All" variant="ghost" onPress={handleSeeAllPress} />
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.sectionContainer}>
            {item.locations.map((store, index) => (
              <LocationCard
                width={230}
                data={store}
                delay={index * 150}
                key={store._id + index}
                animatedStyle="slideLeft"
                onPress={() =>
                  router.navigate({
                    pathname: `/(authenticated)/(screens)/location/[id]`,
                    params: {
                      id: store._id,
                      image: store.photos?.[0],
                    },
                  })
                }
              />
            ))}
          </ScrollView>
        </View>
      );
    },
    [router]
  );
  const renderFooter = useCallback(() => {
    if (!isFetchingNextPage) return null;

    return <ActivityIndicator color={theme.colors.primaryBlue[100]} />;
  }, [isFetchingNextPage]);
  const RenderListEmptyComponent = useCallback(() => {
    return <HomePageSkeleton />;
  }, []);

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);
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

      <FlatList
        data={locationsData}
        onRefresh={handleRefresh}
        refreshing={isRefetching}
        renderItem={renderCategory}
        onEndReachedThreshold={0.5}
        onEndReached={handleEndReached}
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={RenderListEmptyComponent}
        keyExtractor={(item, index) => item._id + index}
        contentContainerStyle={[styles.container, { paddingBottom: bottom }]}
      />
    </>
  );
};

export default HomePage;

const styles = StyleSheet.create({
  container: {
    gap: 24,
    flexGrow: 1,
    paddingTop: theme.spacing.md,
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
