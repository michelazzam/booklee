import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useState, useMemo } from 'react';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

import { theme } from '~/src/constants/theme';
import { Text } from '../base';
import type { Employee, SelectedService, AvailabilityResponse } from '~/src/services';
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
  service: SelectedService;
  availabilityData?: AvailabilityResponse;
  selectedEmployee?: Employee;
  onEmployeeSelect: (employee?: Employee) => void;
  onOptionChosen?: (chosen: boolean) => void;
};

const ProfessionalSelectionStep = ({
  locationId,
  service,
  availabilityData,
  selectedEmployee,
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

  // Get available employees from availability data
  const availableEmployees = useMemo(() => {
    if (!availabilityData) return [];

    const locationData = availabilityData.locationData?.[locationId];
    if (!locationData) return [];

    // Filter employees who are available for the selected time slot
    return locationData.employees.filter((employee) => {
      // Check if employee can perform this service
      if (!employee.serviceIds.includes(service.id)) return false;

      // Check if employee is available (has at least one slot where they're available)
      const hasAvailableSlots = availabilityData.availability.slots.some(
        (slot) => slot.isAvailable && slot.availableEmployeeIds.includes(employee._id)
      );

      return hasAvailableSlots;
    });
  }, [availabilityData, locationId, service.id]);

  return (
    <View style={styles.container}>
      <View style={styles.optionsContainer}>
        {/* Any Professional Option */}
        <AnimatedButton
          style={styles.optionCard}
          isSelected={selectedOption === 'any'}
          onPress={() => {
            // Select any available employee for the service
            const serviceEmployees = employees.filter((emp) => emp.serviceIds.includes(service.id));
            const pool = serviceEmployees.length > 0 ? serviceEmployees : employees;
            const random =
              pool.length > 0 ? pool[Math.floor(Math.random() * pool.length)] : undefined;
            onEmployeeSelect(random);
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

      {/* Professional List for Current Service */}
      {showDetailedSelection && (
        <View style={styles.serviceSection}>
          <Text size={theme.typography.fontSizes.lg} weight="medium" style={styles.serviceTitle}>
            {service.name.toUpperCase()}
          </Text>

          {availableEmployees.length > 0 ? (
            <View style={styles.professionalsGrid}>
              {/* Anyone option for this service */}
              <TouchableOpacity
                style={[
                  styles.professionalCard,
                  !selectedEmployee && styles.professionalCardSelected,
                ]}
                onPress={() => onEmployeeSelect(undefined)}>
                <View style={styles.professionalIconContainer}>
                  <GroupIcon />
                </View>
                <Text
                  size={theme.typography.fontSizes.sm}
                  weight="semiBold"
                  style={styles.professionalName}>
                  Anyone
                </Text>
                <Text
                  size={theme.typography.fontSizes.xs}
                  color={theme.colors.darkText['50']}
                  style={styles.professionalTitle}>
                  {availableEmployees.length} available
                </Text>
              </TouchableOpacity>

              {availableEmployees.map((employee) => {
                // Generate different avatar background colors
                const avatarColors = ['#4A882E26', '#41637526', '#269FDF26'];
                const colorIndex = employee.name.length % avatarColors.length;
                const avatarBgColor = avatarColors[colorIndex];

                return (
                  <TouchableOpacity
                    key={employee._id}
                    style={[
                      styles.professionalCard,
                      selectedEmployee?._id === employee._id && styles.professionalCardSelected,
                    ]}
                    onPress={() => onEmployeeSelect(employee)}>
                    <View style={[styles.professionalAvatar, { backgroundColor: avatarBgColor }]}>
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
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : (
            <Text
              size={theme.typography.fontSizes.sm}
              color={theme.colors.darkText['50']}
              style={styles.noEmployeesText}>
              No professionals available for the selected time
            </Text>
          )}
        </View>
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
  professionalCardSelected: {
    borderColor: theme.colors.darkText['100'],
  },
  professionalAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
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
