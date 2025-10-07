import { theme } from '~/src/constants';

const getMinDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

const getMaxDate = () => {
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);
  return maxDate.toISOString().split('T')[0];
};

export const CALENDAR_MAX_DATE = getMaxDate();
export const CALENDAR_MIN_DATE = getMinDate();
export const CALENDAR_THEME = {
  backgroundColor: 'transparent',
  calendarBackground: 'transparent',
  textDayFontFamily: 'Montserrat-Regular',
  textMonthFontFamily: 'Montserrat-Medium',
  arrowColor: theme.colors.darkText['100'],
  dotColor: theme.colors.primaryBlue['100'],
  dayTextColor: theme.colors.darkText['100'],
  textDisabledColor: theme.colors.grey['100'],
  monthTextColor: theme.colors.darkText['100'],
  selectedDotColor: theme.colors.white.DEFAULT,
  textDayHeaderFontFamily: 'Montserrat-Regular',
  textDayFontSize: theme.typography.fontSizes.md,
  todayTextColor: theme.colors.primaryBlue['100'],
  indicatorColor: theme.colors.primaryBlue['100'],
  selectedDayTextColor: theme.colors.white.DEFAULT,
  textMonthFontSize: theme.typography.fontSizes.lg,
  textSectionTitleColor: theme.colors.darkText['50'],
  textDayHeaderFontSize: theme.typography.fontSizes.sm,
  selectedDayBackgroundColor: theme.colors.primaryBlue['100'],
};
