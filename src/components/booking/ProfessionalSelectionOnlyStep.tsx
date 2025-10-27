import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useEffect } from 'react';
import { Text } from '../base';
import { theme } from '~/src/constants/theme';
import { GroupIcon, StarIcon } from '~/src/assets/icons';
import type { SelectedService, ServiceBooking, Employee } from '~/src/services';
import { AppointmentServices } from '~/src/services';

type ProfessionalSelectionOnlyStepProps = {
  selectedServices: SelectedService[];
  locationId: string;
  serviceBookings: Record<string, ServiceBooking>;
  onEmployeeSelect: (serviceId: string, employee: Employee | undefined) => void;
  hasProfessionalConflict: (
    professionalId: string,
    date: string,
    time: string,
    duration: number,
    excludeServiceId?: string
  ) => boolean;
};

// Check if a professional is busy at the given time
const isProfessionalBusy = (
  employeeId: string,
  date: string,
  time: string,
  duration: number,
  availabilityData?: any
): boolean => {
  if (!availabilityData?.availability?.busy) return false;

  const busyTimes = availabilityData.availability.busy[employeeId];
  if (!busyTimes || busyTimes.length === 0) return false;

  const slotStart = `${date}T${time}:00`;
  const slotEnd = new Date(new Date(slotStart).getTime() + duration * 60 * 1000).toISOString();

  return busyTimes.some((busyTime: any) => {
    const busyStart = busyTime.start;
    const busyEnd = busyTime.end;
    // Check if there's overlap
    return slotStart < busyEnd && slotEnd > busyStart;
  });
};

