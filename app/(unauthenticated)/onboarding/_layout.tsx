import { Stack } from 'expo-router';
import { Animated } from 'react-native';
import { useEffect, useRef } from 'react';

export default function OnboardingLayout() {
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'fade',
          animationDuration: 300,
        }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="step1" />
        <Stack.Screen name="step2" />
        <Stack.Screen name="step3" />
      </Stack>
    </Animated.View>
  );
}
