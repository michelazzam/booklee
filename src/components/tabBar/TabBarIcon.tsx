import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { HomeIcon, SearchIcon, FavoritesIcon, BookingIcon, AccountIcon } from '~/src/assets/icons';

type TabBarIconProps = {
  color: string;
  size?: number;
  icon: string;
  focused?: boolean;
};

// Icon mapping for tab bar
const iconMap = {
  home: HomeIcon,
  magnify: SearchIcon,
  heart: FavoritesIcon,
  'calendar-check': BookingIcon,
  account: AccountIcon,
} as const;

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

  const IconComponent = iconMap[icon as keyof typeof iconMap];

  if (!IconComponent) {
    return null;
  }

  return (
    <Animated.View style={iconAnimatedStyle}>
      <IconComponent color={color} width={size} height={size} />
    </Animated.View>
  );
};

export default TabBarIcon;
