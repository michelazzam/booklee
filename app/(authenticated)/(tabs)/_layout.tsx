import { Tabs } from 'expo-router';

import { theme } from '~/src/constants/theme';

import { type IconType } from '~/src/components/base';
import { TabBarIcon } from '~/src/components/tabBar';

type TabType = {
  name: string;
  icon: IconType;
};
const TABS: TabType[] = [
  {
    icon: 'home',
    name: 'index',
  },
  {
    name: 'search',
    icon: 'magnify',
  },
  {
    icon: 'heart',
    name: 'favorites',
  },
  {
    name: 'bookings',
    icon: 'calendar-check',
  },
  {
    name: 'account',
    icon: 'account',
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
      {TABS.map(({ name, icon }) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            title: name.charAt(0).toUpperCase() + name.slice(1),
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon icon={icon} color={color} focused={focused} size={24} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