export const ProfessionalSelectionOnlyStep = ({
  selectedServices,
  locationId,
  serviceBookings,
  onEmployeeSelect,
  hasProfessionalConflict,
}: ProfessionalSelectionOnlyStepProps) => {
  const { data: locationBookingData } = AppointmentServices.useGetLocationBookingData(locationId);

  // Get selected date (same for all services)
  const selectedDate = serviceBookings[selectedServices[0]?.id]?.selectedDate || '';

  // Fetch availability data for the first service (since they all share the same date)
  const firstService = selectedServices[0];
  const availabilityQuery = AppointmentServices.useGetAvailabilities(
    locationId,
    selectedDate,
    firstService?.id || '',
    firstService?.duration || 0,
    !!selectedDate && !!firstService
  );
  const availabilityData = availabilityQuery?.data;

  // Get employees for each service
  const serviceEmployees = selectedServices.reduce(
    (acc, service) => {
      const employees =
        locationBookingData?.data?.employees?.filter((emp: any) =>
          emp.serviceIds.includes(service.id)
        ) || [];
      acc[service.id] = employees;
      return acc;
    },
    {} as Record<string, Employee[]>
  );

  // Default to "Any Available" for services without a selected professional on mount
  useEffect(() => {
    selectedServices.forEach((service) => {
      const booking = serviceBookings[service.id];

      // Only set to "Any Available" (undefined) if there's no employee and we have date/time
      if (!booking?.selectedEmployee && booking?.selectedDate && booking?.selectedTime) {
        onEmployeeSelect(service.id, undefined);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderProfessionalOptions = (service: SelectedService) => {
    const allEmployees = serviceEmployees[service.id] || [];
    const booking = serviceBookings[service.id];
    const selectedEmployee = booking?.selectedEmployee;
    const selectedDate = booking?.selectedDate;
    const selectedTime = booking?.selectedTime;

    // Filter to only show available employees
    const availableEmployees = allEmployees.filter((employee) => {
      // Check if professional has booking conflict with other services in this booking
      const hasBookingConflict =
        selectedDate && selectedTime
          ? hasProfessionalConflict(
              employee._id,
              selectedDate,
              selectedTime,
              service.duration,
              service.id
            )
          : false;

      // Check if professional is busy at the selected time
      const isBusy =
        selectedDate && selectedTime
          ? isProfessionalBusy(
              employee._id,
              selectedDate,
              selectedTime,
              service.duration,
              availabilityData
            )
          : false;

      // Only show if available (no conflicts)
      return !hasBookingConflict && !isBusy;
    });

    return (
      <View key={service.id} style={styles.serviceSection}>
        {/* Service Header with Duration */}
        <View style={styles.serviceHeader}>
          <Text size={theme.typography.fontSizes.lg} weight="semiBold">
            {service.name}{' '}
            <Text size={theme.typography.fontSizes.md} color={theme.colors.darkText['50']}>
              ({service.duration} min)
            </Text>
          </Text>
        </View>

        {availableEmployees.length === 0 ? (
          <View style={styles.noEmployeesContainer}>
            <Text
              size={theme.typography.fontSizes.md}
              color={theme.colors.darkText['50']}
              style={styles.noEmployeesText}>
              No professionals available at this time
            </Text>
            <Text
              size={theme.typography.fontSizes.sm}
              color={theme.colors.darkText['50']}
              style={styles.noEmployeesSubtext}>
              Please select a different time or choose &quot;Anyone&quot; to automatically assign an
              available professional
            </Text>
          </View>
        ) : (
          <View style={styles.professionalGrid}>
            {/* Any Available Professional Option */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={[
                styles.professionalCard,
                selectedEmployee === undefined && styles.selectedProfessionalCard,
              ]}
              onPress={() => onEmployeeSelect(service.id, undefined)}>
              <View style={styles.avatarCircle}>
                <GroupIcon width={24} height={24} color={theme.colors.darkText['100']} />
              </View>

              <Text
                size={theme.typography.fontSizes.sm}
                weight="medium"
                style={styles.professionalName}>
                Anyone
              </Text>
            </TouchableOpacity>

            {/* Available Professionals Only */}
            {availableEmployees.map((employee) => {
              return (
                <TouchableOpacity
                  activeOpacity={0.8}
                  key={employee._id}
                  onPress={() => onEmployeeSelect(service.id, employee)}
                  style={[
                    styles.professionalCard,
                    selectedEmployee?._id === employee._id && styles.selectedProfessionalCard,
                  ]}>
                  <View style={styles.avatarCircle}>
                    <Text size={theme.typography.fontSizes.lg} weight="semiBold">
                      {employee.name[0].toUpperCase()}
                    </Text>
                    <View style={styles.ratingContainer}>
                      <StarIcon width={16} height={16} />
                      <Text
                        size={theme.typography.fontSizes.xs}
                        color={theme.colors.darkText['100']}
                        weight="bold">
                        {employee.rating.toFixed(1)}
                      </Text>
                    </View>
                  </View>
                  <Text
                    size={theme.typography.fontSizes.sm}
                    weight="bold"
                    style={styles.professionalName}>
                    {employee.name}
                  </Text>
                  <Text
                    size={theme.typography.fontSizes.xs}
                    color={theme.colors.darkText['50']}
                    style={styles.professionalSpecialty}>
                    {employee.specialties[0] || 'Professional'}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>
    );
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
      {selectedServices.map((service) => renderProfessionalOptions(service))}
    </ScrollView>
  );
};

export default ProfessionalSelectionOnlyStep;

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
  },
  serviceSection: {
    gap: theme.spacing.lg,
  },
  serviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  professionalGrid: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  professionalCard: {
    width: '45%',
    height: 180,
    justifyContent: 'center',
    padding: theme.spacing.md,
    borderRadius: theme.radii.lg,
    borderWidth: 2,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.white.DEFAULT,
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  selectedProfessionalCard: {
    borderColor: theme.colors.darkText['100'],
  },
  avatarCircle: {
    position: 'relative',
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: theme.colors.grey['10'],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.xl,
  },
  ratingContainer: {
    position: 'absolute',
    bottom: -16,
    left: '50%',
    transform: [{ translateX: -25 }],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: theme.colors.white.DEFAULT,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  professionalName: {
    textAlign: 'center',
    marginTop: theme.spacing.xs,
  },
  professionalSpecialty: {
    textAlign: 'center',
  },
  noEmployeesContainer: {
    padding: theme.spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.md,
  },
  noEmployeesText: {
    textAlign: 'center',
    fontWeight: '600',
  },
  noEmployeesSubtext: {
    textAlign: 'center',
    lineHeight: 20,
  },
});
