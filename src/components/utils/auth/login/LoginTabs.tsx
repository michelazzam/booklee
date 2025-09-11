import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { FC, useEffect } from 'react';
import {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { theme } from '~/src/constants/theme';

import { Text } from '~/src/components/base';

interface LoginTabsProps {
  activeTab: 'email' | 'phone';
  onTabChange: (tab: 'email' | 'phone') => void;
}

const LoginTabs: FC<LoginTabsProps> = ({ activeTab, onTabChange }) => {
  const emailTabProgress = useSharedValue(activeTab === 'email' ? 1 : 0);
  const phoneTabProgress = useSharedValue(activeTab === 'phone' ? 1 : 0);

  useEffect(() => {
    emailTabProgress.value = withTiming(activeTab === 'email' ? 1 : 0, {
      duration: 300,
    });
    phoneTabProgress.value = withTiming(activeTab === 'phone' ? 1 : 0, {
      duration: 300,
    });
  }, [activeTab, emailTabProgress, phoneTabProgress]);

  const emailTextAnimatedStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      emailTabProgress.value,
      [0, 1],
      [theme.colors.lightText, theme.colors.darkText[100]]
    );
    return { color };
  });

  const phoneTextAnimatedStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      phoneTabProgress.value,
      [0, 1],
      [theme.colors.lightText, theme.colors.darkText[100]]
    );
    return { color };
  });

  return (
    <View style={styles.tabsContainer}>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'email' && styles.activeTab]}
        onPress={() => onTabChange('email')}>
        <Text size={14} weight="bold" style={[emailTextAnimatedStyle]}>
          Email
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tab, activeTab === 'phone' && styles.activeTab]}
        onPress={() => onTabChange('phone')}>
        <Text size={14} weight="bold" style={[phoneTextAnimatedStyle]}>
          Phone Number
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginTabs;

const styles = StyleSheet.create({
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.darkText[100],
  },
});
