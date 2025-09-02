import React from 'react';
import { SafeAreaView, SafeAreaViewProps } from 'react-native-safe-area-context';

export default function Wrapper({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: SafeAreaViewProps['style'];
}) {
  return <SafeAreaView style={style}>{children}</SafeAreaView>;
}
