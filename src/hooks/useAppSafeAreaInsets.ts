import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Platform } from "react-native";

export const useAppSafeAreaInsets = () => {
  const insets = useSafeAreaInsets();
  return {
    left: insets.left,
    right: insets.right,
    bottom: insets.bottom || 20,
    top: Platform.OS === "ios" ? insets.top : insets.top * 2.5,
  };
};
