import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import CustomText from '~/src/components/base/text';
import { theme } from '~/src/constants/theme';
import { ArrowLeftIcon } from '~/src/assets/icons';
import { AwareScrollView } from '~/src/components/base';
import { Wrapper } from '~/src/components/utils/UI';

export default function ForgotPasswordMethodSelection() {
  const router = useRouter();

  const handleEmailMethod = () => {
    router.push('/(unauthenticated)/forgot-password/email-input');
  };

  const handlePhoneMethod = () => {
    router.push('/(unauthenticated)/forgot-password/phone-input');
  };

  return (
    <Wrapper style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeftIcon color={theme.colors.darkText[100]} />
        </TouchableOpacity>
        <CustomText size={16} weight="medium">
          FORGOT PASSWORD
        </CustomText>
        <View style={styles.spacer} />
      </View>

      <AwareScrollView contentContainerStyle={styles.content}>
        <View style={styles.titleContainer}>
          <CustomText size={22} weight="semiBold" style={styles.title}>
            Reset Your Password
          </CustomText>
          <CustomText size={14} weight="regular" style={styles.subtitle}>
            Choose how you'd like to receive your verification code
          </CustomText>
        </View>

        <View style={styles.methodsContainer}>
          <TouchableOpacity style={styles.methodButton} onPress={handleEmailMethod}>
            <View style={styles.methodContent}>
              <CustomText size={16} weight="medium" style={styles.methodTitle}>
                Email
              </CustomText>
              <CustomText size={14} weight="regular" style={styles.methodDescription}>
                Send verification code to your email address
              </CustomText>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.methodButton} onPress={handlePhoneMethod}>
            <View style={styles.methodContent}>
              <CustomText size={16} weight="medium" style={styles.methodTitle}>
                Phone Number
              </CustomText>
              <CustomText size={14} weight="regular" style={styles.methodDescription}>
                Send verification code to your phone number
              </CustomText>
            </View>
          </TouchableOpacity>
        </View>
      </AwareScrollView>
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white.DEFAULT,
  },
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
    width: 40,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.xl,
  },
  titleContainer: {
    marginBottom: theme.spacing['3xl'],
  },
  title: {
    color: theme.colors.darkText[100],
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    color: theme.colors.lightText,
    lineHeight: 20,
  },
  methodsContainer: {
    gap: theme.spacing.lg,
  },
  methodButton: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.md,
    backgroundColor: theme.colors.white.DEFAULT,
    padding: theme.spacing.lg,
  },
  methodContent: {
    gap: theme.spacing.xs,
  },
  methodTitle: {
    color: theme.colors.darkText[100],
  },
  methodDescription: {
    color: theme.colors.lightText,
    lineHeight: 20,
  },
});
