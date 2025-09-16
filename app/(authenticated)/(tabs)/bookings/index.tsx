import { View, StyleSheet, Image, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';

import { useAppSafeAreaInsets } from '~/src/hooks';
import { theme, IMAGES } from '~/src/constants';

import { Booking } from '~/src/components/preview';
import { Button } from '~/src/components/buttons';
import { Text } from '~/src/components/base';

const UpcomingBookingsPage = () => {
  /*** Constants ***/
  const router = useRouter();
  const { bottom } = useAppSafeAreaInsets();

  const RenderItem = useCallback(
    ({ item }: { item: any }) => <Booking data={item} onModify={() => {}} />,
    []
  );
  const RenderListEmptyComponent = useCallback(
    () => (
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
    ),
    [router]
  );

  return (
    <FlatList
      data={[1, 2, 3]}
      renderItem={RenderItem}
      ListEmptyComponent={RenderListEmptyComponent}
      keyExtractor={(_, index) => index.toString()}
      contentContainerStyle={[styles.container, { paddingBottom: bottom }]}
    />
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
    marginTop: theme.spacing.xl + 20,
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
