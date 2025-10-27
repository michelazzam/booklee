import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useMemo, useState, useEffect } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { AppointmentServices } from '~/src/services';
import { theme } from '~/src/constants/theme';
import { Text } from '../base';
import { ClockIcon } from '~/src/assets/icons';
import type { SelectedService, AvailabilityResponse, ServiceBooking } from '~/src/services';

type TimeSelectionStepProps = {
  selectedServices: SelectedService[];
  locationId: string;
  selectedDate: string;
  serviceBookings: Record<string, ServiceBooking>;
  onTimeSelect: (serviceId: string, time: string, availabilityData: AvailabilityResponse) => void;
};

const AnimatedServiceCard = ({
  service,
  selectedTime,
  isExpanded,
  isLoading,
  onToggle,
  renderTimeSlots,
  timeSlots,
}: any) => {
  const height = useSharedValue(0);
  const [shouldRender, setShouldRender] = useState(false);

  // Calculate required height based on time slots
  // Each slot: minHeight 56 + gap between slots 12 + bottom padding 16
  const calculateHeight = () => {
    // Formula: (number of slots * slot height) + (gaps between slots) + bottom padding
    // timeSlot.minHeight = 56, gap = 12, paddingBottom = 16
    const slotHeight = 56; // minHeight from styles
    const gapBetweenSlots = 12; // theme.spacing.md (timeSlotsWrapper gap)
    const bottomPadding = 16; // theme.spacing.lg (timeSlotsWrapper paddingBottom)
    const loadingHeight = 60; // Approximate loading container height

    // If loading or no slots, return loading height
    if (isLoading || timeSlots.length === 0) {
      return loadingHeight;
    }

    const totalHeight =
      timeSlots.length * slotHeight + (timeSlots.length - 1) * gapBetweenSlots + bottomPadding;

    return totalHeight;
  };

  // Update animations when expanded state changes
  useEffect(() => {
    const requiredHeight = calculateHeight();

    if (isExpanded) {
      setShouldRender(true);
      height.value = withSpring(requiredHeight, { damping: 20, stiffness: 120 });
    } else {
      height.value = withSpring(0, { damping: 20, stiffness: 120 }, (finished) => {
        if (finished) {
          runOnJS(setShouldRender)(false);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExpanded, timeSlots.length, isLoading]);

  const animatedContentStyle = useAnimatedStyle(() => ({
    maxHeight: height.value,
    overflow: 'hidden',
  }));

  return (
    <View style={styles.serviceContainer}>
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.serviceHeader}
        onPress={() => onToggle(service.id)}>
        <View style={styles.serviceHeaderContent}>
          <View style={styles.serviceInfo}>
            <Text size={theme.typography.fontSizes.lg} weight="medium" style={{ flexShrink: 1 }}>
              {service.name}{' '}
              <Text size={theme.typography.fontSizes.sm} color={theme.colors.darkText['50']}>
                ({service.duration} min)
              </Text>
            </Text>

            {selectedTime && (
              <Text size={theme.typography.fontSizes.sm} color={theme.colors.primaryBlue['100']}>
                Selected:{' '}
                {new Date(`2000-01-01T${selectedTime}:00`).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}{' '}
                to{' '}
                {new Date(
                  new Date(`2000-01-01T${selectedTime}:00`).getTime() + service.duration * 60 * 1000
                ).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            )}
          </View>

          <View
            style={[styles.checkmark, (isExpanded || selectedTime) && styles.checkmarkSelected]}>
            {(isExpanded || selectedTime) && <View style={styles.checkmarkDot} />}
          </View>
        </View>
      </TouchableOpacity>

      {shouldRender && (
        <Animated.View style={animatedContentStyle}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <Text size={theme.typography.fontSizes.sm} color={theme.colors.darkText['50']}>
                Loading available times...
              </Text>
            </View>
          ) : (
            renderTimeSlots(service)
          )}
        </Animated.View>
      )}
    </View>
  );
};

const TimeSelectionStep = ({
  selectedServices,
  locationId,
  selectedDate,
  serviceBookings,
  onTimeSelect,
}: TimeSelectionStepProps) => {
  const [expandedService, setExpandedService] = useState<string | null>(null);

  // Fetch availability for each service (using first service for now since they share same date)
  const firstService = selectedServices[0];
  const availabilityQuery = AppointmentServices.useGetAvailabilities(
    locationId,
    selectedDate,
    firstService?.id || '',
    firstService?.duration || 0,
    !!selectedDate && !!firstService
  );

  const availabilityData = availabilityQuery?.data;

  // Get all time slots
  const timeSlots = useMemo(() => {
    if (!availabilityData?.availability?.slots) return [];
    return availabilityData.availability.slots;
  }, [availabilityData]);

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

  const hasTimeConflict = (
    slotTime: string,
    serviceId: string,
    serviceDuration: number
  ): boolean => {
    const slotStart = new Date(`${selectedDate}T${slotTime}:00`);
    const slotEnd = new Date(slotStart.getTime() + serviceDuration * 60 * 1000);

    // Check this slot against ALL OTHER services (not including the current service)
    for (const otherService of selectedServices) {
      // Skip checking against itself
      if (otherService.id === serviceId) {
        continue;
      }

      const otherBooking = serviceBookings[otherService.id];
      // If no time selected for this service, skip it
      if (!otherBooking?.selectedTime) {
        continue;
      }

      // Calculate the other service's time window using ITS duration
      const otherStart = new Date(`${selectedDate}T${otherBooking.selectedTime}:00`);
      const otherEnd = new Date(otherStart.getTime() + otherService.duration * 60 * 1000);

      // Check for time overlap
      // Overlap occurs when: slotStart < otherEnd AND slotEnd > otherStart
      if (slotStart < otherEnd && slotEnd > otherStart) {
        return true; // Conflict found!
      }
    }

    return false; // No conflicts
  };

  const renderTimeSlots = (service: SelectedService) => {
    const booking = serviceBookings[service.id];
    const selectedTime = booking?.selectedTime;

    return (
      <View style={styles.timeSlotsWrapper}>
        {timeSlots.map((slot) => {
          const isPassed = isTimeSlotPassed(slot.value);
          const isSelected = selectedTime === slot.value;

          // Only check for conflicts if this slot is not currently selected for this service
          // This allows re-selecting the same time, but prevents selecting conflicting times
          const hasConflict = isSelected
            ? false
            : hasTimeConflict(slot.value, service.id, service.duration);
          const isDisabled = !slot.isAvailable || isPassed || hasConflict;

          return (
            <TouchableOpacity
              activeOpacity={0.8}
              key={slot.value}
              style={[
                styles.timeSlot,
                isSelected && styles.selectedTimeSlot,
                isDisabled && styles.disabledTimeSlot,
              ]}
              disabled={isDisabled && !isSelected}
              onPress={() => {
                if (availabilityData) {
                  // If already selected, unselect it; otherwise select it
                  if (isSelected) {
                    onTimeSelect(service.id, '', availabilityData);
                  } else {
                    onTimeSelect(service.id, slot.value, availabilityData);
                  }
                }
              }}>
              <ClockIcon
                width={16}
                height={16}
                color={isSelected ? theme.colors.white.DEFAULT : theme.colors.darkText['100']}
              />
              <Text
                size={theme.typography.fontSizes.md}
                weight={isSelected ? 'medium' : 'regular'}
                color={
                  isDisabled
                    ? theme.colors.darkText['25']
                    : isSelected
                      ? theme.colors.white.DEFAULT
                      : theme.colors.darkText['100']
                }>
                {slot.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {selectedServices.map((service) => {
        const booking = serviceBookings[service.id];
        const selectedTime = booking?.selectedTime;
        const isLoading = availabilityQuery?.isLoading;
        const isExpanded = expandedService === service.id;

        return (
          <AnimatedServiceCard
            key={service.id}
            service={service}
            selectedTime={selectedTime}
            isExpanded={isExpanded}
            isLoading={isLoading}
            onToggle={(serviceId: string) => setExpandedService(isExpanded ? null : serviceId)}
            renderTimeSlots={renderTimeSlots}
            timeSlots={timeSlots}
          />
        );
      })}
    </ScrollView>
  );
};

export default TimeSelectionStep;

const styles = StyleSheet.create({
  serviceContainer: {
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.white.DEFAULT,
    borderRadius: theme.radii.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  serviceHeader: {
    minHeight: 52,
    justifyContent: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
  },
  serviceHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.lg,
    justifyContent: 'space-between',
  },
  serviceInfo: {
    flexShrink: 1,
    gap: theme.spacing.xs,
  },
  checkmark: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: theme.colors.border,
  },
  checkmarkSelected: {
    backgroundColor: theme.colors.white.DEFAULT,
    borderColor: theme.colors.primaryBlue['100'],
  },
  checkmarkDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.primaryBlue['100'],
  },
  timeSlotsWrapper: {
    gap: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
  },
  timeSlot: {
    width: '100%',
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.white.DEFAULT,
    alignItems: 'center',
    gap: theme.spacing.sm,
    flexDirection: 'row',
    minHeight: 56,
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
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
  },
  noSlotsContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
  },
});
