import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect } from "react";
import Animated, {
  useAnimatedStyle,
  cancelAnimation,
  useSharedValue,
  withSequence,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import {
  TouchableOpacityProps,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  TextStyle,
  View,
} from "react-native";

import { ICON_CONFIG } from "./config";

export type IconType = keyof typeof MaterialCommunityIcons.glyphMap;

type IconProps = TouchableOpacityProps & {
  size?: number;
  color?: string;
  name: IconType;
  loading?: boolean;
  onPress?: () => void;
  hasBackground?: boolean;
  style?: StyleProp<TextStyle>;
};

const { defaults, background, animation, loading: loadingConfig } = ICON_CONFIG;

const Icon = ({
  name,
  style,
  onPress,
  loading = false,
  size = defaults.size,
  hasBackground = false,
  color = defaults.color,
  ...props
}: IconProps) => {
  /*** Constants ***/
  const { hitSlop, activeOpacity } = defaults;

  /***** Animations *****/
  const fill = useSharedValue(0);
  const shouldStop = useSharedValue(false);
  const animatedStyle = useAnimatedStyle(() => ({
    height: fill.value * size,
  }));

  useEffect(() => {
    if (loading) {
      shouldStop.value = false;

      const startAnimation = () => {
        fill.value = withRepeat(
          withSequence(
            withTiming(1, { duration: animation.fill.duration }),
            withTiming(
              0,
              { duration: animation.sequence.duration },
              (finished) => {
                "worklet";
                if (finished && shouldStop.value) {
                  cancelAnimation(fill);
                  fill.value = 0;
                }
              }
            )
          ),
          -1,
          false
        );
      };

      startAnimation();
    } else {
      shouldStop.value = true;
    }
  }, [fill, loading, shouldStop, size]);

  return (
    <TouchableOpacity
      onPress={onPress}
      hitSlop={hitSlop}
      disabled={!onPress}
      activeOpacity={activeOpacity}
      style={[hasBackground && styles.hasBackground]}
      {...props}
    >
      {loading ? (
        <View style={{ width: size, height: size, position: "relative" }}>
          <MaterialCommunityIcons
            size={size}
            name={name}
            style={style}
            color={loadingConfig.backgroundOpacity}
          />

          <Animated.View
            style={[
              {
                bottom: 0,
                width: size,
                overflow: "hidden",
                position: "absolute",
              },
              animatedStyle,
            ]}
          >
            <View
              style={{
                bottom: 0,
                width: size,
                height: size,
                position: "absolute",
              }}
            >
              <MaterialCommunityIcons size={size} name={name} color={color} />
            </View>
          </Animated.View>
        </View>
      ) : (
        <MaterialCommunityIcons size={size} color={color} name={name} style={style} />
      )}
    </TouchableOpacity>
  );
};

export default Icon;

const styles = StyleSheet.create({
  hasBackground: {
    alignItems: "center",
    width: background.width,
    justifyContent: "center",
    height: background.height,
    borderWidth: background.borderWidth,
    borderColor: background.borderColor,
    borderRadius: background.borderRadius,
  },
});
