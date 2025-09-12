import { View, Text, StyleSheet, ImageBackground, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { IMAGES } from '~/src/constants/images';
import { Button } from '~/src/components/buttons';
import { useUserProvider } from '~/src/store';

const { height } = Dimensions.get('window');

const OnboardingStep3 = () => {
  /*** Constants ***/
  const { handleOnboardingCompleted } = useUserProvider();

  const handleFinish = () => {
    handleOnboardingCompleted(true);
    router.replace('/(unauthenticated)/login');
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={IMAGES.onboarding.all_set}
        style={styles.backgroundImage}
        resizeMode="cover">
        <View style={styles.titleContainer}>
          <Text style={styles.appTitle}>Booklee</Text>
        </View>
      </ImageBackground>

      <View style={styles.bottomSheet}>
        <Text style={styles.stepTitle}>You&apos;re All Set!</Text>
        <Text style={styles.stepDescription}>Ready to start booking your appointments.</Text>

        <Button title="Start Booking" onPress={handleFinish} variant="default" />

        <View style={styles.paginationContainer}>
          <View style={[styles.paginationDot, styles.inactiveDot]} />
          <View style={[styles.paginationDot, styles.inactiveDot]} />
          <View style={[styles.paginationDot, styles.activeDot]} />
        </View>
      </View>
    </View>
  );
};

export default OnboardingStep3;

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
    minHeight: height * 0.35,
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
