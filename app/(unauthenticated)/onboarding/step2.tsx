import { View, Text, StyleSheet, ImageBackground, useWindowDimensions } from 'react-native';
import { router } from 'expo-router';

import { useUserProvider } from '~/src/store';

import { IMAGES } from '~/src/constants/images';

import { Button } from '~/src/components/buttons';

const OnboardingStep2 = () => {
  /*** Constants ***/
  const { height: windowHeight } = useWindowDimensions();
  const { handleOnboardingCompleted } = useUserProvider();

  const handleEnableNotifications = async () => {
    router.navigate('/(unauthenticated)/onboarding/step3');
  };

  const handleSkip = () => {
    router.replace('/(unauthenticated)/login');
    handleOnboardingCompleted(true);
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={IMAGES.onboarding.notifications}
        style={styles.backgroundImage}
        resizeMode="cover">
        <View style={styles.titleContainer}>
          <Text style={styles.appTitle}>Booklee</Text>
        </View>
      </ImageBackground>

      <View style={[styles.bottomSheet, { minHeight: windowHeight * 0.35 }]}>
        <Text style={styles.stepTitle}>We&apos;ll keep you right on schedule.</Text>
        <Text style={styles.stepDescription}>
          We&apos;ll send you gentle reminders so you never miss an appointment.
        </Text>

        <Button title="Enable Notifications" onPress={handleEnableNotifications} />

        <View style={styles.paginationContainer}>
          <View style={[styles.paginationDot, styles.inactiveDot]} />
          <View style={[styles.paginationDot, styles.activeDot]} />
          <View style={[styles.paginationDot, styles.inactiveDot]} />
        </View>

        <Button
          title="Skip"
          variant="ghost"
          onPress={handleSkip}
          containerStyle={styles.skipButton}
        />
      </View>
    </View>
  );
};

export default OnboardingStep2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '70%',
  },
  titleContainer: {
    flex: 1,
    paddingTop: 60,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  bottomSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 100,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 12,
  },
  stepDescription: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  primaryButton: {
    backgroundColor: '#333333',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  skipButton: {
    alignItems: 'center',
    marginBottom: 24,
  },
  skipButtonText: {
    color: '#666666',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#333333',
  },
  inactiveDot: {
    backgroundColor: '#DDDDDD',
  },
});
