import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  PanResponder,
  Animated,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useState, useRef } from 'react';

import { theme } from '~/src/constants/theme';
import { Text, Icon } from '../base';

type DateTimeSelectionStepProps = {
  selectedDate?: string;
  selectedTime?: string;
  onDateSelect: (date: string) => void;
  onTimeSelect: (time: string) => void;
};

const DateTimeSelectionStep = ({
  selectedDate,
  selectedTime,
  onDateSelect,
  onTimeSelect,
}: DateTimeSelectionStepProps) => {
  const [showWeekView, setShowWeekView] = useState(false);
  const pan = useRef(new Animated.Value(0)).current;

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

  // Available time slots
  const timeSlots = [
    '08:45',
    '09:15',
    '10:00',
    '10:30',
    '11:00',
    '11:30',
    '13:00',
    '15:00',
    '15:15',
    '15:30',
    '16:00',
    '16:15',
    '16:45',
    '17:15',
  ];

  const handleDateSelect = (day: any) => {
    if (day && day.dateString) {
      onDateSelect(day.dateString);
      setShowWeekView(true);
    }
  };

  const handleExpandToMonthly = () => {
    setShowWeekView(false);
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
    if (!selectedDate) return [];

    const selected = new Date(selectedDate);
    const startOfWeek = new Date(selected);
    startOfWeek.setDate(selected.getDate() - selected.getDay() + 1); // Start from Monday

    const week = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      const dateString = date.toISOString().split('T')[0];

      week.push({
        day: date.getDate(),
        date: dateString,
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0),
        isSelected: dateString === selectedDate,
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
            <View style={styles.weekContainer}>
              {getWeekViewData().map((day) => (
                <TouchableOpacity
                  key={day.date}
                  style={[styles.weekDayCell, day.isSelected && styles.selectedWeekDayCell]}
                  onPress={() => onDateSelect(day.date)}>
                  <Text
                    size={theme.typography.fontSizes.xs}
                    color={
                      day.isSelected ? theme.colors.white.DEFAULT : theme.colors.darkText['50']
                    }>
                    {day.dayName}
                  </Text>
                  <Text
                    size={theme.typography.fontSizes.lg}
                    weight="bold"
                    color={
                      day.isSelected ? theme.colors.white.DEFAULT : theme.colors.darkText['100']
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
                Swipe down to expand
              </Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>

      {/* Time Slots Card */}
      {selectedDate && (
        <View style={styles.timeSlotsCard}>
          <Text size={theme.typography.fontSizes.lg} weight="medium" style={styles.timeSlotsTitle}>
            Available Times
          </Text>

          <ScrollView style={styles.timeSlots} showsVerticalScrollIndicator={false}>
            {timeSlots.map((time) => (
              <TouchableOpacity
                key={time}
                style={[styles.timeSlot, selectedTime === time && styles.selectedTimeSlot]}
                onPress={() => onTimeSelect(time)}>
                <Text
                  size={theme.typography.fontSizes.md}
                  color={
                    selectedTime === time
                      ? theme.colors.white.DEFAULT
                      : theme.colors.darkText['100']
                  }>
                  {time}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
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
});
