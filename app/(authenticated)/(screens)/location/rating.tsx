import { View, StyleSheet, FlatList } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useCallback, useRef } from 'react';

import { LocationServices } from '~/src/services';

import { useAppSafeAreaInsets } from '~/src/hooks';
import { theme } from '~/src/constants';

import { RatingModal, type RatingModalRef } from '~/src/components/modals';
import { DropDown, StarContainer } from '~/src/components/utils';
import { HeaderNavigation, Text } from '~/src/components/base';
import { Review } from '~/src/components/preview';

const starContainerData = {
  totalReviews: 23,
  averageRating: 4.0,
  location: 'Kasslik',
  name: 'Harmony Haven Spa',
  ratingData: [
    { stars: 5, count: 15, percentage: 65 },
    { stars: 4, count: 5, percentage: 22 },
    { stars: 3, count: 2, percentage: 9 },
    { stars: 2, count: 1, percentage: 4 },
    { stars: 1, count: 0, percentage: 0 },
  ],
};
const fakeReviews = [
  {
    name: 'Sarah Johnson',
    rating: 5,
    review:
      'Absolutely amazing experience! The staff was incredibly professional and the facilities were top-notch. I felt completely relaxed and rejuvenated after my treatment. Highly recommend to anyone looking for quality spa services.',
  },
  {
    name: 'Michael Chen',
    rating: 4,
    review:
      'Great spa with excellent service. The massage was wonderful and the atmosphere was very calming. Only minor issue was the waiting time, but overall a very positive experience.',
  },
  {
    name: 'Emily Rodriguez',
    rating: 5,
    review:
      'Perfect place to unwind! The facial treatment exceeded my expectations. The therapist was knowledgeable and made me feel comfortable throughout the entire session. Will definitely be back!',
  },
  {
    name: 'David Thompson',
    rating: 3,
    review:
      'Decent spa experience. The facilities are clean and the staff is friendly. However, I expected a bit more for the price point. The treatment was good but not exceptional.',
  },
  {
    name: 'Lisa Park',
    rating: 5,
    review:
      'Outstanding service from start to finish! The aromatherapy session was incredible and the relaxation room is beautifully designed. This has become my go-to place for self-care.',
  },
];

const FILTER_ITEMS = [
  { label: 'Latest', value: 'latest' },
  { label: 'Oldest', value: 'oldest' },
  { label: 'Lowest Rating', value: 'lowest' },
  { label: 'Highest Rating', value: 'highest' },
];

const LocationRatingPage = () => {
  /*** Refs ***/
  const ratingModalRef = useRef<RatingModalRef>(null);

  /*** Constants ***/
  const { bottom } = useAppSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data } = LocationServices.useGetLocationRatings({
    locationId: id,
  });

  const RenderHeaderItem = useCallback(() => {
    return (
      <View style={styles.reviewsHeaderContainer}>
        <Text size={theme.typography.fontSizes.xl} weight="medium">
          {starContainerData.totalReviews} Reviews
        </Text>

        <View style={styles.reviewsSortContainer}>
          <Text size={theme.typography.fontSizes.sm}>Sort by</Text>

          <DropDown items={FILTER_ITEMS} onSelect={() => {}} />
        </View>
      </View>
    );
  }, []);
  const RenderItem = useCallback(({ item }: { item: any }) => {
    return <Review data={item} />;
  }, []);

  return (
    <>
      <HeaderNavigation title="RATING" />

      <StarContainer
        data={starContainerData}
        onButtonPress={() => ratingModalRef.current?.present()}
        containerStyle={{ marginHorizontal: theme.spacing.md }}
      />

      <FlatList
        data={fakeReviews}
        renderItem={RenderItem}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={RenderHeaderItem}
        ListHeaderComponentStyle={{ zIndex: 1000 }}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={[styles.container, { paddingBottom: bottom }]}
      />

      <RatingModal ref={ratingModalRef} storeId={id} />
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
