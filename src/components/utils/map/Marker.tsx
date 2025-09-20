import Svg, { Path, Text as SvgText } from 'react-native-svg';
import { StyleSheet } from 'react-native';
import { useEffect } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
} from 'react-native-reanimated';

import { theme } from '~/src/constants/theme';

type MarkerProps = {
  rating: number;
};

const Marker = ({ rating }: MarkerProps) => {
  /***** Animation *****/
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: scale.value }],
    };
  });

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 300 });
    scale.value = withSpring(1, {
      damping: 15,
      stiffness: 150,
    });
  }, [scale, opacity]);

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Svg width={40} height={44} viewBox="0 0 40 44">
        {/* Drop shadow */}
        <Path
          d="M20 2C29.3888 2 37 9.61116 37 19C37 28.3888 20 42 20 42C20 42 3 28.3888 3 19C3 9.61116 10.6112 2 20 2Z"
          fill="#000000"
          opacity="0.3"
          transform="translate(2, 2)"
        />
        {/* Main pin body - more circular */}
        <Path
          d="M20 2C29.3888 2 37 9.61116 37 19C37 28.3888 20 42 20 42C20 42 3 28.3888 3 19C3 9.61116 10.6112 2 20 2Z"
          fill="#000000"
          stroke={theme.colors.white.DEFAULT}
          strokeWidth={3}
        />
        {/* Pin pointer - smaller and more proportional */}
        <Path
          fill="#000000"
          strokeWidth={1}
          d="M20 42L16 38L24 38L20 42Z"
          stroke={theme.colors.white.DEFAULT}
        />
        {/* Rating text */}
        <SvgText
          x="20"
          y="24"
          textAnchor="middle"
          fontSize="12"
          fontWeight="bold"
          fill={theme.colors.white.DEFAULT}>
          {rating.toFixed(1)}
        </SvgText>
      </Svg>
    </Animated.View>
  );
};

export default Marker;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    // Add shadow for the entire marker
    shadowColor: '#000',
    shadowRadius: 3.84,
    shadowOpacity: 0.25,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 5,
  },
});
