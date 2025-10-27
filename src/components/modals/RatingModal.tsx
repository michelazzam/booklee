import { forwardRef, useImperativeHandle, useRef, useCallback, useState, useEffect } from 'react';
import { View, StyleSheet, Keyboard } from 'react-native';
import { Toast } from 'toastify-react-native';
import BottomSheet, {
  type BottomSheetBackdropProps,
  BottomSheetFlatList,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';

import { LocationServices, type UserAppointmentType, UserServices } from '~/src/services';

import { useAppSafeAreaInsets } from '~/src/hooks';
import { theme } from '~/src/constants/theme';

import { Icon, Text } from '~/src/components/base';
import Rating, {
  type RatingDataType,
  type RatingRef,
} from '~/src/components/preview/review/rating';

type RatingModalProps = {
  appointments: UserAppointmentType[];
};

export type RatingModalRef = {
  present: () => void;
  dismiss: () => void;
};

const RatingModal = forwardRef<RatingModalRef, RatingModalProps>(({ appointments }, ref) => {
  /*** Refs ***/
  const ratingRef = useRef<RatingRef>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);

  /*** States ***/
  const [isVisible, setIsVisible] = useState(false);

  /*** Constants ***/
  const { bottom } = useAppSafeAreaInsets();
  const { data: userData } = UserServices.useGetMe();
  const { mutate: deleteRating } = LocationServices.useDeleteLocationRating();
  const { mutate: submitRating, isPending: isSubmitting } =
    LocationServices.useSubmitLocationRating();

  useImperativeHandle(ref, () => ({
    present: () => {
      setIsVisible(true);

      setTimeout(() => {
        bottomSheetRef.current?.expand();
      }, 500);
    },
    dismiss: () => {
      bottomSheetRef.current?.collapse();

      setTimeout(() => {
        setIsVisible(false);
      }, 500);
    },
  }));

  useEffect(() => {
    if (appointments.length === 0) {
      bottomSheetRef.current?.collapse();
    }
  }, [appointments]);

  const handleSubmit = useCallback(
    (ratingData: RatingDataType) => {
      Keyboard.dismiss();
      const { rating, review, appointmentId = '' } = ratingData;

      if (!rating) {
        Toast.show({
          type: 'error',
          text1: 'Please select a rating',
        });
        return;
      }

      submitRating(
        {
          rating,
          appointmentId,
          message: review,
          userId: userData?.user.id || '',
        },
        {
          onSuccess: () => {
            ratingRef.current?.close();
          },
          onError: (error) => {
            Toast.show({
              type: 'error',
              text1: error.message || 'Failed to submit rating',
            });
          },
        }
      );
    },
    [submitRating, userData?.user.id, ratingRef]
  );
  const handleModalClose = useCallback(() => {
    bottomSheetRef.current?.collapse();
    setIsVisible(false);
    deleteRating(undefined);
  }, [deleteRating]);

  const RenderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
    ),
    []
  );
  const RenderItem = useCallback(
    ({ item }: { item: UserAppointmentType }) => (
      <Rating ref={ratingRef} data={item} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    ),
    [isSubmitting, handleSubmit, ratingRef]
  );

  if (!isVisible) {
    return null;
  }

  return (
    <BottomSheet
      index={-1}
      enablePanDownToClose
      ref={bottomSheetRef}
      onClose={handleModalClose}
      snapPoints={['40%', '85%']}
      backdropComponent={RenderBackdrop}>
      <View style={styles.header}>
        <View style={{ width: 24 }} />

        <Text
          weight="medium"
          size={theme.typography.fontSizes.sm}
          color={theme.colors.darkText['100']}>
          RATE YOUR EXPERIENCES
        </Text>

        <Icon
          size={24}
          name="close"
          onPress={handleModalClose}
          color={theme.colors.darkText['100']}
        />
      </View>

      <Text
        style={styles.subtitle}
        size={theme.typography.fontSizes.sm}
        color={theme.colors.darkText['100']}>
        Share your feedback with us!
      </Text>

      <BottomSheetFlatList
        data={appointments}
        renderItem={RenderItem}
        keyboardDismissMode="on-drag"
        keyExtractor={(item) => item.id}
        automaticallyAdjustKeyboardInsets
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.listContent, { paddingBottom: bottom }]}
        ItemSeparatorComponent={() => <View style={{ height: theme.spacing.sm }} />}
      />
    </BottomSheet>
  );
});

RatingModal.displayName = 'RatingModal';
export default RatingModal;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    paddingBottom: theme.spacing.md,
    justifyContent: 'space-between',
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing.xl,
  },
  subtitle: {
    textAlign: 'center',
    paddingVertical: theme.spacing.md,
  },
  listContent: {
    paddingHorizontal: theme.spacing.xl,
  },
});
