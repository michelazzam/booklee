import { TouchableOpacity } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { theme } from '~/src/constants/theme';

type AnimatedButtonProps = {
  style?: any;
  isSelected?: boolean;
  onPress?: () => void;
  children: React.ReactNode;
};

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export const AnimatedButton = ({
  style,
  onPress,
  children,
  isSelected = false,
}: AnimatedButtonProps) => {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      borderColor: withTiming(isSelected ? theme.colors.primaryBlue['100'] : theme.colors.border, {
        duration: 300,
      }),
      backgroundColor: withTiming(
        isSelected ? theme.colors.primaryBlue['10'] : theme.colors.white.DEFAULT,
        { duration: 300 }
      ),
    };
  });

  return (
    <AnimatedTouchableOpacity onPress={onPress} activeOpacity={0.8} style={[style, animatedStyle]}>
      {children}
    </AnimatedTouchableOpacity>
  );
};
