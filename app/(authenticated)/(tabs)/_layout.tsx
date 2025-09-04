import { Tabs } from 'expo-router';
import { BookingIcon, FavoritesIcon, HomeIcon, SearchIcon, AccountIcon } from '~/src/assets/icons';
import { theme } from '~/src/constants/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primaryBlue[100],
        headerShown: false,
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
        name="three"
        options={{
          title: 'Favorites',
          tabBarIcon: ({ color }) => <FavoritesIcon color={color} width={24} height={24} />,
        }}
      />
      <Tabs.Screen
        name="four"
        options={{
          title: 'Bookings',
          tabBarIcon: ({ color }) => <BookingIcon color={color} width={24} height={24} />,
        }}
      />
      <Tabs.Screen
        name="five"
        options={{
          title: 'Account',
          tabBarIcon: ({ color }) => <AccountIcon color={color} width={24} height={24} />,
        }}
      />
    </Tabs>
  );
}
