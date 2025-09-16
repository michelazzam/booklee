import { View, StyleSheet } from 'react-native';
import { forwardRef, useImperativeHandle, useRef } from 'react';

import { theme } from '~/src/constants/theme';

import { Button } from '~/src/components/buttons';
import { Text } from '~/src/components/base';
import ModalWrapper, { type ModalWrapperRef } from './ModalWrapper';

export type ModifyBookingModalRef = {
  present: () => void;
  dismiss: () => void;
};

type ModifyBookingModalProps = {
  onCancel: () => void;
  onChangeDateTime: () => void;
};

const ModifyBookingModal = forwardRef<ModifyBookingModalRef, ModifyBookingModalProps>(
  ({ onCancel, onChangeDateTime }, ref) => {
    /*** Refs ***/
    const modalRef = useRef<ModalWrapperRef>(null);

    /*** Expose methods ***/
    useImperativeHandle(ref, () => ({
      present: () => {
        modalRef.current?.present();
      },
      dismiss: () => {
        modalRef.current?.dismiss();
      },
    }));

    /*** Handlers ***/
    const handleCancel = () => {
      modalRef.current?.dismiss();
      onCancel();
    };

    const handleChangeDateTime = () => {
      modalRef.current?.dismiss();
      onChangeDateTime();
    };

    return (
      <ModalWrapper
        ref={modalRef}
        title="Modify Booking"
        snapPoints={['40%']}
        contentContainerStyle={styles.contentContainer}>
        <View style={styles.container}>
          <View style={styles.textContainer}>
            <Text
              size={18}
              weight="semiBold"
              color={theme.colors.darkText[100]}
              style={styles.title}>
              What would you like to do?
            </Text>
            <Text size={14} weight="regular" color={theme.colors.lightText} style={styles.subtitle}>
              Choose an option to modify your booking
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <Button
              variant="outline"
              title="Cancel Booking"
              onPress={handleCancel}
              containerStyle={styles.button}
            />

            <Button
              title="Change Date & Time"
              onPress={handleChangeDateTime}
              containerStyle={styles.button}
            />
          </View>
        </View>
      </ModalWrapper>
    );
  }
);

ModifyBookingModal.displayName = 'ModifyBookingModal';

export default ModifyBookingModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  contentContainer: {
    paddingBottom: theme.spacing.xl,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing['3xl'],
    paddingTop: theme.spacing.lg,
  },
  title: {
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    textAlign: 'center',
    lineHeight: 20,
  },
  buttonContainer: {
    gap: theme.spacing.lg,
  },
  button: {
    width: '100%',
  },
});
