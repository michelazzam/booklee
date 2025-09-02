import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { CustomText } from '~/components/CustomText';
import { theme } from '~/theme/Main';

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
        <CustomText
          variant="bodyPrimaryBold"
          style={[styles.tabText, activeTab === 'email' && styles.activeTabText]}>
          Email
        </CustomText>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tab, activeTab === 'phone' && styles.activeTab]}
        onPress={() => onTabChange('phone')}>
        <CustomText
          variant="bodyPrimaryBold"
          style={[styles.tabText, activeTab === 'phone' && styles.activeTabText]}>
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
  tabText: {
    color: theme.colors.lightText,
  },
  activeTabText: {
    color: theme.colors.darkText[100],
  },
});
