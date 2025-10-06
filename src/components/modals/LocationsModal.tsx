import { forwardRef, useCallback, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { BottomSheetModal, BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { StyleSheet, View } from 'react-native';

import type { LocationType } from '~/src/services';

import { useAppSafeAreaInsets } from '~/src/hooks';
import { theme } from '~/src/constants/theme';

import LocationCardSkeleton from '../preview/location/skeleton';
import LocationCard from '../preview/location';
import { Icon, Text } from '../base';

type LocationsModalProps = {
  isLoading: boolean;
  locations: LocationType[];
  onLocationPress: (locationId: string) => void;
};

export type LocationsModalRef = {
  dismiss: () => void;
  present: (locationId: string) => void;
};

const LocationsModal = forwardRef<LocationsModalRef, LocationsModalProps>(
  ({ locations, onLocationPress, isLoading }, ref) => {
    /*** Refs ***/
    const bottomSheetRef = useRef<BottomSheetModal>(null);

    /*** Constants ***/
    const { bottom } = useAppSafeAreaInsets();

    /*** States ***/
    const [chosenLocationId, setChosenLocationId] = useState<string | null>(null);

    /*** Memoization ***/
    const filteredLocations = useMemo(
      () => locations.filter((location) => location._id !== chosenLocationId),
      [locations, chosenLocationId]
    );
    const chosenLocation = useMemo(
      () => locations.find((location) => location._id === chosenLocationId),
      [locations, chosenLocationId]
    );

    useImperativeHandle(ref, () => ({
      present: (locationId: string) => {
        bottomSheetRef.current?.present();
        setChosenLocationId(locationId);
      },
      dismiss: () => {
        bottomSheetRef.current?.dismiss();
      },
    }));

    const handleLocationPress = useCallback(
      (locationId: string) => {
        bottomSheetRef.current?.dismiss();

        setTimeout(() => {
          onLocationPress(locationId);
        }, 100);
      },
      [onLocationPress]
    );

    const RenderLocationItem = useCallback(
      ({ item }: { item: LocationType }) => (
        <LocationCard data={item} onPress={() => handleLocationPress(item._id)} width="100%" />
      ),
      [handleLocationPress]
    );
    const RenderEmptyComponent = useCallback(() => {
      if (isLoading) {
        return Array.from({ length: 10 }).map((_, index) => (
          <LocationCardSkeleton key={index} minWidth={230} />
        ));
      }

      return (
        <Text
          style={styles.emptyText}
          color={theme.colors.darkText['50']}
          size={theme.typography.fontSizes.md}>
          No locations available
        </Text>
      );
    }, [isLoading]);
    const RenderHeaderComponent = useCallback(() => {
      return (
        <View style={{ gap: theme.spacing.md }}>
          <Icon
            size={24}
            name="close"
            style={{ alignSelf: 'flex-end' }}
            onPress={() => bottomSheetRef.current?.dismiss()}
          />

          {chosenLocation && (
            <View style={{ gap: theme.spacing['3xl'] }}>
              <LocationCard
                data={chosenLocation}
                onPress={() => handleLocationPress(chosenLocation._id)}
              />

              <View style={styles.dividerContainer}>
                <View style={styles.divider} />

                <Text size={theme.typography.fontSizes.lg} weight="medium">
                  You might also like
                </Text>

                <View style={styles.divider} />
              </View>
            </View>
          )}
        </View>
      );
    }, [chosenLocation, handleLocationPress]);

    return (
      <BottomSheetModal
        index={0}
        ref={bottomSheetRef}
        snapPoints={['55%', '85%']}
        backdropComponent={() => null}
        handleIndicatorStyle={styles.handleIndicator}
        backgroundStyle={styles.bottomSheetBackground}>
        <BottomSheetFlatList
          data={filteredLocations}
          renderItem={RenderLocationItem}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={RenderEmptyComponent}
          ListHeaderComponent={RenderHeaderComponent}
          contentContainerStyle={[styles.contentContainer, { paddingBottom: bottom }]}
          ItemSeparatorComponent={() => <View style={{ height: theme.spacing.sm }} />}
        />
      </BottomSheetModal>
    );
  }
);

LocationsModal.displayName = 'LocationsModal';

export default LocationsModal;

const styles = StyleSheet.create({
  bottomSheetBackground: {
    borderTopLeftRadius: theme.radii.lg,
    borderTopRightRadius: theme.radii.lg,
    backgroundColor: theme.colors.white.DEFAULT,
  },
  handleIndicator: {
    width: 40,
    backgroundColor: theme.colors.border,
  },
  contentContainer: {
    gap: theme.spacing.md,
    paddingTop: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
  },
  emptyText: {
    textAlign: 'center',
    paddingVertical: theme.spacing.xl,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.sm,
  },
  divider: {
    flex: 1,
    height: 3,
    backgroundColor: theme.colors.border,
  },
});
