import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useMemo } from 'react';

import {
  AccountIcon,
  BookingIcon,
  FavoritesIcon,
  FilledBookingIcon,
  FilledFavoritesIcon,
  FilledHomeIcon,
  FilledAccountIcon,
  FilledSearchIcon,
  HomeIcon,
  SearchIcon,
  FilledAnalyticsIcon,
  FilledDashboardIcon,
} from '~/src/assets/icons';
import DashboardIcon from '~/src/assets/icons/DashboardIcon';
import AnalyticsIcon from '~/src/assets/icons/AnalyticsIcon';

type TabBarIconProps = {
  color: string;
  size?: number;
  icon: string;
  focused?: boolean;
};

const TabBarIcon = ({ icon, color, focused = false }: TabBarIconProps) => {
  /***** Animations *****/
  const iconAnimatedStyle = useAnimatedStyle(() => {
    const opacityValue = withTiming(focused ? 1 : 0.7, {
      duration: 200,
    });
    const scaleValue = withTiming(focused ? 1.2 : 1, {
      duration: 200,
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
        return focused ? <FilledHomeIcon color={color} /> : <HomeIcon color={color} />;
      case 'magnify':
        return focused ? <FilledSearchIcon color={color} /> : <SearchIcon color={color} />;
      case 'heart':
        return focused ? <FilledFavoritesIcon color={color} /> : <FavoritesIcon color={color} />;
      case 'calendar-check':
        return focused ? <FilledBookingIcon color={color} /> : <BookingIcon color={color} />;
      case 'account':
        return focused ? <FilledAccountIcon color={color} /> : <AccountIcon color={color} />;
      case 'dashboard':
        return focused ? <FilledDashboardIcon color={color} /> : <DashboardIcon color={color} />;
      case 'analytics':
        return focused ? <FilledAnalyticsIcon color={color} /> : <AnalyticsIcon color={color} />;
      default:
        return null;
    }
  }, [icon, color, focused]);

  return <Animated.View style={iconAnimatedStyle}>{IconComponent}</Animated.View>;
};

export default TabBarIcon;
