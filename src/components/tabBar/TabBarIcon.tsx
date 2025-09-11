import Animated, { useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { IconType } from '~/src/components/base/icon';

type TabBarIconProps = {
  color: string;
  size?: number;
  icon: IconType;
  focused?: boolean;
};

const TabBarIcon = ({ icon, color, focused = false, size = 24 }: TabBarIconProps) => {
  /***** Animations *****/
  const iconAnimatedStyle = useAnimatedStyle(() => {
    const opacityValue = withTiming(focused ? 1 : 0.7, {
      duration: 250,
    });
    const scaleValue = withTiming(focused ? 1.2 : 1, {
      duration: 250,
    });

    return {
      opacity: opacityValue,
      transform: [
        {
          scale: scaleValue,
        },
      ],
    };
  }, [focused]);

  return (
    <Animated.View style={iconAnimatedStyle}>
      <MaterialCommunityIcons size={size} name={icon} color={color} />
    </Animated.View>
  );
};

export default TabBarIcon;
