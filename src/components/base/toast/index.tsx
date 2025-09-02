import { View, StyleSheet, useWindowDimensions, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";    
import { useEffect } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";

import { TOAST_CONFIG, getToastConfig, type ToastType } from "./config";

export type CustomToastProps = {
  title?: string;
  type: ToastType;
  message?: string;
  duration?: number;
  onPress?: () => void;
  showProgress?: boolean;
}
export const CustomToast = ({
  type,
  title,
  message,
  onPress,
  duration = TOAST_CONFIG.defaults.duration,
  showProgress = TOAST_CONFIG.defaults.showProgress,
}: CustomToastProps) => {
  /***** Constants *****/
  const { top } = useSafeAreaInsets();
  const config = getToastConfig(type);
  const { width: screenWidth } = useWindowDimensions();

  /***** Animation *****/
  const progressWidth = useSharedValue(100);
  const progressAnimatedStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  useEffect(() => {
    if (showProgress) {
      progressWidth.value = withTiming(0, {
        duration,
        easing: Easing.linear,
      });
    }
  }, [showProgress, duration, progressWidth]);

  return (
    <View
      style={[
        styles.container,
        {
          marginTop: top / 2,
          width: screenWidth - 32,
          backgroundColor: config.backgroundColor,
          borderRadius: TOAST_CONFIG.defaults.borderRadius,
        },
      ]}
    >
      <View style={styles.mainContent}>
        <MaterialCommunityIcons 
          name={config.icon} 
          color={config.iconColor} 
          size={TOAST_CONFIG.defaults.iconSize} 
        />

        <View style={styles.textContainer}>
          <Text
            style={[
              styles.title,
              {
                color: config.textColor,
                fontFamily: TOAST_CONFIG.defaults.fontFamily,
              }
            ]}
          >
            {title || config.title}
          </Text>

          <Text
            style={[
              styles.subtitle,
              {
                color: config.subtitleColor,
                fontFamily: TOAST_CONFIG.defaults.fontFamily,
              }
            ]}
          >
            {message || config.subtitle}
          </Text>
        </View>

        <MaterialCommunityIcons
          name="close"
          onPress={onPress}
          color={config.closeIconColor}
          size={TOAST_CONFIG.defaults.closeIconSize}
        />
      </View>

      {showProgress && (
        <View style={[
          styles.progressTrack,
          { backgroundColor: config.progressTrackColor }
        ]}>
          <Animated.View style={[
            styles.progressBar, 
            progressAnimatedStyle,
            { backgroundColor: config.progressBarColor }
          ]} />
        </View>
      )}
    </View>
  );
};

export default CustomToast;

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    overflow: "hidden",
    marginHorizontal: 16,

    // iOS Shadows
    shadowRadius: 12,
    shadowOpacity: 0.2,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 6,
    },

    // Android Shadows
    elevation: 12,
  },
  mainContent: {
    gap: 12,
    paddingVertical: 18,
    flexDirection: "row",
    paddingHorizontal: 20,
    alignItems: "flex-start",
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    lineHeight: 20,
    marginBottom: 4,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.95,
    lineHeight: 18,
    fontWeight: "400",
  },
  progressTrack: {
    height: 3,
    marginTop: 8,
    marginBottom: 6,
    borderRadius: 1.5,
    marginHorizontal: 20,
  },
  progressBar: {
    elevation: 2,
    height: "100%",
    shadowRadius: 2,
    borderRadius: 1.5,
    shadowOpacity: 0.8,
    shadowOffset: { width: 0, height: 0 },
    shadowColor: "rgba(255, 255, 255, 0.6)",
  },
});
