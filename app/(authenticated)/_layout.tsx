import { Stack } from 'expo-router';

import { theme } from '~/src/constants/theme';

export default function AuthenticatedLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.white.DEFAULT },
      }}
    />
  );
}
