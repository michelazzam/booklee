import  { forwardRef } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

import { theme } from '~/src/constants/theme';
import { Text } from '~/src/components/base';
import { Button } from '~/src/components/buttons';
import ModalWrapper, { type ModalWrapperRef } from './ModalWrapper';

export type CancelBookingConfirmationModalRef = ModalWrapperRef;

interface CancelBookingConfirmationModalProps {
  onConfirm?: () => void;
}

const CancelBookingConfirmationModal = forwardRef<
  CancelBookingConfirmationModalRef,
  CancelBookingConfirmationModalProps
>(({ onConfirm }, ref) => {
  const router = useRouter();

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    } else {
      router.back();
    }
  };

  const handleCancel = () => {
    // @ts-ignore - dismiss method exists on ModalWrapperRef
    ref?.current?.dismiss();
  };

  return (
    <ModalWrapper
      ref={ref}
      snapPoints={['30%']}
      handleStyle={styles.handle}
      handleIndicatorStyle={styles.handleIndicator}
    >
      <View style={styles.container}>
        {/* Header with question and close button */}
        <View style={styles.header}>
          <Text size={theme.typography.fontSizes.lg} weight="medium" style={styles.question}>
            CANCEL BOOKING PROCESS?
          </Text>
          <TouchableOpacity onPress={handleCancel} style={styles.closeButton}>
            <Text size={theme.typography.fontSizes.lg} color={theme.colors.darkText['100']}>
              ✕
            </Text>
          </TouchableOpacity>
        </View>

        {/* Action buttons */}
        <View style={styles.buttonsContainer}>
          <Button
            title="No"
            onPress={handleCancel}
            
            containerStyle={styles.noButton}
          />
          <Button
            title="Yes"
            onPress={handleConfirm}
            variant="ghost"
            containerStyle={styles.yesButton}

            
          />
        </View>
      </View>
    </ModalWrapper>
  );
});

CancelBookingConfirmationModal.displayName = 'CancelBookingConfirmationModal';

export default CancelBookingConfirmationModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
  },
  handle: {
    backgroundColor: 'transparent',
  },
  handleIndicator: {
    backgroundColor: theme.colors.darkText['100'],
    width: 40,
    height: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.sm,
  },
  question: {
    color: theme.colors.darkText['100'],
    textAlign: 'center',
    flex: 1,
  },
  closeButton: {
    padding: theme.spacing.xs,
  },
  buttonsContainer: {
    gap: theme.spacing.md,
  },
  noButton: {
    backgroundColor: theme.colors.darkText['100'],
    borderRadius: theme.radii.md,
  },
  noButtonText: {
    color: theme.colors.white.DEFAULT,
    fontWeight: '600',
  },
  yesButton: {
    backgroundColor: theme.colors.white.DEFAULT,
    borderColor: theme.colors.red['100'],
    borderWidth: 1,
    borderRadius: theme.radii.md,

  },

});
