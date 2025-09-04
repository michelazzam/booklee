import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '../../../../constants/theme';

interface SalonTabsProps {
  activeTab: 'services' | 'about';
  onTabChange: (tab: 'services' | 'about') => void;
}

export default function SalonTabs({ activeTab, onTabChange }: SalonTabsProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'services' && styles.activeTab]}
        onPress={() => onTabChange('services')}>
        <Text style={[styles.tabText, activeTab === 'services' && styles.activeTabText]}>
          Services
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tab, activeTab === 'about' && styles.activeTab]}
        onPress={() => onTabChange('about')}>
        <Text style={[styles.tabText, activeTab === 'about' && styles.activeTabText]}>About</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  tab: {
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.primaryBlue[100],
  },
  tabText: {
    ...theme.typography.textVariants.bodyPrimaryRegular,
    color: theme.colors.lightText,
  },
  activeTabText: {
    ...theme.typography.textVariants.bodyPrimaryBold,
    color: theme.colors.darkText[100],
  },
});
