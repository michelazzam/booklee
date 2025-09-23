import { View, StyleSheet, TouchableOpacity } from 'react-native';

import { theme } from '~/src/constants/theme';
import { Text, Icon } from '../base';
import { AppointmentServices } from '~/src/services';
import type { Employee, SelectedService } from '~/src/services';

type ProfessionalSelectionStepProps = {
  locationId: string;
  selectedServices: SelectedService[];
  selectedEmployee?: Employee;
  onEmployeeSelect: (employee?: Employee) => void;
};

const ProfessionalSelectionStep = ({
  locationId,
  selectedServices,
  selectedEmployee,
  onEmployeeSelect,
}: ProfessionalSelectionStepProps) => {
  const { data: bookingData } = AppointmentServices.useGetLocationBookingData(locationId);
  const employees = bookingData?.data?.employees || [];

  // Group employees by selected services
  const employeesByService = selectedServices.map((service) => {
    const serviceEmployees = employees.filter((employee) =>
      employee.serviceIds.includes(service.id)
    );
    return {
      service,
      employees: serviceEmployees,
    };
  });

  return (
    <View style={styles.container}>
      <View style={styles.optionsContainer}>
        {/* Any Professional Option */}
        <TouchableOpacity
          style={[styles.optionCard, !selectedEmployee && styles.optionCardSelected]}
          onPress={() => onEmployeeSelect(undefined)}>
          <View style={styles.optionIconContainer}>
            <Icon name="account" size={24} color={theme.colors.primaryBlue['100']} />
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
        </TouchableOpacity>

        {/* Specific Professional Option */}
        <TouchableOpacity
          style={[styles.optionCard, selectedEmployee && styles.optionCardSelected]}
          onPress={() => {
            // If already selected, keep the selection; otherwise show professionals
            if (!selectedEmployee && employees.length > 0) {
              onEmployeeSelect(employees[0]);
            }
          }}>
          <View style={styles.optionIconContainer}>
            <Icon name="account" size={24} color={theme.colors.primaryBlue['100']} />
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
        </TouchableOpacity>
      </View>

      {/* Professional List Grouped by Services */}
      {employeesByService.map(({ service, employees: serviceEmployees }) => (
        <View key={service.id} style={styles.serviceSection}>
          <Text size={theme.typography.fontSizes.lg} weight="medium" style={styles.serviceTitle}>
            {service.name.toUpperCase()}
          </Text>

          {serviceEmployees.length > 0 ? (
            <View style={styles.professionalsGrid}>
              {/* Anyone option for this service */}
              <TouchableOpacity
                style={[
                  styles.professionalCard,
                  !selectedEmployee && styles.professionalCardSelected,
                ]}
                onPress={() => onEmployeeSelect(undefined)}>
                <View style={styles.professionalIconContainer}>
                  <Icon name="account" size={24} color={theme.colors.primaryBlue['100']} />
                </View>
                <Text
                  size={theme.typography.fontSizes.sm}
                  weight="semiBold"
                  style={styles.professionalName}>
                  Anyone
                </Text>
              </TouchableOpacity>

              {serviceEmployees.map((employee) => {
                // Generate different avatar background colors
                const avatarColors = ['#4F46E5', '#06B6D4', '#10B981', '#F59E0B', '#EF4444'];
                const colorIndex = employee._id.length % avatarColors.length;
                const avatarBgColor = avatarColors[colorIndex];

                return (
                  <TouchableOpacity
                    key={`${service.id}-${employee._id}`}
                    style={[
                      styles.professionalCard,
                      selectedEmployee?._id === employee._id && styles.professionalCardSelected,
                    ]}
                    onPress={() => onEmployeeSelect(employee)}>
                    <View style={[styles.professionalAvatar, { backgroundColor: avatarBgColor }]}>
                      <Text
                        size={theme.typography.fontSizes.lg}
                        weight="bold"
                        color={theme.colors.white.DEFAULT}>
                        {employee.name.charAt(0).toUpperCase()}
                      </Text>
                    </View>

                    <View style={styles.ratingContainer}>
                      <Icon name="star" size={12} color="#FFD700" />
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
              No professionals available for this service
            </Text>
          )}
        </View>
      ))}
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
    minHeight: 120,
    justifyContent: 'center',
  },
  optionCardSelected: {
    borderColor: theme.colors.primaryBlue['100'],
    backgroundColor: theme.colors.primaryBlue['10'],
  },
  optionIconContainer: {
    marginBottom: theme.spacing.sm,
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
    minHeight: 140,
    justifyContent: 'center',
  },
  professionalCardSelected: {
    borderColor: theme.colors.primaryBlue['100'],
    backgroundColor: theme.colors.primaryBlue['10'],
  },
  professionalAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.xs,
  },
  professionalIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.xs,
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
    marginBottom: theme.spacing.xs,
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
