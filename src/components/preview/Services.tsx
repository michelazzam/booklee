import { useMemo } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { theme } from '~/src/constants/theme';
import { type LocationServiceType } from '~/src/services/locations/types';

import { Icon, Text } from '../base';

type ServicesPreviewProps = {
  isActive: boolean;
  disabled?: boolean;
  data: LocationServiceType;
  onPress: (serviceId: string) => void;
};
const ServicesPreview = ({ data, onPress, isActive, disabled = false }: ServicesPreviewProps) => {
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
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled}
      onPress={() => onPress(id)}
      style={[styles.container, disabled && { opacity: 0.5 }]}>
      <View style={styles.infoContainer}>
        <View
          style={[
            styles.checkboxContainer,
            { backgroundColor: isActive ? theme.colors.darkText[100] : 'transparent' },
          ]}>
          {isActive && <Icon name="check" size={18} color={theme.colors.white.DEFAULT} />}
        </View>

        <View style={{ gap: theme.spacing.xs }}>
          <Text
            size={theme.typography.fontSizes.sm}
            weight={isActive ? 'medium' : 'regular'}
            numberOfLines={1}>
            {service?.name ?? ''}
          </Text>

          {service?.description && (
            <Text
              numberOfLines={2}
              color={theme.colors.lightText}
              size={theme.typography.fontSizes.xs}
              weight={isActive ? 'medium' : 'regular'}>
              {service?.description}
            </Text>
          )}
        </View>
      </View>

      <View style={styles.pricingContainer}>
        <Text size={theme.typography.fontSizes.sm} weight={isActive ? 'medium' : 'regular'}>
          {formatPrice}
        </Text>

        <Text
          size={theme.typography.fontSizes.sm}
          weight={isActive ? 'medium' : 'regular'}>{`${duration} min`}</Text>
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
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radii.xs,
    borderColor: theme.colors.darkText[100],
  },
  infoContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  pricingContainer: {
    gap: theme.spacing.xs,
    alignItems: 'flex-end',
  },
  serviceNameContainer: {
    gap: theme.spacing.xs,
    backgroundColor: 'red',
  },
});
