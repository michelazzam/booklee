import { ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { forwardRef, useImperativeHandle, useRef } from 'react';
import { Toast } from 'toastify-react-native';

import { AppointmentServices } from '~/src/services';

import { theme } from '~/src/constants/theme';

import ModalWrapper, { type ModalWrapperRef } from './ModalWrapper';
import { Icon, Text } from '~/src/components/base';

export type ModifyBookingModalRef = {
  present: () => void;
  dismiss: () => void;
};

type ModifyBookingModalProps = {
  appointmentId: string;
  onReschedule: () => void;
};

const ModifyBookingModal = forwardRef<ModifyBookingModalRef, ModifyBookingModalProps>(
  ({ appointmentId, onReschedule }, ref) => {
    /*** Refs ***/
    const modalRef = useRef<ModalWrapperRef>(null);

    /*** Constants ***/
    const { mutate: cancelAppointment, isPending: isCancellingAppointment } =
      AppointmentServices.useCancelAppointment();

    useImperativeHandle(ref, () => ({
      present: () => {
        modalRef.current?.present();
      },
      dismiss: () => {
        modalRef.current?.dismiss();
      },
    }));

    const handleCancel = () => {
      cancelAppointment(
        { appointmentId: appointmentId },
        {
          onSuccess: () => {
            modalRef.current?.dismiss();
          },
          onError: () => {
            Toast.error('Failed to cancel appointment');
          },
        }
      );
    };
    const handleChangeDateTime = () => {
      modalRef.current?.dismiss();
      setTimeout(() => {
        onReschedule();
      }, 300);
    };

    return (
      <ModalWrapper
        ref={modalRef}
        title="Modify"
        snapPoints={['30%']}
        contentContainerStyle={styles.container}>
        <TouchableOpacity onPress={handleChangeDateTime} style={styles.button}>
          <Icon name="clock-outline" size={24} color={theme.colors.darkText[100]} />

          <Text
            size={theme.typography.fontSizes.md}
            weight="medium"
            color={theme.colors.darkText[100]}>
            Change Date & Time
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleCancel}
          disabled={isCancellingAppointment}
          style={[styles.button, styles.cancelButton]}>
          {isCancellingAppointment ? (
            <ActivityIndicator size={24} color={theme.colors.red[100]} />
          ) : (
            <>
              <Icon name="trash-can-outline" size={24} color={theme.colors.red[100]} />

              <Text
                weight="medium"
                color={theme.colors.red[100]}
                size={theme.typography.fontSizes.md}>
                Cancel Appointment
              </Text>
            </>
          )}
        </TouchableOpacity>
      </ModalWrapper>
    );
  }
);

ModifyBookingModal.displayName = 'ModifyBookingModal';
export default ModifyBookingModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
  },
  button: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    justifyContent: 'center',
    padding: theme.spacing.md,
  },
  cancelButton: {
    borderWidth: 1,
    padding: theme.spacing.md,
    borderRadius: theme.radii.md,
    borderColor: theme.colors.red[100],
  },
});
