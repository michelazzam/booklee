/* eslint-disable react-hooks/rules-of-hooks */
import { type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native';
import { useEffect } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';

type LoadingDotsProps = {
  size?: number;
  color?: string;
  numberOfDots?: number;
  style?: StyleProp<ViewStyle>;
};

const LoadingDots = ({ style, size = 8, color = '#000', numberOfDots = 3 }: LoadingDotsProps) => {
  /*** Animation ***/
  const animations = Array.from({ length: numberOfDots }).map(() => useSharedValue(0));

  useEffect(() => {
    const linear = Easing.linear;
    const animateDot = (index: number) => {
      const delay = index * 200;
      animations[index].value = withDelay(
        delay,
        withSequence(
          // Move up
          withTiming(1, {
            duration: 200,
            easing: linear,
          }),
          // Stay up briefly
          withTiming(1, {
            duration: 100,
            easing: linear,
          }),
          // Move down
          withTiming(0, {
            duration: 200,
            easing: linear,
          }),
          // Wait for other dots
          withDelay((numberOfDots - index - 1) * 200, withTiming(0, { duration: 0 }))
        )
      );
    };

    const startAnimation = () => {
      animations.forEach((_, index) => {
        animateDot(index);
      });
    };

    startAnimation();

    // Calculate the total duration for one full cycle
    const lastDotDuration = 200 + 100 + 200;
    const lastDotStart = (numberOfDots - 1) * 350;
    const intervalDuration = lastDotStart + lastDotDuration;

    const intervalId = setInterval(startAnimation, intervalDuration);
    return () => clearInterval(intervalId);
  }, [numberOfDots, animations]);

  return (
    <View style={[styles.container, style]}>
      {animations.map((animation, i) => (
        <Animated.View
          key={i}
          style={[
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: color,
            },
            useAnimatedStyle(() => ({
              transform: [
                { translateY: -10 * animation.value },
                { scale: 1 + 0.2 * animation.value },
              ],
            })),
          ]}
        />
      ))}
    </View>
  );
};

export default LoadingDots;

const styles = StyleSheet.create({
  container: {
    gap: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
