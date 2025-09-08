import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import CustomText from '~/src/components/base/text';
import { theme } from '~/src/constants/theme';

interface LoginTabsProps {
  activeTab: 'email' | 'phone';
  onTabChange: (tab: 'email' | 'phone') => void;
}

export default function LoginTabs({ activeTab, onTabChange }: LoginTabsProps) {
  // Create animated values for each tab
  const emailTabProgress = useSharedValue(activeTab === 'email' ? 1 : 0);
  const phoneTabProgress = useSharedValue(activeTab === 'phone' ? 1 : 0);

  // Update animated values when activeTab changes
  React.useEffect(() => {
    emailTabProgress.value = withTiming(activeTab === 'email' ? 1 : 0, {
      duration: 300,
    });
    phoneTabProgress.value = withTiming(activeTab === 'phone' ? 1 : 0, {
      duration: 300,
    });
  }, [activeTab, emailTabProgress, phoneTabProgress]);

  // Animated styles for email tab text
  const emailTextAnimatedStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      emailTabProgress.value,
      [0, 1],
      [theme.colors.lightText, theme.colors.darkText[100]]
    );
    return { color };
  });

  // Animated styles for phone tab text
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
        <CustomText size={14} weight="bold" style={[emailTextAnimatedStyle]}>
          Email
        </CustomText>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tab, activeTab === 'phone' && styles.activeTab]}
        onPress={() => onTabChange('phone')}>
        <CustomText size={14} weight="bold" style={[phoneTextAnimatedStyle]}>
          Phone Number
        </CustomText>
      </TouchableOpacity>
    </View>
  );
}

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
