import { View, StyleSheet, TouchableOpacity } from 'react-native';

import type { TimeSlot, AvailabilityResponse } from '~/src/services';

import { ClockIcon } from '~/src/assets/icons';
import { theme } from '~/src/constants/theme';

import { Text } from '../base';

type TimeSlotSelectionProps = {
  selectedTime?: string;
  selectedDate?: string;
  serviceDuration: number;
  serviceId: string;
  availableTimeSlots: (TimeSlot & {
    isAvailable: boolean;
    isProfessionalBusy: boolean;
    hasConflict: boolean;
  })[];
  hasTimeConflict: (
    date: string,
    time: string,
    duration: number,
    excludeServiceId?: string
  ) => boolean;
  onTimeSelect: (serviceId: string, time: string, availabilityData: AvailabilityResponse) => void;
  selectedProfessional: any;
  isLoading?: boolean;
};

export const TimeSlotSelection = ({
  serviceId,
  selectedTime,
  selectedDate,
  onTimeSelect,
  serviceDuration,
  hasTimeConflict,
  isLoading = false,
  availableTimeSlots,
  selectedProfessional,
}: TimeSlotSelectionProps) => {
  const isTimeSlotPassed = (timeValue: string) => {
    if (!selectedDate) return false;
    const isToday = selectedDate === new Date().toISOString().split('T')[0];
    if (!isToday) return false;

    const now = new Date();
    const [hours, minutes] = timeValue.split(':').map(Number);
    const slotTime = new Date();
    slotTime.setHours(hours, minutes, 0, 0);

    return now >= slotTime;
  };

  if (!selectedProfessional) {
    return null;
  }

  return (
    <View style={styles.section}>
      <Text size={theme.typography.fontSizes.md} weight="medium" style={styles.sectionTitle}>
        Select Time
        {selectedProfessional === 'any'
          ? ' (Any Available Professional)'
          : selectedProfessional && typeof selectedProfessional === 'object'
            ? ` (${selectedProfessional.name})`
            : ''}
      </Text>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text size={theme.typography.fontSizes.sm} color={theme.colors.darkText['50']}>
            Loading available times...
          </Text>
        </View>
      ) : (
        <View style={styles.timeSlotsGrid}>
          {availableTimeSlots.map((slot) => {
            const hasTimeConflictCheck = hasTimeConflict(
              selectedDate || '',
              slot.value,
              serviceDuration,
              serviceId
            );
            const isPassed = isTimeSlotPassed(slot.value);
            const isDisabled =
              !slot.isAvailable || hasTimeConflictCheck || slot.hasConflict || isPassed;
            const isSelected = selectedTime === slot.value;

            return (
              <TouchableOpacity
                activeOpacity={0.8}
                key={slot.value}
                style={[
                  styles.timeSlot,
                  isSelected && styles.selectedTimeSlot,
                  isDisabled && styles.disabledTimeSlot,
                  slot.hasConflict && styles.conflictTimeSlot,
                ]}
                disabled={isDisabled}
                onPress={() => {
                  // If already selected, unselect it; otherwise select it
                  if (isSelected) {
                    onTimeSelect(serviceId, '', null as any);
                  } else {
                    onTimeSelect(serviceId, slot.value, null as any);
                  }
                }}>
                <View style={styles.timeSlotContent}>
                  <ClockIcon
                    width={16}
                    height={16}
                    color={isSelected ? theme.colors.white.DEFAULT : theme.colors.darkText['100']}
                  />

                  <Text
                    size={theme.typography.fontSizes.xs}
                    color={
                      isDisabled
                        ? theme.colors.darkText['25']
                        : isSelected
                          ? theme.colors.white.DEFAULT
                          : theme.colors.darkText['100']
                    }>
                    {slot.label}
                  </Text>

                  {slot.hasConflict && (
                    <Text
                      size={theme.typography.fontSizes.xs}
                      color={theme.colors.red['100']}
                      style={styles.conflictText}>
                      Conflict
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}

          {availableTimeSlots.length === 0 && !isLoading && (
            <View style={styles.noSlotsContainer}>
              <Text size={theme.typography.fontSizes.sm} color={theme.colors.darkText['50']}>
                No available times for{' '}
                {selectedProfessional === 'any'
                  ? 'any professional'
                  : selectedProfessional && typeof selectedProfessional === 'object'
                    ? selectedProfessional.name
                    : 'selected professional'}
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    marginBottom: theme.spacing.md,
  },
  timeSlotsGrid: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    gap: theme.spacing.sm,
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.sm,
  },
  timeSlot: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.white.DEFAULT,
    minWidth: 80,
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
  conflictTimeSlot: {
    borderColor: theme.colors.red['100'],
    backgroundColor: theme.colors.red['10'],
  },
  timeSlotContent: {
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  conflictText: {
    fontSize: 10,
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
  },
  noSlotsContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
    width: '100%',
  },
});
