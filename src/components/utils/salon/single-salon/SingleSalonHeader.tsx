import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '~/src/constants/theme';
import { ArrowLeftIcon } from '~/src/assets/icons';
import { useRouter } from 'expo-router';
import { Icon } from '~/src/components/base';

export default function SingleSalonHeader({ isFavorite }: { isFavorite: boolean }) {
  const router = useRouter();

  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <ArrowLeftIcon color={theme.colors.darkText[100]} />
      </TouchableOpacity>

      <Icon
        name={isFavorite ? 'heart' : 'heart-outline'}
        size={24}
        color={theme.colors.darkText[100]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing['2xl'],
    paddingBottom: theme.spacing.xl,
    backgroundColor: theme.colors.white.DEFAULT,
  },
  backButton: {
    padding: theme.spacing.xs,
  },

  spacer: {
    width: 40, // Same width as back button for centering
  },
});
