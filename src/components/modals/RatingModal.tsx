import { forwardRef, useImperativeHandle, useRef, useCallback, useState } from 'react';
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
        bottomSheetRef.current?.snapToIndex(0);
      }, 500);
    },
    dismiss: () => {
      bottomSheetRef.current?.close();

      setTimeout(() => {
        setIsVisible(false);
      }, 500);
    },
  }));

  const handleSubmit = useCallback(
    (ratingData: RatingDataType) => {
      Keyboard.dismiss();
      const { rating, review, appointmentId = '' } = ratingData;

      if (!rating || !review) {
        Toast.show({
          type: 'error',
          text1: 'Please select a rating and write a review',
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
            deleteRating({ appointmentId });
          },
          onError: () => {
            Toast.show({
              type: 'error',
              text1: 'Failed to submit rating',
            });
          },
        }
      );
    },
    [submitRating, userData?.user.id, deleteRating, ratingRef]
  );
  const handleModalClose = useCallback(() => {
    bottomSheetRef.current?.close();
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
      snapPoints={['85%']}
      onClose={handleModalClose}
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
    paddingTop: theme.spacing.md,
  },
});
