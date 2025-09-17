import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import React from 'react';

import { useAppSafeAreaInsets } from '~/src/hooks';

import { ArrowLeftIcon } from '~/src/assets/icons';

type BaseHeaderNavigationProps = {
  children: React.ReactNode;
};
const BaseHeaderNavigation = ({ children }: BaseHeaderNavigationProps) => {
  /*** Constants ***/
  const { top } = useAppSafeAreaInsets();

  return <View style={[styles.componentStyle, { paddingTop: top }]}>{children}</View>;
};

export { BaseHeaderNavigation };

type HeaderNavigationProps = {
  title?: string;
  color?: string;
  showBackButton?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
};
const HeaderNavigation = ({
  title,
  leftIcon,
  rightIcon,
  color = '#000000',
  showBackButton = true,
}: HeaderNavigationProps) => {
  /*** Constants ***/
  const router = useRouter();

  return (
    <BaseHeaderNavigation>
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.iconContainer}
        onPress={() => router.back()}>
        {leftIcon ?? (showBackButton ? <ArrowLeftIcon /> : null)}
      </TouchableOpacity>

      <Text numberOfLines={1} style={[styles.title, { color }]}>
        {title}
      </Text>

      <View style={styles.iconContainer}>{rightIcon}</View>
    </BaseHeaderNavigation>
  );
};

export default HeaderNavigation;

const styles = StyleSheet.create({
  componentStyle: {
    width: '100%',
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  iconContainer: {
    height: 32,
    minWidth: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '500',
    fontFamily: 'Montserrat-Medium',
  },
});
