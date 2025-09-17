import { StyleSheet, FlatList, View, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';

import { LocationServices, type LocationCategoryType, UserServices } from '~/src/services';

import { useAppSafeAreaInsets } from '~/src/hooks';
import { theme } from '~/src/constants/theme';

import { LocationCard } from '~/src/components/preview';
import { Button } from '~/src/components/buttons';
import { Text } from '~/src/components/base';

const HomePage = () => {
  /*** Constants ***/
  const router = useRouter();
  const { top, bottom } = useAppSafeAreaInsets();
  const { data: userData } = UserServices.useGetUserMe();
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
                onPress={() => router.navigate(`/(authenticated)/(screens)/store/${store._id}`)}
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

  return (
    <>
      <View style={[styles.headerContainer, { paddingTop: top }]}>
        <Text weight="bold" color={theme.colors.white.DEFAULT} size={theme.typography.fontSizes.xl}>
          Hello {userData?.user.name}!
        </Text>

        <Text
          weight="medium"
          color={theme.colors.white.DEFAULT}
          size={theme.typography.fontSizes.sm}>
          What would you like to do today?
        </Text>
      </View>

      <FlatList
        data={locationsData}
        renderItem={renderCategory}
        onEndReachedThreshold={0.5}
        onEndReached={handleEndReached}
        keyExtractor={(item) => item._id}
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.container, { paddingBottom: bottom }]}
      />
    </>
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
