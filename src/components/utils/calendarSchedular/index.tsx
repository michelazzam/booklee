import { View, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useMemo } from 'react';

import { theme } from '~/src/constants/theme';

import { Icon } from '../../base';
import Day from './Day';

const CALENDAR_MAX_DATE = '2025-12-31';
const CALENDAR_MIN_DATE = new Date().toISOString().split('T')[0];
const CALENDAR_THEME = {
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
};

const CalendarScheduler = ({
  onDayPress,
  getMarkedDates,
  getDisabledDates,
}: {
  getMarkedDates: any;
  getDisabledDates: any;
  onDayPress: (day: any) => void;
}) => {
  /***** Memoization *****/
  const combinedMarkedDates = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return {
      ...getMarkedDates,
      ...getDisabledDates,
      [today]: {
        ...getMarkedDates[today],
        ...getDisabledDates[today],
        marked: true,
        dotColor: theme.colors.primaryBlue['100'],
      },
    };
  }, [getMarkedDates, getDisabledDates]);

  return (
    <View style={styles.container}>
      <Calendar
        firstDay={1}
        hideArrows={false}
        onDayPress={onDayPress}
        theme={CALENDAR_THEME}
        monthFormat={'MMMM yyyy'}
        maxDate={CALENDAR_MAX_DATE}
        minDate={CALENDAR_MIN_DATE}
        markedDates={combinedMarkedDates}
        renderArrow={(direction) => (
          <Icon
            size={20}
            name="chevron-right"
            color={theme.colors.darkText['100']}
            style={direction === 'left' ? { transform: [{ rotate: '180deg' }] } : {}}
          />
        )}
        dayComponent={({ date, marking }) => {
          const isDisabled = marking?.disabled;
          const isSelected = marking?.selected;

          return (
            <Day
              date={date}
              marking={marking}
              isDisabled={isDisabled}
              isSelected={isSelected}
              onDayPress={onDayPress}
            />
          );
        }}
      />
    </View>
  );
};

export default CalendarScheduler;

const styles = StyleSheet.create({
  container: {
    borderRadius: theme.radii.md,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.white.DEFAULT,
    ...theme.shadows.soft,
  },
});
