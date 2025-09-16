import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useMemo } from 'react';

import { IconType } from '~/src/components/base/icon';
import { AccountIcon, BookingIcon, FavoritesIcon, HomeIcon, SearchIcon } from '~/src/assets/icons';

type TabBarIconProps = {
  color: string;
  size?: number;
  icon: IconType;
  focused?: boolean;
};

const TabBarIcon = ({ icon, color, focused = false }: TabBarIconProps) => {
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

  /***** Memoization *****/
  const IconComponent = useMemo(() => {
    switch (icon) {
      case 'home':
        return <HomeIcon color={color} />;
      case 'magnify':
        return <SearchIcon color={color} />;
      case 'heart':
        return <FavoritesIcon color={color} />;
      case 'calendar-check':
        return <BookingIcon color={color} />;
      case 'account':
        return <AccountIcon color={color} />;
      default:
        return null;
    }
  }, [icon, color]);

  return <Animated.View style={iconAnimatedStyle}>{IconComponent}</Animated.View>;
};

export default TabBarIcon;
