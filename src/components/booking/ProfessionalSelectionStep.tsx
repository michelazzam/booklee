import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useState, useMemo } from 'react';
import Animated, { FadeIn, FadeOut, useAnimatedStyle, withTiming } from 'react-native-reanimated';

import { theme } from '~/src/constants/theme';
import { Text } from '../base';
import { AppointmentServices } from '~/src/services';
import type { Employee, SelectedService } from '~/src/services';
import { CoupleIcon, GroupIcon, StarIcon } from '~/src/assets/icons';

type AnimatedButtonProps = {
  style?: any;
  isSelected?: boolean;
  onPress?: () => void;
  children: React.ReactNode;
};

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);
const AnimatedButton = ({ style, onPress, children, isSelected = false }: AnimatedButtonProps) => {
  /*** Animations ***/
  const animatedStyle = useAnimatedStyle(() => {
    return {
      borderColor: withTiming(isSelected ? theme.colors.darkText['100'] : theme.colors.border, {
        duration: 300,
      }),
      transform: [
        {
          scale: withTiming(isSelected ? 1.02 : 1, { duration: 300 }),
        },
      ],
    };
  });

  return (
    <AnimatedTouchableOpacity onPress={onPress} activeOpacity={0.8} style={[style, animatedStyle]}>
      {children}
    </AnimatedTouchableOpacity>
  );
};

type ProfessionalSelectionStepProps = {
  locationId: string;
  selectedServices: SelectedService[];
  selectedEmployeesByService?: Record<string, Employee | undefined>;
  onEmployeeSelect: (serviceId: string, employee?: Employee) => void;
  onOptionChosen?: (chosen: boolean) => void;
};

