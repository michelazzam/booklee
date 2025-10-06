import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { type DateData, Calendar } from 'react-native-calendars';
import { useState } from 'react';

import { CALENDAR_THEME, CALENDAR_MAX_DATE, CALENDAR_MIN_DATE } from './constants';
import { theme } from '~/src/constants/theme';

import { Icon } from '../../base';
import Day from './Day';

type CalendarSchedulerProps = {
  minDate?: string;
  onDayPress: (day: any) => void;
};

const INITIAL_HEIGHT = 50;
const EXPANDED_HEIGHT = 300;

const CustomCalendar = ({ onDayPress, minDate = CALENDAR_MIN_DATE }: CalendarSchedulerProps) => {
  /*** Stats ***/
  const [selectedDate, setSelectedDate] = useState<DateData | null>(null);

  /***** Animations *****/
  const height = useSharedValue(EXPANDED_HEIGHT);
  const animatedCalendarStyle = useAnimatedStyle(() => {
    return {
      height: height.value,
    };
  });

  const handleExpandPress = () => {
    const currentHeight = height.value;
    const willExpand = currentHeight === INITIAL_HEIGHT;

    height.value = withTiming(willExpand ? EXPANDED_HEIGHT : INITIAL_HEIGHT, { duration: 200 });
  };
  const handleDayPress = (day: DateData) => {
    setSelectedDate(day);
    onDayPress(day);

    setTimeout(() => {
      height.value = withTiming(INITIAL_HEIGHT, { duration: 300 });
    }, 200);
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[animatedCalendarStyle, styles.expandableContent]}>
        <Calendar
          firstDay={1}
          hideArrows={false}
          theme={CALENDAR_THEME}
          monthFormat={'MMMM yyyy'}
          maxDate={CALENDAR_MAX_DATE}
          minDate={CALENDAR_MIN_DATE}
          renderArrow={(direction) => (
            <Icon
              size={20}
              color={theme.colors.darkText['100']}
              name={direction === 'left' ? 'chevron-left' : 'chevron-right'}
            />
          )}
          dayComponent={({ date }) => {
            const isSelected = selectedDate?.dateString === date?.dateString;
            const isDisabled = (minDate && date?.dateString && date?.dateString < minDate) || false;

            return (
              <Day
                date={date!}
                isSelected={isSelected}
                isDisabled={isDisabled}
                onPress={handleDayPress}
              />
            );
          }}
        />
      </Animated.View>

      <TouchableOpacity
        activeOpacity={0.7}
        onPress={handleExpandPress}
        style={styles.expandIndicatorContainer}>
        <View style={styles.expandButton} />
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
    width: 40,
    height: 4,
    borderRadius: 4,
    marginTop: theme.spacing.lg,
    backgroundColor: theme.colors.lightText,
  },
});
