import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { theme } from '~/src/constants/theme';
import { type Service } from '~/src/mock';

import { Icon, Text } from '../base';

type ServicesPreviewProps = {
  data: Service;
  isActive: boolean;
  onPress: (serviceId: string) => void;
};
const ServicesPreview = ({ data, onPress, isActive }: ServicesPreviewProps) => {
  /***** Constants *****/
  const { id, name = '', price = '', duration = '', description = '' } = data;

  return (
    <TouchableOpacity activeOpacity={0.8} style={styles.container} onPress={() => onPress(id)}>
      <View
        style={[
          styles.checkboxContainer,
          { backgroundColor: isActive ? theme.colors.primaryBlue[100] : 'transparent' },
        ]}>
        {isActive && <Icon name="check" size={18} color={theme.colors.white.DEFAULT} />}
      </View>

      <View style={styles.infoContainer}>
        <Text size={theme.typography.fontSizes.md} weight={'bold'}>
          {name}
        </Text>

        {description && (
          <Text size={theme.typography.fontSizes.sm} color={theme.colors.lightText}>
            {description}
          </Text>
        )}
      </View>

      <View style={styles.pricingContainer}>
        <Text size={theme.typography.fontSizes.sm}>{price}</Text>

        <Text size={theme.typography.fontSizes.sm}>{duration}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default ServicesPreview;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    gap: theme.spacing.md,
    alignItems: 'flex-start',
    paddingVertical: theme.spacing.md,
    borderBottomColor: theme.colors.border,
  },
  checkboxContainer: {
    width: 24,
    height: 24,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radii.xs,
    borderColor: theme.colors.primaryBlue[100],
  },
  infoContainer: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  pricingContainer: {
    gap: theme.spacing.xs,
    alignItems: 'flex-end',
  },
});
