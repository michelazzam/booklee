import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const useAppSafeAreaInsets = () => {
  const insets = useSafeAreaInsets();

  return {
    top: insets.top,
    left: insets.left,
    right: insets.right,
    bottom: insets.bottom || 20,
  };
};
