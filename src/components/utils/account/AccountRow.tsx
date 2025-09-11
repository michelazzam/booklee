import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../../../constants/theme';
import { ChevronRightIcon } from '~/src/assets/icons';
import { IconType } from '~/src/assets/icons/IconType';
import VerificationBadge from './VerificationBadge';

interface AccountRowProps {
  icon: React.ComponentType<IconType>;
  title: string;
  subtitle?: string;
  badge?: string;
  badgeVerified?: boolean;
  onPress?: () => void;
  showChevron?: boolean;
  iconColor?: string;
  titleColor?: string;
  subtitleColor?: string;
}

export default function AccountRow({
  icon: Icon,
  title,
  subtitle,
  badge,
  badgeVerified = false,
  onPress,
  showChevron = true,
  iconColor = theme.colors.darkText[100],
  titleColor = theme.colors.darkText[100],
  subtitleColor = theme.colors.lightText,
}: AccountRowProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress}>
      <View style={styles.leftContent}>
        <View style={styles.iconContainer}>
          <Icon size={20} color={iconColor} />
        </View>
        <View style={styles.textContainer}>
          <View style={styles.titleRow}>
            <Text style={[styles.title, { color: titleColor }]}>{title}</Text>
            {badge && <VerificationBadge text={badge} verified={badgeVerified} />}
          </View>
          {subtitle && <Text style={[styles.subtitle, { color: subtitleColor }]}>{subtitle}</Text>}
        </View>
      </View>
      {showChevron && <ChevronRightIcon size={16} color={theme.colors.lightText} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.sm,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    marginRight: theme.spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  title: {
    ...theme.typography.textVariants.bodyPrimaryRegular,
  },
  subtitle: {
    ...theme.typography.textVariants.bodySecondaryRegular,
  },
});
