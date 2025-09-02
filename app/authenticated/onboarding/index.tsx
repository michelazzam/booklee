import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import { router } from 'expo-router';

const { height } = Dimensions.get('window');

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  buttonText: string;
  backgroundImage: any;
  isLastStep: boolean;
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 1,
    title: "Discover what's close to you.",
    description: 'Turn on location to see services and offers near you.',
    buttonText: 'Enable Location',
    backgroundImage: require('../../../assets/images/onboarding/location.png'),
    isLastStep: false,
  },
  {
    id: 2,
    title: "We'll keep you right on schedule.",
    description: "We'll send you gentle reminders so you never miss an appointment.",
    buttonText: 'Enable Notifications',
    backgroundImage: require('../../../assets/images/onboarding/notifications.png'),
    isLastStep: false,
  },
  {
    id: 3,
    title: "You're All Set!",
    description: 'Ready to start booking your appointments.',
    buttonText: 'Start Booking',
    backgroundImage: require('../../../assets/images/onboarding/all_set.png'),
    isLastStep: true,
  },
];

export default function OnboardingScreen() {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Navigate to main app after onboarding
      router.replace('/authenticated/(tabs)');
    }
  };

  const handleSkip = () => {
    // Navigate to main app
    router.replace('/authenticated/(tabs)');
  };

  const currentStepData = onboardingSteps[currentStep];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Background Image */}
      <ImageBackground
        source={currentStepData.backgroundImage}
        style={styles.backgroundImage}
        resizeMode="cover">
        {/* App Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.appTitle}>booklee</Text>
        </View>
      </ImageBackground>

      {/* Bottom Sheet */}
      <View style={styles.bottomSheet}>
        <Text style={styles.stepTitle}>{currentStepData.title}</Text>
        <Text style={styles.stepDescription}>{currentStepData.description}</Text>

        <TouchableOpacity style={styles.primaryButton} onPress={handleNext}>
          <Text style={styles.primaryButtonText}>{currentStepData.buttonText}</Text>
        </TouchableOpacity>

        {!currentStepData.isLastStep && (
          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipButtonText}>Skip</Text>
          </TouchableOpacity>
        )}

        {/* Pagination Dots */}
        <View style={styles.paginationContainer}>
          {onboardingSteps.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                index === currentStep ? styles.activeDot : styles.inactiveDot,
              ]}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

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
    paddingBottom: 40,
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
