import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  PanResponder,
  Animated,
  Alert,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useState, useRef } from 'react';

import { theme } from '~/src/constants/theme';
import { Text, Icon } from '../base';
import { AppointmentServices } from '~/src/services';
import type { SelectedService, ServiceBooking, AvailabilityResponse } from '~/src/services';

type DateTimeSelectionStepProps = {
  service: SelectedService;
  locationId: string;
  selectedDate?: string;
  selectedTime?: string;
  serviceBookings: Record<string, ServiceBooking>;
  hasTimeConflict: (
    date: string,
    time: string,
    duration: number,
    excludeServiceId?: string
  ) => boolean;
  onDateSelect: (date: string) => void;
  onTimeSelect: (time: string, availabilityData: AvailabilityResponse) => void;
};

const DateTimeSelectionStep = ({
  service,
  locationId,
  selectedDate,
  selectedTime,
  hasTimeConflict,
  onDateSelect,
  onTimeSelect,
}: DateTimeSelectionStepProps) => {
  const [showWeekView, setShowWeekView] = useState(false);
  const [weekOffset, setWeekOffset] = useState(0); // Track which week we're viewing
  const [baseWeekDate, setBaseWeekDate] = useState<string | null>(null); // Track the base week for week view
  const pan = useRef(new Animated.Value(0)).current;

  // Fetch availability data when date is selected
  const { data: availabilityData, isLoading: isLoadingAvailability } =
    AppointmentServices.useGetAvailabilities(
      locationId,
      selectedDate || '',
      service.id,
      service.duration,
      !!selectedDate
    );

  // PanResponder for swipe-down gesture
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => showWeekView,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only respond to vertical swipes when in week view
        return (
          showWeekView &&
          Math.abs(gestureState.dy) > Math.abs(gestureState.dx) &&
          Math.abs(gestureState.dy) > 5
        );
      },
      onPanResponderGrant: () => {
        pan.setOffset((pan as any)._value);
      },
      onPanResponderMove: (_, gestureState) => {
        // Only allow downward swipes (positive dy values)
        if (gestureState.dy > 0) {
          pan.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        pan.flattenOffset();

        // If swipe down is significant enough, expand to monthly view
        if (gestureState.dy > 30) {
          setShowWeekView(false);
        }

        // Reset the pan value
        Animated.spring(pan, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      },
    })
  ).current;

  // Get time slots from availability data
  const timeSlots = availabilityData?.availability.slots || [];

  const handleDateSelect = (day: any) => {
    if (day && day.dateString) {
      onDateSelect(day.dateString);
      setShowWeekView(true);
      setWeekOffset(0); // Reset to current week when selecting from monthly view
      setBaseWeekDate(day.dateString); // Set the base week date
    }
  };

  const handleExpandToMonthly = () => {
    setShowWeekView(false);
    setWeekOffset(0); // Reset week offset when going back to monthly view
    setBaseWeekDate(null); // Clear base week date
  };

  const handlePreviousWeek = () => {
    setWeekOffset((prev) => prev - 1);
  };

  const handleNextWeek = () => {
    setWeekOffset((prev) => prev + 1);
  };

  const handleWeekDaySelect = (date: string) => {
    onDateSelect(date);
    // Don't change weekOffset - keep the same week view
  };

  // Format week date range for display
  const getWeekDateRange = () => {
    if (!baseWeekDate) return 'Week View';

    const baseDate = new Date(baseWeekDate);
    const startOfWeek = new Date(baseDate);
    startOfWeek.setDate(baseDate.getDate() - baseDate.getDay() + 1); // Start from Monday

    // Apply week offset
    startOfWeek.setDate(startOfWeek.getDate() + weekOffset * 7);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // End on Sunday

    const startMonth = startOfWeek.toLocaleDateString('en-US', { month: 'long' });
    const startDay = startOfWeek.getDate();
    const endMonth = endOfWeek.toLocaleDateString('en-US', { month: 'long' });
    const endDay = endOfWeek.getDate();

    if (startMonth === endMonth) {
      return `${startMonth} ${startDay} - ${endDay}`;
    } else {
      return `${startMonth} ${startDay} - ${endMonth} ${endDay}`;
    }
  };

  // Generate marked dates for disabled dates
  const getMarkedDates = () => {
    const marked: any = {};

    if (selectedDate) {
      marked[selectedDate] = {
        selected: true,
        selectedColor: theme.colors.primaryBlue['100'],
        selectedTextColor: theme.colors.white.DEFAULT,
      };
    }

    // Mark today
    const today = new Date().toISOString().split('T')[0];
    marked[today] = {
      ...marked[today],
      marked: true,
      dotColor: theme.colors.primaryBlue['100'],
    };

    return marked;
  };

  // Generate disabled dates
  const getDisabledDates = () => {
    const disabled: any = {};
    const today = new Date();
    const currentYear = today.getFullYear();

    // Disable past dates and specific dates (like 17th)
    for (let month = 0; month < 12; month++) {
      for (let day = 1; day <= 31; day++) {
        const date = new Date(currentYear, month, day);
        const dateString = date.toISOString().split('T')[0];

        // Skip invalid dates
        if (date.getMonth() !== month) continue;

        // Disable past dates
        if (date < today) {
          disabled[dateString] = { disabled: true, disableTouchEvent: true };
        }

        // Disable 17th of any month (as shown in the image)
        if (day === 17) {
          disabled[dateString] = { disabled: true, disableTouchEvent: true };
        }
      }
    }

    return disabled;
  };

  // Generate week view data
  const getWeekViewData = () => {
    if (!baseWeekDate) return [];

    const baseDate = new Date(baseWeekDate);
    const startOfWeek = new Date(baseDate);
    startOfWeek.setDate(baseDate.getDate() - baseDate.getDay() + 1); // Start from Monday

    // Apply week offset
    startOfWeek.setDate(startOfWeek.getDate() + weekOffset * 7);

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day for comparison

    const week = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      const dateString = date.toISOString().split('T')[0];

      // Check if this date is in the past
      const isPastDate = date < today;

      week.push({
        day: date.getDate(),
        date: dateString,
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0),
        isSelected: dateString === selectedDate,
        isDisabled: isPastDate,
      });
    }

    return week;
  };

  return (
    <View style={styles.container}>
      {/* Calendar Card */}
      <View style={styles.calendarCard}>
        {!showWeekView ? (
          <Calendar
            onDayPress={handleDateSelect}
            markedDates={{
              ...getMarkedDates(),
              ...getDisabledDates(),
            }}
            minDate={new Date().toISOString().split('T')[0]}
            maxDate={'2025-12-31'}
            monthFormat={'MMMM yyyy'}
            hideArrows={false}
            renderArrow={(direction) => (
              <Icon
                name="chevron-right"
                size={20}
                color={theme.colors.darkText['100']}
                style={direction === 'left' ? { transform: [{ rotate: '180deg' }] } : {}}
              />
            )}
            theme={{
              backgroundColor: 'transparent',
              calendarBackground: 'transparent',
              textSectionTitleColor: theme.colors.darkText['50'],
              selectedDayBackgroundColor: theme.colors.primaryBlue['100'],
              selectedDayTextColor: theme.colors.white.DEFAULT,
              todayTextColor: theme.colors.primaryBlue['100'],
              dayTextColor: theme.colors.darkText['100'],
              textDisabledColor: theme.colors.grey['100'],
              dotColor: theme.colors.primaryBlue['100'],
              selectedDotColor: theme.colors.white.DEFAULT,
              arrowColor: theme.colors.darkText['100'],
              monthTextColor: theme.colors.darkText['100'],
              indicatorColor: theme.colors.primaryBlue['100'],
              textDayFontFamily: 'Montserrat-Regular',
              textMonthFontFamily: 'Montserrat-Medium',
              textDayHeaderFontFamily: 'Montserrat-Regular',
              textDayFontSize: theme.typography.fontSizes.md,
              textMonthFontSize: theme.typography.fontSizes.lg,
              textDayHeaderFontSize: theme.typography.fontSizes.sm,
            }}
            firstDay={1} // Start week on Monday
          />
        ) : (
          /* Week View */
          <Animated.View
            style={[
              styles.weekView,
              {
                transform: [{ translateY: pan }],
              },
            ]}
            {...panResponder.panHandlers}>
            {/* Week Navigation Header */}
            <View style={styles.weekNavigation}>
              <TouchableOpacity style={styles.weekNavButton} onPress={handlePreviousWeek}>
                <Icon name="chevron-left" size={20} color={theme.colors.darkText['100']} />
              </TouchableOpacity>

              <Text
                size={theme.typography.fontSizes.md}
                weight="medium"
                color={theme.colors.darkText['100']}
                style={styles.weekTitle}>
                {getWeekDateRange()}
              </Text>

              <TouchableOpacity style={styles.weekNavButton} onPress={handleNextWeek}>
                <Icon name="chevron-right" size={20} color={theme.colors.darkText['100']} />
              </TouchableOpacity>
            </View>

            <View style={styles.weekContainer}>
              {getWeekViewData().map((day) => (
                <TouchableOpacity
                  key={day.date}
                  style={[
                    styles.weekDayCell,
                    day.isSelected && styles.selectedWeekDayCell,
                    day.isDisabled && styles.disabledWeekDayCell,
                  ]}
                  disabled={day.isDisabled}
                  onPress={() => handleWeekDaySelect(day.date)}>
                  <Text
                    size={theme.typography.fontSizes.xs}
                    color={
                      day.isDisabled
                        ? theme.colors.grey['100']
                        : day.isSelected
                          ? theme.colors.white.DEFAULT
                          : theme.colors.darkText['50']
                    }>
                    {day.dayName}
                  </Text>
                  <Text
                    size={theme.typography.fontSizes.lg}
                    color={
                      day.isDisabled
                        ? theme.colors.grey['100']
                        : day.isSelected
                          ? theme.colors.white.DEFAULT
                          : theme.colors.darkText['100']
                    }>
                    {day.day}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Swipe indicator at bottom */}
            <TouchableOpacity style={styles.swipeIndicator} onPress={handleExpandToMonthly}>
              <View style={styles.swipeHandle} />

              <Text
                size={theme.typography.fontSizes.xs}
                color={theme.colors.darkText['50']}
                style={styles.swipeText}>
                Press here to expand
              </Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>

      {/* Time Slots Card */}
      {selectedDate && (
        <View style={styles.timeSlotsCard}>
          <Text size={theme.typography.fontSizes.lg} weight="medium" style={styles.timeSlotsTitle}>
            Available Times for {service.name}
          </Text>

          {isLoadingAvailability ? (
            <View style={styles.loadingContainer}>
              <Text size={theme.typography.fontSizes.md} color={theme.colors.darkText['50']}>
                Loading available times...
              </Text>
            </View>
          ) : (
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ flexGrow: 1 }}>
              {timeSlots.map((slot) => {
                const hasConflict = hasTimeConflict(
                  selectedDate,
                  slot.value,
                  service.duration,
                  service.id
                );
                const isDisabled = !slot.isAvailable || hasConflict;
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
                    onPress={() => {
                      if (hasConflict) {
                        Alert.alert(
                          'Time Conflict',
                          'This time slot conflicts with another service booking. Please choose a different time.'
                        );
                        return;
                      }
                      if (availabilityData) {
                        onTimeSelect(slot.value, availabilityData);
                      }
                    }}>
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
                      {hasConflict && (
                        <Text size={theme.typography.fontSizes.xs} color={theme.colors.red['100']}>
                          Conflicts with other service
                        </Text>
                      )}
                      {!hasConflict && !slot.isAvailable && (
                        <Text
                          size={theme.typography.fontSizes.xs}
                          color={theme.colors.darkText['50']}>
                          {slot.reason || 'Not available'}
                        </Text>
                      )}
                      {!hasConflict && slot.isAvailable && (
                        <Text
                          size={theme.typography.fontSizes.xs}
                          color={
                            isSelected ? theme.colors.white.DEFAULT : theme.colors.darkText['50']
                          }>
                          {slot.availableEmployeeCount} professional
                          {slot.availableEmployeeCount !== 1 ? 's' : ''} available
                        </Text>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
              {timeSlots.length === 0 && !isLoadingAvailability && (
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
    </View>
  );
};

export default DateTimeSelectionStep;

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.lg,
  },
  header: {
    gap: theme.spacing.sm,
  },
  calendarCard: {
    backgroundColor: theme.colors.white.DEFAULT,
    borderRadius: theme.radii.lg,
    padding: theme.spacing.lg,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  weekView: {
    paddingVertical: theme.spacing.md,
  },
  weekNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
  },
  weekNavButton: {
    padding: theme.spacing.sm,
    borderRadius: theme.radii.sm,
    backgroundColor: theme.colors.grey['10'],
  },
  weekTitle: {
    flex: 1,
    textAlign: 'center',
  },
  swipeIndicator: {
    alignItems: 'center',
    paddingTop: theme.spacing.md,
  },
  swipeHandle: {
    width: 40,
    height: 4,
    backgroundColor: theme.colors.grey['100'],
    borderRadius: 2,
    marginBottom: theme.spacing.xs,
  },
  swipeText: {
    textAlign: 'center',
  },
  weekContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
  },
  weekDayCell: {
    flex: 1,
    alignItems: 'center',
    padding: theme.spacing.sm,
    borderRadius: theme.radii.md,
    gap: theme.spacing.xs,
  },
  selectedWeekDayCell: {
    backgroundColor: theme.colors.primaryBlue['100'],
  },
  disabledWeekDayCell: {
    opacity: 0.5,
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
});
