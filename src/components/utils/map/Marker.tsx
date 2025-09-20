import Svg, { Path, Text as SvgText } from 'react-native-svg';
import { Marker as MapMarker } from 'react-native-maps';
import { StyleSheet } from 'react-native';
import { useEffect } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
} from 'react-native-reanimated';

import { theme } from '~/src/constants/theme';

export type MarkerDataType = {
  _id: string;
  rating: number;
  latitude: number;
  longitude: number;
};
type MarkerProps = {
  isActive: boolean;
  data: MarkerDataType;
  onPress: (_id: string) => void;
};

const Marker = ({ data, isActive, onPress }: MarkerProps) => {
  /***** Constants *****/
  const { _id, rating, latitude, longitude } = data;

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
    // Start animation immediately when component mounts
    scale.value = withSpring(1, {
      damping: 15,
      stiffness: 150,
    });
    opacity.value = withTiming(1, { duration: 300 });
  }, [scale, opacity]);
  useEffect(() => {
    if (isActive) {
      scale.value = withSpring(1.2, {
        damping: 15,
        stiffness: 150,
      });
    } else {
      scale.value = withSpring(1, {
        damping: 15,
        stiffness: 150,
      });
    }
  }, [isActive, scale]);

  return (
    <MapMarker onPress={() => onPress(_id)} coordinate={{ latitude, longitude }}>
      <Animated.View
        style={[styles.container, animatedStyle]}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
        <Svg width={40} height={44} viewBox="0 0 40 44" style={{ overflow: 'visible' }}>
          {/* Drop shadow */}
          <Path
            opacity="0.3"
            transform="translate(2, 2)"
            fill={isActive ? theme.colors.primaryBlue[100] : '#000000'}
            d="M20 2C29.3888 2 37 9.61116 37 19C37 28.3888 20 42 20 42C20 42 3 28.3888 3 19C3 9.61116 10.6112 2 20 2Z"
          />

          {/* Main pin body - more circular */}
          <Path
            strokeWidth={3}
            stroke={theme.colors.white.DEFAULT}
            fill={isActive ? theme.colors.primaryBlue[100] : '#000000'}
            d="M20 2C29.3888 2 37 9.61116 37 19C37 28.3888 20 42 20 42C20 42 3 28.3888 3 19C3 9.61116 10.6112 2 20 2Z"
          />

          {/* Pin pointer - smaller and more proportional */}
          <Path
            strokeWidth={1}
            d="M20 42L16 38L24 38L20 42Z"
            stroke={theme.colors.white.DEFAULT}
            fill={isActive ? theme.colors.primaryBlue[100] : '#000000'}
          />

          {/* Rating text */}
          <SvgText
            x="20"
            y="24"
            fontSize="12"
            fontWeight="bold"
            textAnchor="middle"
            fill={theme.colors.white.DEFAULT}>
            {rating.toFixed(1)}
          </SvgText>
        </Svg>
      </Animated.View>
    </MapMarker>
  );
};

export default Marker;

const styles = StyleSheet.create({
  container: {
    width: 40,
    height: 44,
    zIndex: 1000,
    alignItems: 'center',
    justifyContent: 'center',

    // IOS Shadows
    shadowColor: '#000',
    shadowRadius: 3.84,
    shadowOpacity: 0.25,
    shadowOffset: {
      width: 0,
      height: 2,
    },

    // Android Shadows
    elevation: 5,
  },
});
