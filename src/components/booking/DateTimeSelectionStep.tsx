import { useState, useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

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
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showWeekView, setShowWeekView] = useState(false);

  // Generate calendar days for current month
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateString = date.toISOString().split('T')[0];
      days.push({
        day,
        date: dateString,
        isToday: dateString === new Date().toISOString().split('T')[0],
        isPast: date < new Date(new Date().toDateString()),
      });
    }

    return days;
  }, [currentMonth]);

  // Generate week view if date is selected
  const weekDays = useMemo(() => {
    if (!selectedDate) return [];

    const selected = new Date(selectedDate);
    const startOfWeek = new Date(selected);
    startOfWeek.setDate(selected.getDate() - selected.getDay());

    const week = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      const dateString = date.toISOString().split('T')[0];

      week.push({
        day: date.getDate(),
        date: dateString,
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        isSelected: dateString === selectedDate,
      });
    }

    return week;
  }, [selectedDate]);

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

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const weekDayNames = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  const handleDateSelect = (dateString: string) => {
    onDateSelect(dateString);
    setShowWeekView(true);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(prev.getMonth() - 1);
      } else {
        newMonth.setMonth(prev.getMonth() + 1);
      }
      return newMonth;
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text size={theme.typography.fontSizes.xl} weight="bold">
          Select Date & Time
        </Text>
      </View>

      {/* Calendar Header */}
      <View style={styles.calendarHeader}>
        <TouchableOpacity onPress={() => navigateMonth('prev')}>
          <Icon
            name="chevron-right"
            size={20}
            color={theme.colors.darkText['100']}
            style={{ transform: [{ rotate: '180deg' }] }}
          />
        </TouchableOpacity>

        <Text size={theme.typography.fontSizes.lg} weight="medium">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </Text>

        <TouchableOpacity onPress={() => navigateMonth('next')}>
          <Icon name="chevron-right" size={20} color={theme.colors.darkText['100']} />
        </TouchableOpacity>
      </View>

      {/* Calendar */}
      {!showWeekView ? (
        <View style={styles.calendar}>
          {/* Week day headers */}
          <View style={styles.weekHeader}>
            {weekDayNames.map((day, index) => (
              <Text
                key={index}
                style={styles.weekDayHeader}
                size={theme.typography.fontSizes.sm}
                color={theme.colors.darkText['50']}>
                {day}
              </Text>
            ))}
          </View>

          {/* Calendar grid */}
          <View style={styles.calendarGrid}>
            {calendarDays.map((day, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dayCell,
                  day?.isToday && styles.todayCell,
                  selectedDate === day?.date && styles.selectedDayCell,
                ]}
                onPress={() => day && !day.isPast && handleDateSelect(day.date)}
                disabled={!day || day.isPast}>
                {day && (
                  <Text
                    size={theme.typography.fontSizes.md}
                    color={
                      day.isPast
                        ? theme.colors.grey['100']
                        : selectedDate === day.date
                          ? theme.colors.white.DEFAULT
                          : day.isToday
                            ? theme.colors.primaryBlue['100']
                            : theme.colors.darkText['100']
                    }
                    weight={day.isToday || selectedDate === day.date ? 'bold' : 'regular'}>
                    {day.day}
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ) : (
        /* Week View */
        <View style={styles.weekView}>
          <View style={styles.weekContainer}>
            {weekDays.map((day) => (
              <TouchableOpacity
                key={day.date}
                style={[styles.weekDayCell, day.isSelected && styles.selectedWeekDayCell]}
                onPress={() => onDateSelect(day.date)}>
                <Text
                  size={theme.typography.fontSizes.xs}
                  color={day.isSelected ? theme.colors.white.DEFAULT : theme.colors.darkText['50']}>
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
        </View>
      )}

      {/* Time Slots */}
      {selectedDate && (
        <View style={styles.timeSlotsContainer}>
          <Text size={theme.typography.fontSizes.lg} weight="medium">
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
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
  },
  calendar: {
    gap: theme.spacing.md,
  },
  weekHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: theme.spacing.sm,
  },
  weekDayHeader: {
    textAlign: 'center',
    flex: 1,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 1,
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radii.sm,
  },
  todayCell: {
    backgroundColor: theme.colors.primaryBlue['10'],
  },
  selectedDayCell: {
    backgroundColor: theme.colors.primaryBlue['100'],
  },
  weekView: {
    paddingVertical: theme.spacing.md,
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
  timeSlotsContainer: {
    gap: theme.spacing.md,
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
