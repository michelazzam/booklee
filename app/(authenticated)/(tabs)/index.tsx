import { StyleSheet, FlatList, View, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';

import { LocationServices, type LocationCategoryType, UserServices } from '~/src/services';

import { useAppSafeAreaInsets } from '~/src/hooks';
import { theme } from '~/src/constants/theme';

import { LocationCard, HomePageSkeleton } from '~/src/components/preview';
import { ScreenHeader } from '~/src/components/utils';
import { Button } from '~/src/components/buttons';
import { Text } from '~/src/components/base';

const HomePage = () => {
  /*** Constants ***/
  const router = useRouter();
  const { bottom } = useAppSafeAreaInsets();
  const { data: userData } = UserServices.useGetMe();
  const {
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
                data={store}
                key={store._id}
                delay={index * 150}
                animatedStyle="slideLeft"
                onPress={() => router.navigate(`/(authenticated)/(screens)/location/${store._id}`)}
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
  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);
  const RenderListEmptyComponent = useCallback(() => {
    return <HomePageSkeleton />;
  }, []);

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
