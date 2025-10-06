import { StyleSheet, StyleProp, ViewStyle, Keyboard, View } from 'react-native';
import Animated, { FadeOut, FadeIn } from 'react-native-reanimated';
import React, {
  useImperativeHandle,
  useCallback,
  forwardRef,
  useState,
  useMemo,
  useRef,
} from 'react';
import {
  type BottomSheetBackdropProps,
  BottomSheetScrollView,
  BottomSheetBackdrop,
  BottomSheetModal,
} from '@gorhom/bottom-sheet';

import { Text } from '../base';

export type ModalWrapperRef = {
  present: () => void;
  dismiss: () => void;
};
type ModalWrapperProps = {
  title?: string;
  disable?: boolean;
  snapPoints: string[];
  onDismiss?: () => void;
  footer?: React.ReactNode;
  children: React.ReactNode;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  handleStyle?: StyleProp<ViewStyle>;
  onChange?: (index: number) => void;
  handleIndicatorStyle?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
};

const ModalWrapper = forwardRef<ModalWrapperRef, ModalWrapperProps>(
  (
    {
      title,
      footer,
      disable,
      children,
      onChange,
      onDismiss,
      snapPoints,
      handleStyle,
      leadingIcon,
      trailingIcon,
      handleIndicatorStyle,
      contentContainerStyle,
    },
    ref
  ) => {
    /***** Refs ******/
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);

    /***** States ******/
    const [isVisible, setIsVisible] = useState(false);

    /***** Memoization ******/
    const hasHeader = useMemo(
      () => leadingIcon || trailingIcon || title,
      [leadingIcon, trailingIcon, title]
    );
    const getFooterBottom = useMemo(() => {
      const largestSnapPoint = snapPoints.reduce((max, point) => {
        return Math.max(max, parseFloat(point));
      }, 0);

      const riseAmount = 100 - largestSnapPoint;
      return riseAmount === 0 ? 0 : `${riseAmount}%`;
    }, [snapPoints]);

    useImperativeHandle(ref, () => ({
      present: () => {
        setIsVisible(true);
        Keyboard.dismiss();
        requestAnimationFrame(() => {
          bottomSheetModalRef.current?.present();
        });
      },
      dismiss: () => {
        bottomSheetModalRef.current?.dismiss();
        setTimeout(() => {
          setIsVisible(false);
        }, 100);
      },
    }));

    const handleSheetChanges = useCallback(
      (index: number) => {
        if (onChange) {
          onChange(index);
        }
      },
      [onChange]
    );
    const handleDismiss = useCallback(() => {
      setIsVisible(false);

      if (onDismiss) {
        onDismiss();
      }
    }, [onDismiss]);

    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          enableTouchThrough={disable}
          pressBehavior={disable ? 'none' : 'close'}
          {...props}
        />
      ),
      [disable]
    );

    if (!isVisible) {
      return null;
    }

    return (
      <BottomSheetModal
        enableOverDrag={false}
        snapPoints={snapPoints}
        handleStyle={handleStyle}
        onDismiss={handleDismiss}
        ref={bottomSheetModalRef}
        onChange={handleSheetChanges}
        enablePanDownToClose={!disable}
        backdropComponent={renderBackdrop}
        enableHandlePanningGesture={!disable}
        enableContentPanningGesture={!disable}
        handleIndicatorStyle={handleIndicatorStyle}>
        <View style={{ flex: 1 }}>
          <BottomSheetScrollView
            bounces={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              flexGrow: 1,
              paddingBottom: footer ? 80 : 0,
            }}>
            {hasHeader ? (
              <View style={styles.headerContainer}>
                <View style={styles.leadingIconContainer}>{leadingIcon}</View>

                {title && (
                  <Text size={24} weight="medium" color="#000000">
                    {title}
                  </Text>
                )}

                <View style={styles.trailingIconContainer}>{trailingIcon}</View>
              </View>
            ) : null}

            <View style={[{ flex: 1 }, contentContainerStyle]}>{children}</View>
          </BottomSheetScrollView>

          {footer && (
            <Animated.View
              exiting={FadeOut}
              entering={FadeIn}
              style={[styles.footerContainer, { bottom: getFooterBottom as any }]}>
              {footer}
            </Animated.View>
          )}
        </View>
      </BottomSheetModal>
    );
  }
);

ModalWrapper.displayName = 'ModalWrapper';
export default ModalWrapper;

const styles = StyleSheet.create({
  container: {
    top: 0,
    left: 0,
    flex: 1,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    position: 'absolute',
  },
  headerContainer: {
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  leadingIconContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },
  trailingIconContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  footerContainer: {
    left: 0,
    right: 0,
    paddingVertical: 16,
    position: 'absolute',
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
  },
});
