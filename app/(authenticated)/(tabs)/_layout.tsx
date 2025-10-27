import { StyleSheet, View } from 'react-native';
import { Tabs } from 'expo-router';

import { theme } from '~/src/constants/theme';

import { TabBarIcon } from '~/src/components/tabBar';
import { Text } from '~/src/components/base';

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
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: theme.colors.primaryBlue[100],
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
              <View style={styles.tabContent}>
                <TabBarIcon icon={icon} color={color} focused={focused} size={24} />

                <Text
                  weight={focused ? 'bold' : 'regular'}
                  size={focused ? theme.typography.fontSizes.xs : 10}
                  color={focused ? theme.colors.primaryBlue[100] : theme.colors.lightText[100]}>
                  {title}
                </Text>
              </View>
            ),
          }}
        />
      ))}
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: theme.colors.white.DEFAULT,

    // iOS shadow
    shadowRadius: 4,
    shadowOpacity: 0.1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -2 },

    // Android shadow
    elevation: 8,
  },
  tabContent: {
    width: 100,
    alignItems: 'center',
    gap: theme.spacing.xs,
    marginTop: theme.spacing.xl,
  },
});
