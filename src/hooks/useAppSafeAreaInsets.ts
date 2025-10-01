import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform, StatusBar, Dimensions } from 'react-native';
import { useMemo, useEffect, useState } from 'react';

// Constants for fallback calculations
const ANDROID_FALLBACK_VALUES = {
  // Minimum safe area values for older Android devices
  MIN_TOP_INSET: 24, // Standard status bar height
  MIN_BOTTOM_INSET: 0, // Most older devices don't have bottom insets

  // Common Android status bar heights by API level
  STATUS_BAR_HEIGHT_API_19_22: 25, // KitKat to Lollipop MR1
  STATUS_BAR_HEIGHT_API_23_PLUS: 24, // Marshmallow and above

  // Navigation bar heights for devices with software buttons
  NAVIGATION_BAR_HEIGHT_PORTRAIT: 48,
  NAVIGATION_BAR_HEIGHT_LANDSCAPE: 48,

  // Threshold to detect if safe area is working properly
  SAFE_AREA_DETECTION_THRESHOLD: 10,
};

export const useAppSafeAreaInsets = () => {
  /*** Constants ***/
  const insets = useSafeAreaInsets();
  const statusBarHeight = StatusBar.currentHeight || 0;

  /*** States ***/
  const [dimensions, setDimensions] = useState(() => Dimensions.get('window'));

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });

    return () => subscription?.remove();
  }, []);

  const enhancedInsets = useMemo(() => {
    if (Platform.OS === 'ios') {
      return {
        top: insets.top,
        left: insets.left,
        right: insets.right,
        bottom: insets.bottom,
      };
    }

    const getAndroidTopInset = (): number => {
      // If safe area context is working properly (reports reasonable values)
      if (insets.top >= ANDROID_FALLBACK_VALUES.SAFE_AREA_DETECTION_THRESHOLD) {
        return insets.top;
      }

      // Fallback for older Android devices
      if (statusBarHeight > 0) {
        return statusBarHeight;
      }

      const apiLevel = Platform.Version as number;

      if (apiLevel >= 23) {
        return ANDROID_FALLBACK_VALUES.STATUS_BAR_HEIGHT_API_23_PLUS;
      } else if (apiLevel >= 19) {
        return ANDROID_FALLBACK_VALUES.STATUS_BAR_HEIGHT_API_19_22;
      }

      // Very old Android versions
      return ANDROID_FALLBACK_VALUES.MIN_TOP_INSET;
    };
    const getAndroidBottomInset = (): number => {
      // If safe area context reports a bottom inset, use it
      if (insets.bottom > 0) {
        return insets.bottom;
      }

      // For older devices, we need to detect if there's a software navigation bar
      // This is a heuristic approach since we can't directly detect it
      const screenHeight = Dimensions.get('screen').height;
      const windowHeight = dimensions.height;
      const heightDifference = screenHeight - windowHeight;

      // If there's a significant height difference, likely has navigation bar
      if (heightDifference > 30) {
        const currentIsLandscape = dimensions.width > dimensions.height;
        return currentIsLandscape
          ? ANDROID_FALLBACK_VALUES.NAVIGATION_BAR_HEIGHT_LANDSCAPE
          : ANDROID_FALLBACK_VALUES.NAVIGATION_BAR_HEIGHT_PORTRAIT;
      }

      return ANDROID_FALLBACK_VALUES.MIN_BOTTOM_INSET;
    };
    const getAndroidSideInsets = (): { left: number; right: number } => {
      // Side insets are less common on older devices, but some tablets have them
      if (insets.left > 0 || insets.right > 0) {
        return { left: insets.left, right: insets.right };
      }

      // For older devices, assume no side insets unless it's a tablet in landscape
      const isTablet = Math.min(dimensions.width, dimensions.height) > 600; // Rough tablet detection
      const currentIsLandscape = dimensions.width > dimensions.height;

      if (isTablet && currentIsLandscape) {
        // Some older tablets might have side padding needs
        return { left: 0, right: 0 };
      }

      return { left: 0, right: 0 };
    };

    return {
      top: getAndroidTopInset(),
      bottom: getAndroidBottomInset(),
      left: getAndroidSideInsets().left,
      right: getAndroidSideInsets().right,
    };
  }, [insets, statusBarHeight, dimensions]);

  return enhancedInsets;
};
