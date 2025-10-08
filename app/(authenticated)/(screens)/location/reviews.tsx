import { View, StyleSheet, FlatList } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';

import { LocationServices, type LocationRatingSortType } from '~/src/services';

import { useAppSafeAreaInsets } from '~/src/hooks';
import { theme } from '~/src/constants';

import { DropDown, type DropDownItem } from '~/src/components/dropdowns';
import { HeaderNavigation, Text } from '~/src/components/base';
import { StarContainer } from '~/src/components/utils';
import { Review } from '~/src/components/preview';

const FILTER_ITEMS: DropDownItem<LocationRatingSortType>[] = [
  { label: 'Latest', value: { sort: 'date', dir: 'desc' } },
  { label: 'Oldest', value: { sort: 'date', dir: 'asc' } },
  { label: 'Lowest Rating', value: { sort: 'value', dir: 'asc' } },
  { label: 'Highest Rating', value: { sort: 'value', dir: 'desc' } },
];

const LocationRatingPage = () => {
  /*** State ***/
  const [sort, setSort] = useState<LocationRatingSortType>(FILTER_ITEMS[0].value);

  /*** Constants ***/
  const { bottom } = useAppSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data } = LocationServices.useGetLocationRatings({
    locationId: id,
    ...sort,
  });

  const RenderHeaderItem = useCallback(() => {
    return (
      <View style={styles.reviewsHeaderContainer}>
        <Text size={theme.typography.fontSizes.xl} weight="medium">
          {data?.count} Reviews
        </Text>

        <View style={styles.reviewsSortContainer}>
          <Text size={theme.typography.fontSizes.sm}>Sort by</Text>

          <DropDown
            items={FILTER_ITEMS}
            selectedValue={sort}
            onSelect={(item) => setSort(item.value)}
          />
        </View>
      </View>
    );
  }, [data, sort]);
  const RenderItem = useCallback(({ item }: { item: any }) => {
    return <Review data={item} />;
  }, []);

  return (
    <>
      <HeaderNavigation title="RATING" />

      {data && (
        <StarContainer data={data} containerStyle={{ marginHorizontal: theme.spacing.md }} />
      )}

      <FlatList
        data={data?.reviews}
        renderItem={RenderItem}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={RenderHeaderItem}
        ListHeaderComponentStyle={{ zIndex: 1000 }}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={[styles.container, { paddingBottom: bottom }]}
      />
    </>
  );
};

export default LocationRatingPage;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    gap: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
  },
  reviewsHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  reviewsSortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
});
