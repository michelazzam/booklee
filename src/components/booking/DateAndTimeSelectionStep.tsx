import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useState, useMemo } from 'react';
import { theme } from '~/src/constants/theme';
import { Text, Icon } from '../base';
import { ClockIcon } from '~/src/assets/icons';
import { AppointmentServices } from '~/src/services';
import type { AvailabilityResponse } from '~/src/services';

type DateAndTimeSelectionStepProps = {
  selectedDate?: string;
  selectedTime?: string;
  locationId: string;
  serviceId: string;
  serviceDuration: number;
  onDateSelect: (date: string) => void;
  onTimeSelect: (time: string, availabilityData: AvailabilityResponse) => void;
  onComplete?: () => void;
};

const DateAndTimeSelectionStep = ({
  selectedDate,
  selectedTime,
  locationId,
  serviceId,
  serviceDuration,
  onDateSelect,
  onTimeSelect,
  onComplete,
}: DateAndTimeSelectionStepProps) => {
  const [showWeekView, setShowWeekView] = useState(false);
  const [weekOffset, setWeekOffset] = useState(0);
  const [baseWeekDate, setBaseWeekDate] = useState<string | null>(null);

  // Fetch availability when date is selected
  const availabilityQuery = AppointmentServices.useGetAvailabilities(
    locationId,
    selectedDate || '',
    serviceId,
    serviceDuration,
    !!selectedDate
  );

  const availabilityData = availabilityQuery?.data;

  // Get all time slots
  const timeSlots = useMemo(() => {
    if (!availabilityData?.availability?.slots) return [];
    return availabilityData.availability.slots;
  }, [availabilityData]);

  const handleDateSelect = (day: any) => {
    if (day && day.dateString) {
      onDateSelect(day.dateString);
      setShowWeekView(true);
      setWeekOffset(0);
      setBaseWeekDate(day.dateString);
    }
  };

  const handleExpandToMonthly = () => {
    setShowWeekView(false);
    setWeekOffset(0);
    setBaseWeekDate(null);
  };

  const handlePreviousWeek = () => {
    setWeekOffset((prev) => prev - 1);
  };

  const handleNextWeek = () => {
    setWeekOffset((prev) => prev + 1);
  };

  const handleWeekDaySelect = (date: string) => {
    onDateSelect(date);
  };

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

  const getWeekDateRange = () => {
    if (!baseWeekDate) return 'Week View';

    const baseDate = new Date(baseWeekDate);
    const startOfWeek = new Date(baseDate);
    startOfWeek.setDate(baseDate.getDate() - baseDate.getDay() + 1);

    startOfWeek.setDate(startOfWeek.getDate() + weekOffset * 7);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

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

  const getMarkedDates = () => {
    const marked: any = {};

    if (selectedDate) {
      marked[selectedDate] = {
        selected: true,
        selectedColor: theme.colors.primaryBlue['100'],
        selectedTextColor: theme.colors.white.DEFAULT,
      };
    }

    const today = new Date().toISOString().split('T')[0];
    marked[today] = {
      ...marked[today],
      marked: true,
      dotColor: theme.colors.primaryBlue['100'],
    };

    return marked;
  };

  const getDisabledDates = () => {
    const disabled: any = {};
    const today = new Date();
    const currentYear = today.getFullYear();

    for (let month = 0; month < 12; month++) {
      for (let day = 1; day <= 31; day++) {
        const date = new Date(currentYear, month, day);
        const dateString = date.toISOString().split('T')[0];

        if (date.getMonth() !== month) continue;

        if (date < today) {
          disabled[dateString] = { disabled: true, disableTouchEvent: true };
        }

        if (day === 17) {
          disabled[dateString] = { disabled: true, disableTouchEvent: true };
        }
      }
    }

    return disabled;
  };

  const getWeekViewData = () => {
    if (!baseWeekDate) return [];

    const baseDate = new Date(baseWeekDate);
    const startOfWeek = new Date(baseDate);
    startOfWeek.setDate(baseDate.getDate() - baseDate.getDay() + 1);

    startOfWeek.setDate(startOfWeek.getDate() + weekOffset * 7);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const week = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      const dateString = date.toISOString().split('T')[0];

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
                size={20}
                color={theme.colors.darkText['100']}
                name={direction === 'left' ? 'chevron-left' : 'chevron-right'}
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
            firstDay={1}
          />
        ) : (
          <View style={styles.weekView}>
            <View style={styles.weekNavigation}>
              <Icon
                size={20}
                name="chevron-left"
                onPress={handlePreviousWeek}
                color={theme.colors.darkText['100']}
              />

              <Text
                size={theme.typography.fontSizes.md}
                weight="medium"
                color={theme.colors.darkText['100']}
                style={styles.weekTitle}>
                {getWeekDateRange()}
              </Text>

              <Icon
                name="chevron-right"
                size={20}
                color={theme.colors.darkText['100']}
                onPress={handleNextWeek}
              />
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

            <TouchableOpacity style={styles.swipeIndicator} onPress={handleExpandToMonthly}>
              <View style={styles.swipeHandle} />
              <Text
                size={theme.typography.fontSizes.xs}
                color={theme.colors.darkText['50']}
                style={styles.swipeText}>
                Press here to expand
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Time Slots - Show after date is selected */}
      {selectedDate && showWeekView && (
        <>
          {availabilityQuery?.isLoading ? (
            <View style={styles.loadingContainer}>
              <Text size={theme.typography.fontSizes.sm} color={theme.colors.darkText['50']}>
                Loading available times...
              </Text>
            </View>
          ) : timeSlots.length === 0 ? (
            <View style={styles.noSlotsContainer}>
              <Text size={theme.typography.fontSizes.sm} color={theme.colors.darkText['50']}>
                No available times for this date
              </Text>
            </View>
          ) : (
            <ScrollView style={styles.timeSlotsScroll} showsVerticalScrollIndicator={false}>
              <View style={styles.timeSlotsWrapper}>
                {timeSlots.map((slot) => {
                  const isPassed = isTimeSlotPassed(slot.value);
                  const isSelected = selectedTime === slot.value;
                  const isDisabled = !slot.isAvailable || isPassed;

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
                          if (isSelected) {
                            onTimeSelect('', availabilityData);
                          } else {
                            onTimeSelect(slot.value, availabilityData);
                            // Automatically navigate to professional step after selecting time
                            setTimeout(() => {
                              onComplete?.();
                            }, 300);
                          }
                        }
                      }}>
                      <ClockIcon
                        width={16}
                        height={16}
                        color={
                          isSelected ? theme.colors.white.DEFAULT : theme.colors.darkText['100']
                        }
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
            </ScrollView>
          )}
        </>
      )}
    </View>
  );
};

export default DateAndTimeSelectionStep;

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.lg,
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
  timeSlotsScroll: {
    maxHeight: 400,
  },
  timeSlotsWrapper: {
    gap: theme.spacing.md,
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
    justifyContent: 'center',
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
    paddingVertical: theme.spacing.xl,
  },
  noSlotsContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
});
