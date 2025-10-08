import { View, StyleSheet, Image, FlatList, ActivityIndicator } from 'react-native';
import { useCallback, useRef, useState, useEffect } from 'react';
import { useRouter } from 'expo-router';

import { AppointmentServices, type UserAppointmentType } from '~/src/services';

import { useAppSafeAreaInsets } from '~/src/hooks';
import { theme, IMAGES } from '~/src/constants';

import { Booking, UpcomingBookingsSkeleton } from '~/src/components/preview';
import { RatingModal, type RatingModalRef } from '~/src/components/modals';
import { Button } from '~/src/components/buttons';
import { Text } from '~/src/components/base';

const UpcomingBookingsPage = () => {
  /*** Refs ***/
  const ratingModalRef = useRef<RatingModalRef>(null);

  /*** States ***/
  const [isRefetching, setIsRefetching] = useState(false);

  /*** Constants ***/
  const router = useRouter();
  const { bottom } = useAppSafeAreaInsets();
  const { data: needsReviewAppointments } = AppointmentServices.useGetUserAppointments({
    needsReview: true,
  });
  const {
    refetch,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    data: userAppointments,
  } = AppointmentServices.useGetUserAppointments({
    upcoming: true,
  });

  useEffect(() => {
    if (needsReviewAppointments && needsReviewAppointments.length > 0) {
      ratingModalRef.current?.present();
    }
  }, [needsReviewAppointments]);

  const RenderItem = useCallback(
    ({ item }: { item: UserAppointmentType }) => <Booking data={item} />,
    []
  );
  const RenderListEmptyComponent = useCallback(() => {
    if (isLoading) {
      return Array.from({ length: 10 }).map((_, index) => <UpcomingBookingsSkeleton key={index} />);
    }

    return (
      <View style={styles.emptyStateContent}>
        <Image source={IMAGES.favorites.placeholder} style={styles.emptyStateImage} />

        <Text
          size={18}
          weight="semiBold"
          style={{ textAlign: 'center' }}
          color={theme.colors.darkText[100]}>
          No bookings yet
        </Text>

        <Text
          size={14}
          weight="regular"
          color={theme.colors.lightText}
          style={styles.emptyStateDescription}>
          You can add a place to your favorites by tapping on the heart icon at the top right corner
          of the listing.
        </Text>

        <Button
          title="Start Exploring"
          onPress={() => router.navigate('/(authenticated)/(tabs)/search')}
        />
      </View>
    );
  }, [router, isLoading]);
  const RenderFooter = useCallback(() => {
    if (!isFetchingNextPage) return null;

    return <ActivityIndicator color={theme.colors.primaryBlue[100]} />;
  }, [isFetchingNextPage]);

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
      <FlatList
        data={userAppointments}
        renderItem={RenderItem}
        onRefresh={handleRefresh}
        refreshing={isRefetching}
        onEndReachedThreshold={0.5}
        onEndReached={handleEndReached}
        ListFooterComponent={RenderFooter}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={RenderListEmptyComponent}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={[styles.container, { paddingBottom: bottom }]}
      />

      <RatingModal ref={ratingModalRef} appointments={needsReviewAppointments || []} />
    </>
  );
};

export default UpcomingBookingsPage;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    gap: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    paddingHorizontal: theme.spacing.md,
  },
  emptyStateContent: {
    flex: 1,
    gap: theme.spacing.xl,
    paddingTop: theme.spacing.xl + 20,
    paddingHorizontal: theme.spacing.xl,
  },
  emptyStateImage: {
    width: 200,
    height: 200,
    alignSelf: 'center',
  },
  emptyStateDescription: {
    lineHeight: 20,
    textAlign: 'center',
  },
});
