import React, { FC } from 'react';
import { View, ViewStyle } from 'react-native';
import { SafeAreaViewProps } from 'react-native-safe-area-context';
import { useAppSafeAreaInsets } from '~/src/hooks';

interface WrapperProps {
  children: React.ReactNode;
  style?: SafeAreaViewProps['style'];
  withTop?: boolean;
  withBottom?: boolean;
}

const Wrapper: FC<WrapperProps> = ({ children, style, withTop = true, withBottom = false }) => {
  const { top, bottom } = useAppSafeAreaInsets();

  const safeAreaStyle: ViewStyle = {
    ...(withTop && { paddingTop: top }),
    ...(withBottom && { paddingBottom: bottom }),
  };

  return <View style={[style, safeAreaStyle]}>{children}</View>;
};

export default Wrapper;
