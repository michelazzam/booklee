import { forwardRef } from "react";
import {
  type NativeSyntheticEvent,
  type NativeScrollEvent,
  type ScrollViewProps,
  ScrollView,
} from "react-native";
import {
  type KeyboardAwareScrollViewProps,
  KeyboardAwareScrollView,
} from "react-native-keyboard-controller";
import Animated, {
  type AnimatedScrollViewProps,
  useAnimatedScrollHandler,
  runOnJS,
} from "react-native-reanimated";

import { useAppSafeAreaInsets } from "~/src/hooks";

type AwareScrollViewProps = ScrollViewProps &
  KeyboardAwareScrollViewProps &
  AnimatedScrollViewProps & {
    onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
    onMomentumEnd?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
    onScrollBeginDrag?: (
      event: NativeSyntheticEvent<NativeScrollEvent>
    ) => void;
  };

const AnimatedKeyboardAwareScrollView = Animated.createAnimatedComponent(
  KeyboardAwareScrollView
);

const AwareScrollView = forwardRef<ScrollView, AwareScrollViewProps>(
  (
    {
      children,
      onScroll,
      onMomentumEnd,
      bounces = false,
      onScrollBeginDrag,
      contentContainerStyle,
      keyboardShouldPersistTaps = "handled",
      showsVerticalScrollIndicator = false,
      ...props
    },
    ref
  ) => {
    const { bottom } = useAppSafeAreaInsets();

    const scrollHandler = useAnimatedScrollHandler({
      onScroll: (event) => {
        "worklet";
        if (onScroll) {
          runOnJS(onScroll)(event as any);
        }
      },
      onMomentumEnd: (event) => {
        "worklet";
        if (onMomentumEnd) {
          runOnJS(onMomentumEnd)(event as any);
        }
      },
      onBeginDrag: (event) => {
        "worklet";
        if (onScrollBeginDrag) {
          runOnJS(onScrollBeginDrag)(event as any);
        }
      },
    });

    return (
      <AnimatedKeyboardAwareScrollView
        ref={ref}
        bounces={bounces}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        extraKeyboardSpace={bottom}
        contentContainerStyle={contentContainerStyle}
        keyboardShouldPersistTaps={keyboardShouldPersistTaps}
        showsVerticalScrollIndicator={showsVerticalScrollIndicator}
        {...props}
      >
        {children}
      </AnimatedKeyboardAwareScrollView>
    );
  }
);

AwareScrollView.displayName = "AwareScrollView";
export default AwareScrollView;
