import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { type DateData } from 'react-native-calendars';
import { useMemo } from 'react';

import { theme } from '~/src/constants/theme';

import { Text } from '../../base';

type DayProps = {
  date: DateData;
  isSelected: boolean;
  onPress: (date: any) => void;
};

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);
const Day = ({ date, isSelected, onPress }: DayProps) => {
  /*** Memoization ***/
  const isToday = useMemo(() => {
    const today = new Date();
    const currentDate = new Date(date.dateString);
    return today.toDateString() === currentDate.toDateString();
  }, [date]);
  const isPast = useMemo(() => {
    const today = new Date();
    const currentDate = new Date(date.dateString);
    return currentDate < today;
  }, [date]);

  /*** Animation ***/
  const animatedStyle = useAnimatedStyle(() => {
    let backgroundColor = 'transparent';

    if (isSelected) {
      backgroundColor = theme.colors.primaryBlue['100'];
    }

    return {
      justifyContent: 'center',
      backgroundColor: withTiming(backgroundColor, { duration: 200 }),
    };
  });

  return (
    <AnimatedTouchableOpacity
      disabled={isPast}
      activeOpacity={0.7}
      onPress={() => onPress(date)}
      style={[styles.dayContent, animatedStyle, isPast && { opacity: 0.5 }]}>
      <Text
        weight="medium"
        size={theme.typography.fontSizes.md}
        color={isSelected ? theme.colors.white.DEFAULT : theme.colors.darkText['100']}>
        {date.day}
      </Text>

      {isToday && <View style={styles.dot} />}
    </AnimatedTouchableOpacity>
  );
};

export default Day;

const styles = StyleSheet.create({
  dayContent: {
    minWidth: 32,
    minHeight: 32,
    borderRadius: 16,
    alignItems: 'center',
  },
  selectedDay: {
    justifyContent: 'center',
    backgroundColor: theme.colors.primaryBlue['100'],
  },
  dot: {
    width: 6,
    height: 6,
    marginTop: 2,
    borderRadius: 3,
    backgroundColor: theme.colors.primaryBlue['100'],
  },
});
