import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

import { theme } from '~/src/constants/theme';

import { Text } from '../../base';

type DayProps = {
  date: any;
  marking: any;
  isDisabled?: boolean;
  isSelected?: boolean;
  onDayPress: (date: any) => void;
};

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);
const Day = ({ isDisabled, isSelected, date, marking, onDayPress }: DayProps) => {
  /*** Animation ***/
  const animatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: withTiming(isSelected ? theme.colors.primaryBlue['100'] : 'transparent', {
        duration: 200,
      }),
    };
  });

  return (
    <AnimatedTouchableOpacity
      activeOpacity={0.7}
      disabled={isDisabled}
      onPress={() => onDayPress?.(date)}
      style={[styles.dayContent, animatedStyle]}>
      <Text
        size={theme.typography.fontSizes.md}
        style={isDisabled && { opacity: 0.5 }}
        color={isSelected ? theme.colors.white.DEFAULT : theme.colors.darkText['100']}>
        {date?.day}
      </Text>

      {marking?.marked && (
        <View
          style={[
            styles.dot,
            { backgroundColor: marking.dotColor || theme.colors.primaryBlue['100'] },
          ]}
        />
      )}
    </AnimatedTouchableOpacity>
  );
};

export default Day;

const styles = StyleSheet.create({
  dayContent: {
    flex: 1,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    marginTop: 2,
    borderRadius: 3,
  },
});
