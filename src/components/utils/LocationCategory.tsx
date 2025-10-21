import { View, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';

import { theme } from '~/src/constants';

import type { LocationCategoryType, LocationType } from '~/src/services';
import { LocationCard } from '../preview';
import { Text } from '../base';

const LocationCategory = ({ category }: { category: LocationCategoryType }) => {
  /*** Constants ***/
  const router = useRouter();

  const handlePress = useCallback(
    (item: LocationType) => {
      router.navigate({
        pathname: `/(authenticated)/(screens)/location/[id]`,
        params: {
          id: item._id,
          image: item.photos?.[0],
        },
      });
    },
    [router]
  );
  const handleSeeAllPress = useCallback(() => {
    router.navigate({
      pathname: '/(authenticated)/(tabs)/search',
      params: { filterSlug: category.slug },
    });
  }, [router, category]);

  const RenderItem = useCallback(
    ({ item }: { item: LocationType }) => {
      return (
        <LocationCard
          delay={0}
          width={200}
          data={item}
          duration={200}
          key={item._id}
          animatedStyle="fadeIn"
          onPress={() => handlePress(item)}
        />
      );
    },
    [handlePress]
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
            onPress={handleSeeAllPress}
            disabled={category.locations.length <= 1}>
            <Text
              weight="semiBold"
              color={theme.colors.darkText[100]}
              size={theme.typography.fontSizes.sm}
              style={{
                textDecorationLine: 'underline',
                opacity: category.locations.length > 1 ? 1 : 0.5,
              }}>
              see all
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        horizontal
        windowSize={5}
        removeClippedSubviews
        initialNumToRender={2}
        renderItem={RenderItem}
        maxToRenderPerBatch={3}
        data={category.locations}
        keyExtractor={(item) => item._id}
        showsHorizontalScrollIndicator={false}
        ListEmptyComponent={RenderListEmptyComponent}
        contentContainerStyle={styles.sectionContainer}
        getItemLayout={(_, index) => ({
          length: 200 + theme.spacing.xl,
          offset: (200 + theme.spacing.xl) * index,
          index,
        })}
      />
    </View>
  );
};

export default LocationCategory;

const styles = StyleSheet.create({
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
  emptyTextStyle: {
    flex: 1,
    textAlign: 'center',
    paddingTop: theme.spacing.xl,
  },
});
