import { Tabs } from 'expo-router';

import { theme } from '~/src/constants/theme';

import { TabBarIcon } from '~/src/components/tabBar';

type TabType = {
  name: string;
  icon: string;
  title: string;
};
const TABS: TabType[] = [
  {
    icon: 'dashboard',
    title: 'Dashboard',
    name: 'index',
  },
  {
    name: 'calendar',
    title: 'Calendar',
    icon: 'calendar-check',
  },
  {
    icon: 'analytics',
    title: 'Analytics',
    name: 'analytics',
  },
  {
    name: 'account',
    title: 'Account',
    icon: 'account',
  },
];

export default function DashboardTabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primaryGreen[100],

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
