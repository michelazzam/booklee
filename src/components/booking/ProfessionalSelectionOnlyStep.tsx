import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useEffect } from 'react';
import { Text } from '../base';
import { theme } from '~/src/constants/theme';
import { CoupleIcon, GroupIcon, StarIcon } from '~/src/assets/icons';
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
    const employees = serviceEmployees[service.id] || [];
    const booking = serviceBookings[service.id];
    const selectedEmployee = booking?.selectedEmployee;
    const selectedDate = booking?.selectedDate;
    const selectedTime = booking?.selectedTime;

    return (
      <View key={service.id} style={styles.serviceSection}>
        <Text size={theme.typography.fontSizes.lg} weight="medium" style={styles.serviceTitle}>
          {service.name}
        </Text>

        <View style={styles.professionalGrid}>
          {/* Any Available Professional Option */}
          <TouchableOpacity
            style={[
              styles.professionalOption,
              selectedEmployee === undefined && styles.selectedProfessionalOption,
            ]}
            onPress={() => onEmployeeSelect(service.id, undefined)}>
            <GroupIcon width={24} height={24} />
            <Text size={theme.typography.fontSizes.sm} weight="medium">
              Any Available
            </Text>
          </TouchableOpacity>

          {/* Specific Professionals */}
          {employees.map((employee) => {
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

            const hasConflict = hasBookingConflict || isBusy;

            return (
              <TouchableOpacity
                activeOpacity={0.8}
                key={employee._id}
                disabled={hasConflict}
                onPress={() => onEmployeeSelect(service.id, employee)}
                style={[
                  styles.professionalOption,
                  selectedEmployee?._id === employee._id && styles.selectedProfessionalOption,
                  hasConflict && { opacity: 0.5 },
                ]}>
                <CoupleIcon width={24} height={24} />
                <View style={styles.employeeInfo}>
                  <Text size={theme.typography.fontSizes.sm} weight="medium">
                    {employee.name}
                  </Text>
                  <View style={styles.ratingContainer}>
                    <StarIcon width={14} height={14} />
                    <Text size={theme.typography.fontSizes.xs} color={theme.colors.darkText['50']}>
                      {employee.rating}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
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
    gap: theme.spacing.md,
  },
  serviceTitle: {
    marginBottom: theme.spacing.md,
  },
  professionalGrid: {
    gap: theme.spacing.sm,
  },
  professionalOption: {
    padding: theme.spacing.md,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  selectedProfessionalOption: {
    borderColor: theme.colors.darkText['100'],
    backgroundColor: theme.colors.grey['10'],
  },
  conflictProfessionalOption: {
    borderColor: theme.colors.red['100'],
    backgroundColor: theme.colors.red['10'],
  },
  employeeInfo: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  conflictText: {
    fontSize: 10,
    fontWeight: '600',
  },
});
