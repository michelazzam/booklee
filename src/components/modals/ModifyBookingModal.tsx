import { forwardRef, useImperativeHandle, useRef } from 'react';
import { StyleSheet } from 'react-native';

import { theme } from '~/src/constants/theme';

import ModalWrapper, { type ModalWrapperRef } from './ModalWrapper';
import { Button } from '~/src/components/buttons';
import { Icon } from '~/src/components/base';

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
        title="Modify"
        snapPoints={['30%']}
        contentContainerStyle={styles.container}
        trailingIcon={
          <Icon name="close" size={24} color={theme.colors.darkText[100]} onPress={handleCancel} />
        }>
        <Button
          leadingIcon="clock"
          title="Change Date & Time"
          onPress={handleChangeDateTime}
          containerStyle={styles.button}
        />

        <Button
          variant="outline"
          onPress={handleCancel}
          title="Cancel Appointment"
          containerStyle={styles.button}
          leadingIcon="trash-can-outline"
        />
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
  },
});
