import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { CustomText } from '~/components/CustomText';
import { theme } from '~/theme/Main';
import { ArrowLeftIcon } from '~/assets/icons';
import { useRouter } from 'expo-router';

export default function SignupHeader() {
  const router = useRouter();

  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <ArrowLeftIcon color={theme.colors.darkText[100]} />
      </TouchableOpacity>
      <CustomText variant="subHeadline">CREATE ACCOUNT</CustomText>
      <View style={styles.spacer} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.white.DEFAULT,
  },
  backButton: {
    padding: theme.spacing.xs,
  },

  spacer: {
    width: 40, // Same width as back button for centering
  },
});
