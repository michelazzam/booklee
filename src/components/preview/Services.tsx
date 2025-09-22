import { useMemo } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { theme } from '~/src/constants/theme';
import { type LocationServiceType } from '~/src/services/locations/types';

import { Icon, Text } from '../base';

type ServicesPreviewProps = {
  isActive: boolean;
  data: LocationServiceType;
  onPress: (serviceId: string) => void;
};
const ServicesPreview = ({ data, onPress, isActive }: ServicesPreviewProps) => {
  /***** Constants *****/
  const { id, service, price, duration } = data;

  const formatPrice = useMemo(() => {
    if (price.type === 'fixed') {
      return `$${price.value}`;
    }
    if (price.type === 'range') {
      return `$${price.min} - $${price.max}`;
    }
    if (price.type === 'starting') {
      return `Starting from $${price.value}`;
    }
    return `$${price.value}`;
  }, [price]);

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
          {service?.name ?? ''}
        </Text>
      </View>

      <View style={styles.pricingContainer}>
        <Text size={theme.typography.fontSizes.sm}>{formatPrice}</Text>

        <Text size={theme.typography.fontSizes.sm}>{`${duration} min`}</Text>
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
