import { Tabs } from 'expo-router';

import { theme } from '~/src/constants/theme';

import { type IconType } from '~/src/components/base';
import { TabBarIcon } from '~/src/components/tabBar';

type TabType = {
  name: string;
  label: string;
  icon: IconType;
};
const TABS: TabType[] = [
  {
    icon: 'home',
    name: 'index',
    label: 'Home',
  },
  {
    name: 'search',
    icon: 'magnify',
    label: 'Search',
  },
  {
    icon: 'heart',
    name: 'favorites',
    label: 'Favorites',
  },
  {
    name: 'bookings',
    label: 'Bookings',
    icon: 'calendar-check',
  },
  {
    name: 'account',
    icon: 'account',
    label: 'Account',
  },
];

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primaryBlue[100],
        sceneStyle: {
          backgroundColor: theme.colors.white.DEFAULT,
        },
      }}>
      {TABS.map(({ name, icon, label }) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            title: label,
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon icon={icon} color={color} focused={focused} size={24} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