const ProfessionalSelectionStep = ({
  locationId,
  selectedServices,
  selectedEmployeesByService,
  onEmployeeSelect,
  onOptionChosen,
}: ProfessionalSelectionStepProps) => {
  const { data: bookingData } = AppointmentServices.useGetLocationBookingData(locationId);
  const employees = useMemo(
    () => bookingData?.data?.employees || [],
    [bookingData?.data?.employees]
  );

  // UI state: initially only show the two options; reveal details if user chooses to select professional
  const [showDetailedSelection, setShowDetailedSelection] = useState(false);
  const [selectedOption, setSelectedOption] = useState<'any' | 'specific' | undefined>(undefined);

  // Group employees by selected services
  const employeesByService = useMemo(
    () =>
      selectedServices.map((service) => {
        const serviceEmployees = employees.filter((employee) =>
          employee.serviceIds.includes(service.id)
        );
        return {
          service,
          employees: serviceEmployees,
        };
      }),
    [selectedServices, employees]
  );

  return (
    <View style={styles.container}>
      <View style={styles.optionsContainer}>
        {/* Any Professional Option */}
        <AnimatedButton
          style={styles.optionCard}
          isSelected={selectedOption === 'any'}
          onPress={() => {
            // For each selected service, pick a random employee who can perform it.
            // If none found, fall back to any random employee.
            selectedServices.forEach((service) => {
              const serviceEmployees = employees.filter((emp) =>
                emp.serviceIds.includes(service.id)
              );
              const pool = serviceEmployees.length > 0 ? serviceEmployees : employees;
              const random =
                pool.length > 0 ? pool[Math.floor(Math.random() * pool.length)] : undefined;
              onEmployeeSelect(service.id, random);
            });
            // Keep the details hidden; user can proceed with Next
            setShowDetailedSelection(false);
            setSelectedOption('any');
            onOptionChosen?.(true);
          }}>
          <View style={styles.optionIconContainer}>
            <GroupIcon />
          </View>
          <Text size={theme.typography.fontSizes.md} weight="semiBold" style={styles.optionTitle}>
            Any Professional
          </Text>
          <Text
            size={theme.typography.fontSizes.xs}
            color={theme.colors.darkText['50']}
            style={styles.optionSubtitle}>
            for maximum availability
          </Text>
        </AnimatedButton>

        {/* Specific Professional Option */}
        <AnimatedButton
          isSelected={selectedOption === 'specific'}
          style={styles.optionCard}
          onPress={() => {
            setShowDetailedSelection(true);
            setSelectedOption('specific');
            onOptionChosen?.(true);
          }}>
          <View style={styles.optionIconContainer}>
            <CoupleIcon />
          </View>
          <Text size={theme.typography.fontSizes.md} weight="semiBold" style={styles.optionTitle}>
            Select professional
          </Text>
          <Text
            size={theme.typography.fontSizes.xs}
            color={theme.colors.darkText['50']}
            style={styles.optionSubtitle}>
            per service
          </Text>
        </AnimatedButton>
      </View>

      {/* Professional List Grouped by Services */}
      {showDetailedSelection && (
        <Animated.View
          exiting={FadeOut.duration(200)}
          entering={FadeIn.duration(200)}
          style={{ gap: theme.spacing.xl }}>
          {employeesByService.map(({ service, employees: serviceEmployees }) => (
            <View key={service.id} style={styles.serviceSection}>
              <Text
                size={theme.typography.fontSizes.lg}
                weight="medium"
                style={styles.serviceTitle}>
                {service.name.toUpperCase()}
              </Text>

              {serviceEmployees.length > 0 ? (
                <View style={styles.professionalsGrid}>
                  {/* Anyone option for this service */}
                  <AnimatedButton
                    isSelected={!selectedEmployeesByService?.[service.id]}
                    style={styles.professionalCard}
                    onPress={() => onEmployeeSelect(service.id, undefined)}>
                    <View style={styles.professionalIconContainer}>
                      <GroupIcon />
                    </View>
                    <Text
                      size={theme.typography.fontSizes.sm}
                      weight="semiBold"
                      style={styles.professionalName}>
                      Anyone
                    </Text>
                  </AnimatedButton>

                  {serviceEmployees.map((employee) => {
                    // Generate different avatar background colors
                    const avatarColors = ['#4A882E26', '#41637526', '#269FDF26'];
                    const colorIndex = employee.name.length % avatarColors.length;
                    const avatarBgColor = avatarColors[colorIndex];

                    return (
                      <AnimatedButton
                        key={`${service.id}-${employee._id}`}
                        isSelected={selectedEmployeesByService?.[service.id]?._id === employee._id}
                        style={styles.professionalCard}
                        onPress={() => onEmployeeSelect(service.id, employee)}>
                        <View
                          style={[styles.professionalAvatar, { backgroundColor: avatarBgColor }]}>
                          <Text size={theme.typography.fontSizes.lg} weight="bold">
                            {employee.name.charAt(0).toUpperCase()}
                          </Text>
                        </View>

                        <View style={styles.ratingContainer}>
                          <StarIcon width={20} height={20} />
                          <Text size={theme.typography.fontSizes.xs} weight="medium">
                            {employee.rating}
                          </Text>
                        </View>

                        <Text
                          size={theme.typography.fontSizes.sm}
                          weight="semiBold"
                          style={styles.professionalName}>
                          {employee.name}
                        </Text>
                        <Text
                          size={theme.typography.fontSizes.xs}
                          color={theme.colors.darkText['50']}
                          style={styles.professionalTitle}>
                          {employee.specialties[0] || 'Professional'}
                        </Text>
                      </AnimatedButton>
                    );
                  })}
                </View>
              ) : (
                <Text
                  size={theme.typography.fontSizes.sm}
                  color={theme.colors.darkText['50']}
                  style={styles.noEmployeesText}>
                  No professionals available for this service
                </Text>
              )}
            </View>
          ))}
        </Animated.View>
      )}
    </View>
  );
};

export default ProfessionalSelectionStep;

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.xl,
    marginVertical: theme.spacing.md,
  },

  optionsContainer: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  optionCard: {
    flex: 1,
    alignItems: 'center',
    padding: theme.spacing.lg,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.white.DEFAULT,
    minHeight: 200,
    justifyContent: 'center',
  },
  optionIconContainer: {
    marginBottom: theme.spacing.xl,
  },
  optionTitle: {
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  optionSubtitle: {
    textAlign: 'center',
  },
  professionalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
    justifyContent: 'space-between',
  },
  professionalCard: {
    alignItems: 'center',
    padding: theme.spacing.md,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.white.DEFAULT,
    width: '48%',
    minHeight: 200,
    justifyContent: 'center',
  },
  professionalAvatar: {
    width: 50,
    height: 50,
    borderRadius: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  professionalIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
  },
  professionalName: {
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  professionalTitle: {
    textAlign: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginBottom: theme.spacing.lg,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.radii.md,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
  },
  serviceSection: {
    gap: theme.spacing.md,
  },
  serviceTitle: {
    color: theme.colors.darkText['100'],
    letterSpacing: 0.5,
  },
  noEmployeesText: {
    textAlign: 'center',
    fontStyle: 'italic',
    paddingVertical: theme.spacing.lg,
  },
});
