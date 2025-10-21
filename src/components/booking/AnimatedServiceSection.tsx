import { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
  withSpring,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';

import { Text, Icon } from '../base';
import { ServiceContent } from './ServiceContent';
import { theme } from '~/src/constants/theme';
import type {
  Employee,
  SelectedService,
  ServiceBooking,
  AvailabilityResponse,
} from '~/src/services';

type AnimatedServiceSectionProps = {
  service: SelectedService;
  locationId: string;
  serviceBookings: Record<string, ServiceBooking>;
  hasTimeConflict: (
    date: string,
    time: string,
    duration: number,
    excludeServiceId?: string
  ) => boolean;
  hasProfessionalConflict: (
    professionalId: string,
    date: string,
    time: string,
    duration: number,
    excludeServiceId?: string
  ) => boolean;
  onProfessionalSelect: (serviceId: string, employee: Employee | undefined) => void;
  onTimeSelect: (serviceId: string, time: string, availabilityData: AvailabilityResponse) => void;
  isExpanded: boolean;
  onToggleExpansion: (serviceId: string) => void;
  selectedProfessional: Employee | 'any' | undefined;
  employees: Employee[];
};

export const AnimatedServiceSection = ({
  service,
  locationId,
  serviceBookings,
  hasTimeConflict,
  hasProfessionalConflict,
  onProfessionalSelect,
  onTimeSelect,
  isExpanded,
  onToggleExpansion,
  selectedProfessional,
  employees,
}: AnimatedServiceSectionProps) => {
  const height = useSharedValue(0);
  const opacity = useSharedValue(0);
  const rotation = useSharedValue(0);

  useEffect(() => {
    if (isExpanded) {
      height.value = withSpring(1, { damping: 15, stiffness: 150 });
      opacity.value = withTiming(1, { duration: 300 });
      rotation.value = withTiming(180, { duration: 200 });
    } else {
      height.value = withSpring(0, { damping: 15, stiffness: 150 });
      opacity.value = withTiming(0, { duration: 200 });
      rotation.value = withTiming(0, { duration: 200 });
    }
  }, [isExpanded, height, opacity, rotation]);

  const animatedContentStyle = useAnimatedStyle(() => {
    return {
      height: interpolate(height.value, [0, 1], [0, 650], Extrapolate.CLAMP),
      opacity: opacity.value,
    };
  });

  const animatedChevronStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  return (
    <View style={styles.serviceWrapper}>
      <View style={styles.serviceContainer}>
        {/* Service Header */}
        <TouchableOpacity
          style={styles.serviceHeader}
          onPress={() => onToggleExpansion(service.id)}
          activeOpacity={0.8}>
          <View style={styles.serviceHeaderContent}>
            <View style={styles.serviceInfo}>
              <Text size={theme.typography.fontSizes.lg} weight="medium">
                {service.name}
              </Text>
              <Text size={theme.typography.fontSizes.sm} color={theme.colors.darkText['50']}>
                {service.duration} minutes • ${service.price}
              </Text>
            </View>
            <Animated.View style={animatedChevronStyle}>
              <Icon name="chevron-down" size={20} color={theme.colors.darkText['100']} />
            </Animated.View>
          </View>
        </TouchableOpacity>

        <Animated.View style={[styles.serviceContent, animatedContentStyle]}>
          <ServiceContent
            service={service}
            locationId={locationId}
            serviceBookings={serviceBookings}
            hasTimeConflict={hasTimeConflict}
            hasProfessionalConflict={hasProfessionalConflict}
            onProfessionalSelect={onProfessionalSelect}
            onTimeSelect={(serviceId, time, availabilityData) => {
              onTimeSelect(serviceId, time, availabilityData);
              // Auto-collapse the service section after selecting a time
              if (time) {
                onToggleExpansion(serviceId);
              }
            }}
            selectedProfessional={selectedProfessional}
            employees={employees}
          />
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  serviceWrapper: {
    marginBottom: theme.spacing.md,
    // iOS Shadows
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    // Android Shadows
    elevation: 4,
  },
  serviceContainer: {
    backgroundColor: theme.colors.white.DEFAULT,
    borderRadius: theme.radii.lg,
    overflow: 'hidden',
  },
  serviceHeader: {
    padding: theme.spacing.lg,
  },
  serviceHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  serviceInfo: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  serviceContent: {
    paddingBottom: theme.spacing.lg,
    overflow: 'hidden',
  },
});
