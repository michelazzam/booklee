import { Tabs } from 'expo-router';
import { BookingIcon, FavoritesIcon, HomeIcon, SearchIcon, AccountIcon } from '~/src/assets/icons';
import { theme } from '~/src/constants/theme';

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
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',

          tabBarIcon: ({ color }) => <HomeIcon color={color} width={24} height={24} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color }) => <SearchIcon color={color} width={24} height={24} />,
        }}
      />
      <Tabs.Screen
        name="favorites/index"
        options={{
          title: 'Favorites',
          tabBarIcon: ({ color }) => <FavoritesIcon color={color} width={24} height={24} />,
        }}
      />
      <Tabs.Screen
        name="bookings/index"
        options={{
          title: 'Bookings',
          tabBarIcon: ({ color }) => <BookingIcon color={color} width={24} height={24} />,
        }}
      />
      <Tabs.Screen
        name="account/index"
        options={{
          title: 'Account',
          tabBarIcon: ({ color }) => <AccountIcon color={color} width={24} height={24} />,
        }}
      />
    </Tabs>
  );
}
