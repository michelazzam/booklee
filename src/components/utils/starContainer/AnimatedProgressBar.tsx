import { View, StyleSheet } from 'react-native';
import { useEffect } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';

import { theme } from '~/src/constants';

const AnimatedProgressBar = ({ percentage, delay = 0 }: { percentage: number; delay?: number }) => {
  const width = useSharedValue(0);

  useEffect(() => {
    width.value = withDelay(
      delay,
      withTiming(percentage, {
        duration: 500,
        easing: Easing.out(Easing.cubic),
      })
    );
  }, [percentage, delay, width]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${width.value}%`,
  }));

  return (
    <View style={styles.progressBar}>
      <Animated.View style={[styles.progressBarFill, animatedStyle]} />
    </View>
  );
};

export default AnimatedProgressBar;

const styles = StyleSheet.create({
  progressBar: {
    flex: 1,
    height: 6,
    overflow: 'hidden',
    borderRadius: theme.radii.sm,
    backgroundColor: theme.colors.grey[10],
  },
  progressBarFill: {
    height: '100%',
    borderRadius: theme.radii.sm,
    backgroundColor: theme.colors.darkText[100],
  },
});
