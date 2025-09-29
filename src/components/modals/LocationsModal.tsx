import { forwardRef, useCallback, useImperativeHandle, useRef, useState } from 'react';
import { BottomSheetModal, BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { StyleSheet, View } from 'react-native';

import type { LocationType } from '~/src/services';

import { useAppSafeAreaInsets } from '~/src/hooks';
import { theme } from '~/src/constants/theme';

import LocationCardSkeleton from '../preview/location/skeleton';
import LocationCard from '../preview/location';
import { Text } from '../base';

type LocationsModalProps = {
  isLoading: boolean;
  locations: LocationType[];
  onLocationPress: (locationId: string) => void;
};

export type LocationsModalRef = {
  present: () => void;
  dismiss: () => void;
};

const LocationsModal = forwardRef<LocationsModalRef, LocationsModalProps>(
  ({ locations, onLocationPress, isLoading }, ref) => {
    /*** Refs ***/
    const bottomSheetRef = useRef<BottomSheetModal>(null);

    /*** States ***/
    const [isVisible, setIsVisible] = useState(true);

    /*** Constants ***/
    const { bottom } = useAppSafeAreaInsets();

    useImperativeHandle(ref, () => ({
      present: () => {
        setIsVisible(true);
        setTimeout(() => {
          bottomSheetRef.current?.present();
        }, 300);
      },
      dismiss: () => {
        setIsVisible(false);
        bottomSheetRef.current?.dismiss();
      },
    }));

    const handleLocationPress = useCallback(
      (locationId: string) => {
        bottomSheetRef.current?.snapToIndex(0);
        setTimeout(() => {
          onLocationPress(locationId);
        }, 300);
      },
      [onLocationPress]
    );

    const renderLocationItem = useCallback(
      ({ item }: { item: LocationType }) => (
        <LocationCard data={item} onPress={() => handleLocationPress(item._id)} width="100%" />
      ),
      [handleLocationPress]
    );
    const renderEmptyComponent = useCallback(() => {
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

    if (!isVisible) {
      return null;
    }

    return (
      <BottomSheetModal
        index={0}
        ref={bottomSheetRef}
        enablePanDownToClose={false}
        backdropComponent={() => null}
        snapPoints={['10%', '55%', '85%']}
        handleIndicatorStyle={styles.handleIndicator}
        backgroundStyle={styles.bottomSheetBackground}>
        <BottomSheetFlatList
          data={locations}
          renderItem={renderLocationItem}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyComponent}
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
    paddingTop: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
  },
  emptyText: {
    textAlign: 'center',
    paddingVertical: theme.spacing.xl,
  },
});
