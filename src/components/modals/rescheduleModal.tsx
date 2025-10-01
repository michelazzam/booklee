import { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { type DateData } from 'react-native-calendars';

import { AppointmentServices, type UserAppointment } from '~/src/services';
import { theme } from '~/src/constants/theme';

import ModalWrapper, { type ModalWrapperRef } from './ModalWrapper';
import { CustomCalendar } from '../calendars';
import { Text, Icon } from '../base';

export type RescheduleModalRef = {
  dismiss: () => void;
  present: () => void;
};

type RescheduleModalProps = {
  appointment: UserAppointment;
};

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

    return (
      <ModalWrapper
        ref={modalRef}
        snapPoints={['90%']}
        contentContainerStyle={styles.container}
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
          <View style={styles.timeSlotsCard}>
            <Text
              size={theme.typography.fontSizes.lg}
              weight="medium"
              style={styles.timeSlotsTitle}>
              Available Times
            </Text>

            {isLoadingAvailability ? (
              <View style={styles.loadingContainer}>
                <Text size={theme.typography.fontSizes.md} color={theme.colors.darkText['50']}>
                  Loading available times...
                </Text>
              </View>
            ) : (
              <ScrollView style={styles.timeSlots} showsVerticalScrollIndicator={false}>
                {availabilityData?.availability.slots.map((slot) => {
                  const isDisabled = !slot.isAvailable;
                  const isSelected = selectedTime === slot.value;

                  return (
                    <TouchableOpacity
                      key={slot.value}
                      style={[
                        styles.timeSlot,
                        isSelected && styles.selectedTimeSlot,
                        isDisabled && styles.disabledTimeSlot,
                      ]}
                      disabled={isDisabled}
                      onPress={() => handleTimeSelect(slot.value)}>
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
                        {isDisabled && (
                          <Text
                            size={theme.typography.fontSizes.xs}
                            color={theme.colors.darkText['50']}>
                            {slot.reason || 'Not available'}
                          </Text>
                        )}
                      </View>
                    </TouchableOpacity>
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
              </ScrollView>
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
  timeSlotsCard: {
    backgroundColor: theme.colors.white.DEFAULT,
    borderRadius: theme.radii.md,
    padding: theme.spacing.md,
    gap: theme.spacing.md,
  },
  timeSlotsTitle: {
    marginBottom: theme.spacing.sm,
  },
  timeSlots: {
    maxHeight: 300,
  },
  timeSlot: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
  },
  selectedTimeSlot: {
    backgroundColor: theme.colors.primaryBlue['100'],
    borderColor: theme.colors.primaryBlue['100'],
  },
  disabledTimeSlot: {
    backgroundColor: theme.colors.grey['10'],
    borderColor: theme.colors.grey['100'],
    opacity: 0.6,
  },
  timeSlotContent: {
    alignItems: 'center',
    gap: theme.spacing.xs,
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
  rescheduleButton: {
    backgroundColor: theme.colors.primaryBlue['100'],
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radii.sm,
  },
  disabledButton: {
    backgroundColor: theme.colors.grey['100'],
  },
});
