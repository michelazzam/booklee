import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { type DateData, Calendar } from 'react-native-calendars';
import { useState } from 'react';

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

type CalendarSchedulerProps = {
  onDayPress: (day: any) => void;
};

const INITIAL_HEIGHT = 60;
const EXPANDED_HEIGHT = 300;

const CustomCalendar = ({ onDayPress }: CalendarSchedulerProps) => {
  /*** Stats ***/
  const [selectedDate, setSelectedDate] = useState<DateData | null>(null);

  /***** Animations *****/
  const rotation = useSharedValue(0);
  const height = useSharedValue(INITIAL_HEIGHT);
  const animatedCalendarStyle = useAnimatedStyle(() => {
    return {
      height: height.value,
    };
  });
  const animatedIconStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  const handleExpandPress = () => {
    const currentHeight = height.value;
    const willExpand = currentHeight === INITIAL_HEIGHT;

    height.value = withTiming(willExpand ? EXPANDED_HEIGHT : INITIAL_HEIGHT, { duration: 200 });
    rotation.value = withTiming(willExpand ? 180 : 0, { duration: 200 });
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[animatedCalendarStyle, styles.expandableContent]}>
        <Calendar
          firstDay={1}
          hideArrows={false}
          theme={CALENDAR_THEME}
          onDayPress={onDayPress}
          monthFormat={'MMMM yyyy'}
          maxDate={CALENDAR_MAX_DATE}
          minDate={CALENDAR_MIN_DATE}
          renderArrow={(direction) => (
            <Icon
              size={20}
              name="chevron-right"
              color={theme.colors.darkText['100']}
              style={direction === 'left' ? { transform: [{ rotate: '180deg' }] } : {}}
            />
          )}
          dayComponent={({ date }) => {
            const isSelected = selectedDate?.dateString === date?.dateString;

            return <Day date={date!} isSelected={isSelected} onPress={setSelectedDate} />;
          }}
        />
      </Animated.View>

      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.expandIndicatorContainer}
        onPress={handleExpandPress}>
        <View style={styles.expandButton} />

        <Animated.View style={animatedIconStyle}>
          <Icon name="chevron-down" size={20} color={theme.colors.darkText['100']} />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

export default CustomCalendar;

const styles = StyleSheet.create({
  container: {
    borderRadius: theme.radii.md,
    backgroundColor: theme.colors.white.DEFAULT,
    ...theme.shadows.soft,
  },
  expandableContent: {
    overflow: 'hidden',
    borderRadius: theme.radii.md,
  },
  expandIndicatorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.sm,
  },
  expandButton: {
    width: 50,
    height: 5,
    borderRadius: 5,
    backgroundColor: theme.colors.lightText,
  },
});
