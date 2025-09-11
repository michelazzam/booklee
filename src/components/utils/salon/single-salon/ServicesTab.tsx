import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '../../../../constants/theme';
import { ServiceCategory } from '../../../../mock/homeScreen/types';
import Svg, { Path } from 'react-native-svg';

interface ServicesTabProps {
  serviceCategories: ServiceCategory[];
  selectedServices: string[];
  onServiceToggle: (serviceId: string) => void;
}

const CheckboxIcon = ({ checked }: { checked: boolean }) => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    {checked ? (
      <Path
        d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
        fill={theme.colors.primaryBlue[100]}
      />
    ) : (
      <Path
        d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"
        stroke={theme.colors.border}
        strokeWidth={2}
        fill="none"
      />
    )}
  </Svg>
);

export default function ServicesTab({
  serviceCategories,
  selectedServices,
  onServiceToggle,
}: ServicesTabProps) {
  return (
    <View style={styles.container}>
      {serviceCategories.map((category) => (
        <View key={category.id} style={styles.categoryContainer}>
          <Text style={styles.categoryTitle}>{category.name}</Text>

          {category.services.map((service) => (
            <TouchableOpacity
              key={service.id}
              style={styles.serviceItem}
              onPress={() => onServiceToggle(service.id)}
              activeOpacity={0.7}>
              <CheckboxIcon checked={selectedServices.includes(service.id)} />

              <View style={styles.serviceInfo}>
                <Text style={styles.serviceName}>{service.name}</Text>
                {service.description && (
                  <Text style={styles.serviceDescription}>{service.description}</Text>
                )}
              </View>

              <View style={styles.servicePricing}>
                <Text style={styles.servicePrice}>{service.price}</Text>
                <Text style={styles.serviceDuration}>{service.duration}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: theme.spacing.lg,
  },
  categoryContainer: {
    marginBottom: theme.spacing.xl,
  },
  categoryTitle: {
    ...theme.typography.textVariants.bodyPrimaryBold,
    color: theme.colors.darkText[100],
    marginBottom: theme.spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    gap: theme.spacing.md,
  },
  serviceInfo: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  serviceName: {
    ...theme.typography.textVariants.bodyPrimaryRegular,
    color: theme.colors.darkText[100],
  },
  serviceDescription: {
    ...theme.typography.textVariants.bodySecondaryRegular,
    color: theme.colors.lightText,
    lineHeight: 16,
  },
  servicePricing: {
    alignItems: 'flex-end',
    gap: theme.spacing.xs,
  },
  servicePrice: {
    ...theme.typography.textVariants.bodySecondaryBold,
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.darkText[100],
  },
  serviceDuration: {
    ...theme.typography.textVariants.bodyTertiaryRegular,
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.lightText,
  },
});
