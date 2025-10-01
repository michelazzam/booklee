import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform, StatusBar } from 'react-native';

export const useAppSafeAreaInsets = () => {
  const insets = useSafeAreaInsets();
  const statusBarHeight = StatusBar.currentHeight || 0;

  // Handle inconsistent safe area reporting on Android
  const getTopInset = () => {
    if (Platform.OS === 'ios') {
      return insets.top;
    }

    // Android: Use the larger of safe area or status bar height
    // Some devices report 0 for safe area but have status bar
    const safeAreaTop = insets.top || 0;
    const calculatedTop = Math.max(safeAreaTop, statusBarHeight);

    // For devices with notches/display cutouts, we might need to double
    // This is a heuristic - you might need to adjust based on testing
    if (calculatedTop < 30 && (insets.top > 0 || statusBarHeight > 0)) {
      return Math.max(calculatedTop * 1.5, 30);
    }

    return calculatedTop;
  };

  return {
    top: getTopInset(),
    left: insets.left,
    right: insets.right,
    bottom: insets.bottom || 20,
  };
};
