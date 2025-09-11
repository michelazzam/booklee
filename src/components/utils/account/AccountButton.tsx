import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../../../constants/theme';
import { IconType } from '~/src/assets/icons/IconType';

interface AccountButtonProps {
  icon: React.ComponentType<IconType>;
  title: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  showChevron?: boolean;
}

export default function AccountButton({
  icon: Icon,
  title,
  onPress,
  variant = 'secondary',
  showChevron = false,
}: AccountButtonProps) {
  const getButtonStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          container: styles.primaryContainer,
          text: styles.primaryText,
          iconColor: theme.colors.primaryGreen[100],
        };
      case 'danger':
        return {
          container: styles.dangerContainer,
          text: styles.dangerText,
          iconColor: theme.colors.red[100],
        };
      default:
        return {
          container: styles.secondaryContainer,
          text: styles.secondaryText,
          iconColor: theme.colors.darkText[100],
        };
    }
  };

  const buttonStyles = getButtonStyles();

  return (
    <TouchableOpacity
      style={[styles.container, buttonStyles.container]}
      onPress={onPress}
      activeOpacity={0.7}>
      <View style={styles.leftContent}>
        <View style={styles.iconContainer}>
          <Icon size={20} color={buttonStyles.iconColor} />
        </View>
        <Text style={[styles.title, buttonStyles.text]}>{title}</Text>
      </View>
      {showChevron && (
        <View style={styles.chevronContainer}>
          <Text style={[styles.chevron, { color: buttonStyles.iconColor }]}>›</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderRadius: theme.radii.lg,
    borderWidth: 1,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    marginRight: theme.spacing.md,
  },
  title: {
    ...theme.typography.textVariants.ctaPrimaryRegular,
    fontWeight: '600',
  },
  chevronContainer: {
    marginLeft: theme.spacing.sm,
  },
  chevron: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  // Primary button styles (Open Business)
  primaryContainer: {
    backgroundColor: theme.colors.primaryGreen[10],
    borderColor: theme.colors.primaryGreen[100],
  },
  primaryText: {
    color: theme.colors.primaryGreen[100],
  },
  // Secondary button styles (Log Out)
  secondaryContainer: {
    backgroundColor: theme.colors.white.DEFAULT,
    borderColor: theme.colors.border,
  },
  secondaryText: {
    color: theme.colors.darkText[100],
  },
  // Danger button styles (Delete Account)
  dangerContainer: {
    backgroundColor: theme.colors.white.DEFAULT,
    borderColor: theme.colors.red[100],
  },
  dangerText: {
    color: theme.colors.red[100],
  },
});
