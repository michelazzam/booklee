import { useState, useRef, forwardRef, useImperativeHandle, useCallback } from 'react';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { type DateData } from 'react-native-calendars';

import { AppointmentServices, type UserAppointment } from '~/src/services';
import { theme } from '~/src/constants/theme';

import ModalWrapper, { type ModalWrapperRef } from './ModalWrapper';
import { CustomCalendar } from '../calendars';
import { Text, Icon } from '../base';
import { Button } from '../buttons';
import { Toast } from 'toastify-react-native';

export type RescheduleModalRef = {
  dismiss: () => void;
  present: () => void;
};
type RescheduleModalProps = {
  appointment: UserAppointment;
};

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);
const RescheduleModal = forwardRef<RescheduleModalRef, RescheduleModalProps>(
  ({ appointment }, ref) => {
    /*** Refs ***/
    const modalRef = useRef<ModalWrapperRef>(null);

    /*** States ***/
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [selectedTime, setSelectedTime] = useState<string>('');

    /*** Constants ***/
    const { location, items } = appointment || {};
    const { data: availabilityData, isLoading: isLoadingAvailability } =
      AppointmentServices.useGetAvailabilities(
        location?.id || '',
        selectedDate,
        items?.[0]?.serviceId || '',
        items?.[0]?.durationMinutes || 60
      );
    const { mutate: rescheduleAppointment, isPending: isReschedulingAppointment } =
      AppointmentServices.useRescheduleAppointment();

    useImperativeHandle(ref, () => ({
      present: () => {
        modalRef.current?.present();
      },
      dismiss: () => {
        modalRef.current?.dismiss();
        setSelectedDate('');
        setSelectedTime('');
      },
    }));

    const handleDaySelect = (day: DateData) => {
      if (day && day.dateString) {
        setSelectedDate(day.dateString);
        setSelectedTime('');
      }
    };
    const handleTimeSelect = (time: string) => {
      setSelectedTime(time);
    };
    const isTimeSlotPassed = useCallback(
      (timeValue: string) => {
        const isToday = selectedDate === new Date().toISOString().split('T')[0];
        if (!isToday) return false;

        const now = new Date();
        const [hours, minutes] = timeValue.split(':').map(Number);
        const slotTime = new Date();
        slotTime.setHours(hours, minutes, 0, 0);

        return now >= slotTime;
      },
      [selectedDate]
    );

    const handleReschedule = () => {
      rescheduleAppointment(
        { appointmentId: appointment.id, startAt: selectedDate + 'T' + selectedTime },
        {
          onSuccess: () => {
            modalRef.current?.dismiss();
            Toast.success('Appointment rescheduled successfully, it will be reviewed by the store');
          },
          onError: () => {
            Toast.error('Failed to reschedule appointment');
          },
        }
      );
    };

    return (
      <ModalWrapper
        ref={modalRef}
        snapPoints={['90%']}
        contentContainerStyle={styles.container}
        footer={
          selectedDate &&
          selectedTime && (
            <Button
              title="Reschedule"
              onPress={handleReschedule}
              isLoading={isReschedulingAppointment}
              disabled={!selectedDate || !selectedTime || isReschedulingAppointment}
            />
          )
        }
        trailingIcon={
          <Icon
            size={24}
            name="close"
            color={theme.colors.darkText['100']}
            onPress={() => modalRef.current?.dismiss()}
          />
        }>
        <Text
          weight="medium"
          style={{ textAlign: 'center' }}
          size={theme.typography.fontSizes.lg}
          color={theme.colors.darkText['100']}>
          CHANGE DATE & TIME
        </Text>

        <CustomCalendar onDayPress={handleDaySelect} />

        {selectedDate && (
          <View style={styles.timeSlotsContainer}>
            <Text size={theme.typography.fontSizes.lg} weight="medium">
              Available Times
            </Text>

            {isLoadingAvailability ? (
              <View style={styles.loadingContainer}>
                <Text size={theme.typography.fontSizes.md} color={theme.colors.darkText['50']}>
                  Loading available times...
                </Text>
              </View>
            ) : (
              <Animated.ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.timeSlotsContent}>
                {availabilityData?.availability.slots.map((slot, index) => {
                  const isPassed = isTimeSlotPassed(slot.value);
                  const isDisabled = !slot.isAvailable || isPassed;
                  const isSelected = selectedTime === slot.value;

                  return (
                    <AnimatedTouchableOpacity
                      key={slot.value}
                      exiting={FadeOut}
                      activeOpacity={0.8}
                      disabled={isDisabled}
                      entering={FadeIn.delay(index * 150)}
                      onPress={() => handleTimeSelect(slot.value)}
                      style={[
                        styles.timeSlot,
                        isSelected && styles.selectedTimeSlot,
                        isDisabled && styles.disabledTimeSlot,
                      ]}>
                      <View style={styles.timeSlotContent}>
                        <Text
                          size={theme.typography.fontSizes.md}
                          color={
                            isDisabled
                              ? theme.colors.darkText['25']
                              : isSelected
                                ? theme.colors.white.DEFAULT
                                : theme.colors.darkText['100']
                          }>
                          {slot.label}
                        </Text>

                        {!isDisabled && (
                          <Text
                            size={theme.typography.fontSizes.xs}
                            color={
                              isSelected ? theme.colors.white.DEFAULT : theme.colors.darkText['50']
                            }>
                            {slot.availableEmployeeCount} professional
                            {slot.availableEmployeeCount !== 1 ? 's' : ''} available
                          </Text>
                        )}

                        {!isPassed && isDisabled && (
                          <Text
                            size={theme.typography.fontSizes.xs}
                            color={theme.colors.darkText['50']}>
                            {slot.reason || 'Not available'}
                          </Text>
                        )}
                      </View>
                    </AnimatedTouchableOpacity>
                  );
                })}

                {availabilityData?.availability.slots.length === 0 && !isLoadingAvailability && (
                  <Text
                    size={theme.typography.fontSizes.md}
                    color={theme.colors.darkText['50']}
                    style={styles.noSlotsText}>
                    No available times for this date
                  </Text>
                )}
              </Animated.ScrollView>
            )}
          </View>
        )}
      </ModalWrapper>
    );
  }
);

RescheduleModal.displayName = 'RescheduleModal';

export default RescheduleModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
  },
  timeSlotsContainer: {
    gap: theme.spacing.md,
    padding: theme.spacing.md,
    borderRadius: theme.radii.md,
    backgroundColor: theme.colors.white.DEFAULT,
  },
  timeSlot: {
    height: 60,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radii.md,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing.lg,
  },
  selectedTimeSlot: {
    borderColor: theme.colors.primaryBlue['100'],
    backgroundColor: theme.colors.primaryBlue['100'],
  },
  disabledTimeSlot: {
    opacity: 0.6,
    borderColor: theme.colors.grey['100'],
    backgroundColor: theme.colors.grey['10'],
  },
  timeSlotContent: {
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  timeSlotsContent: {
    flexGrow: 1,
    gap: theme.spacing.sm,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xl,
  },
  noSlotsText: {
    textAlign: 'center',
    fontStyle: 'italic',
    paddingVertical: theme.spacing.xl,
  },
});
