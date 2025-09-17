import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../../../constants/theme';
import { useAppSafeAreaInsets } from '~/src/hooks/useAppSafeAreaInsets';
import { BellIcon } from '~/src/assets/icons';

interface AccountHeaderProps {
  onNotificationPress?: () => void;
}

export default function AccountHeader({ onNotificationPress }: AccountHeaderProps) {
  const { top } = useAppSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: top * 2 }]}>
      <View style={styles.headerContent}>
        <Text style={styles.appTitle}>Booklee</Text>
        <TouchableOpacity
          style={styles.notificationButton}
          onPress={onNotificationPress}
          activeOpacity={0.7}>
          <BellIcon width={24} height={24} color={theme.colors.white.DEFAULT} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.primaryBlue[100],
    paddingBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  appTitle: {
    ...theme.typography.textVariants.headline,
    color: theme.colors.white.DEFAULT,
    fontWeight: 'bold',
  },
  notificationButton: {
    padding: theme.spacing.xs,
  },
});
