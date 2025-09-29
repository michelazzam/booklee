import { Tabs, usePathname } from 'expo-router';
import { Platform } from 'react-native';
import { useMemo } from 'react';

import { theme } from '~/src/constants/theme';

import { TabBarIcon } from '~/src/components/tabBar';

type TabType = {
  name: string;
  icon: string;
  title: string;
};
const TABS: TabType[] = [
  {
    icon: 'home',
    title: 'Home',
    name: 'index',
  },
  {
    name: 'search',
    title: 'Search',
    icon: 'magnify',
  },
  {
    icon: 'heart',
    title: 'Favorites',
    name: 'favorites',
  },
  {
    name: 'bookings',
    title: 'Bookings',
    icon: 'calendar-check',
  },
  {
    name: 'account',
    title: 'Account',
    icon: 'account',
  },
];

export default function TabLayout() {
  /*** Constants ***/
  const pathname = usePathname();

  /*** Memoization ***/
  const tabMarginBottom = useMemo(() => {
    if (pathname === '/search') {
      return Platform.OS === 'ios' ? 50 : 100;
    }

    return 0;
  }, [pathname]);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primaryBlue[100],
        tabBarStyle: {
          marginBottom: tabMarginBottom,
          backgroundColor: theme.colors.white.DEFAULT,
        },
        sceneStyle: {
          backgroundColor: theme.colors.white.DEFAULT,
        },
      }}>
      {TABS.map(({ name, icon, title }) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            title: title,
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon icon={icon} color={color} focused={focused} size={24} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
