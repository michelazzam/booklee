import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '~/src/constants/theme';

import { Text } from '~/src/components/base';

interface LoginTabsProps {
  activeTab: 'email' | 'phone';
  onTabChange: (tab: 'email' | 'phone') => void;
}

export default function LoginTabs({ activeTab, onTabChange }: LoginTabsProps) {
  return (
    <View style={styles.tabsContainer}>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'email' && styles.activeTab]}
        onPress={() => onTabChange('email')}>
        <Text
          size={14}
          weight="bold"
          style={[styles.tabText, activeTab === 'email' && styles.activeTabText]}>
          Email
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tab, activeTab === 'phone' && styles.activeTab]}
        onPress={() => onTabChange('phone')}>
        <Text
          size={14}
          weight="bold"
          style={[styles.tabText, activeTab === 'phone' && styles.activeTabText]}>
          Phone Number
        </Text>
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
  tabText: {
    color: theme.colors.lightText,
  },
  activeTabText: {
    color: theme.colors.darkText[100],
  },
});
