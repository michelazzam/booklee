import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ProfessionalSelection } from './ProfessionalSelection';
import { TimeSlotSelection } from './TimeSlotSelection';
import { theme } from '~/src/constants/theme';
import type {
  Employee,
  SelectedService,
  ServiceBooking,
  AvailabilityResponse,
  TimeSlot,
} from '~/src/services';
import { AppointmentServices } from '~/src/services';

type ServiceContentProps = {
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
  selectedProfessional: Employee | 'any' | undefined;
  employees: Employee[];
};

export const ServiceContent = ({
  service,
  locationId,
  serviceBookings,
  hasTimeConflict,
  hasProfessionalConflict,
  onProfessionalSelect,
  onTimeSelect,
  selectedProfessional,
  employees,
}: ServiceContentProps) => {
  const booking = serviceBookings[service.id];
  const selectedDate = booking?.selectedDate;
  const selectedTime = booking?.selectedTime;

  // Fetch availability data for this service
  const availabilityQuery = AppointmentServices.useGetAvailabilities(
    locationId,
    selectedDate || '',
    service.id,
    service.duration,
    !!selectedDate
  );

  const availabilityData = availabilityQuery?.data;

  // Helper function to check if two time ranges overlap
  const isTimeOverlapping = (start1: string, end1: string, start2: string, end2: string) => {
    const start1Date = new Date(start1);
    const end1Date = new Date(end1);
    const start2Date = new Date(start2);
    const end2Date = new Date(end2);

    return start1Date < end2Date && end1Date > start2Date;
  };

  // Filter time slots based on selected professional and busy times
  const availableTimeSlots = React.useMemo(() => {
    if (!selectedProfessional || !selectedDate) return [];

    const allTimeSlots = availabilityData?.availability?.slots || [];
    const busyData = availabilityData?.availability?.busy || {};

    return allTimeSlots.map((slot: TimeSlot) => {
      let isAvailable = false;
      let isProfessionalBusy = false;
      let hasConflict = false;

      if (selectedProfessional === 'any') {
        // For "any available professional", check which professionals are actually available (not busy)
        const availableEmployees = slot.availableEmployeeIds;
        const actuallyAvailableEmployees = availableEmployees.filter((employeeId) => {
          const employeeBusyTimes = busyData[employeeId] || [];
          const slotStart = `${selectedDate}T${slot.value}:00`;
          const slotEnd = new Date(
            new Date(slotStart).getTime() + service.duration * 60 * 1000
          ).toISOString();

          // Employee is available if they're not busy during this time slot
          const isNotBusy = !employeeBusyTimes.some((busyTime) =>
            isTimeOverlapping(slotStart, slotEnd, busyTime.start, busyTime.end)
          );

          // Also check if this employee has conflicts with other services
          const hasEmployeeConflict = hasProfessionalConflict(
            employeeId,
            selectedDate,
            slot.value,
            service.duration,
            service.id
          );

          return isNotBusy && !hasEmployeeConflict;
        });

        // Update the available count to reflect only non-busy professionals
        slot.availableEmployeeCount = actuallyAvailableEmployees.length;

        // Slot is available if at least one professional is actually available
        isAvailable = actuallyAvailableEmployees.length > 0;

        // If no professionals are actually available, mark as busy
        if (availableEmployees.length > 0 && actuallyAvailableEmployees.length === 0) {
          isProfessionalBusy = true;
        }
      } else if (typeof selectedProfessional === 'object') {
        // For specific professional, check if they're available and not busy
        isAvailable = slot.availableEmployeeIds.includes(selectedProfessional._id);

        if (isAvailable) {
          const employeeBusyTimes = busyData[selectedProfessional._id] || [];
          const slotStart = `${selectedDate}T${slot.value}:00`;
          const slotEnd = new Date(
            new Date(slotStart).getTime() + service.duration * 60 * 1000
          ).toISOString();

          isProfessionalBusy = employeeBusyTimes.some((busyTime) =>
            isTimeOverlapping(slotStart, slotEnd, busyTime.start, busyTime.end)
          );

          // Check for professional conflicts with other services
          hasConflict = hasProfessionalConflict(
            selectedProfessional._id,
            selectedDate,
            slot.value,
            service.duration,
            service.id
          );

          if (isProfessionalBusy || hasConflict) {
            isAvailable = false;
          }
        }
      }

      return {
        ...slot,
        isAvailable,
        isProfessionalBusy,
        hasConflict,
      };
    });
  }, [
    availabilityData,
    selectedProfessional,
    selectedDate,
    service.duration,
    hasProfessionalConflict,
    service.id,
  ]);

  return (
    <View style={styles.serviceContent}>
      <ProfessionalSelection
        selectedProfessional={selectedProfessional}
        employees={employees}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        serviceDuration={service.duration}
        serviceId={service.id}
        hasProfessionalConflict={hasProfessionalConflict}
        onProfessionalSelect={onProfessionalSelect}
      />

      <TimeSlotSelection
        selectedTime={selectedTime}
        selectedDate={selectedDate}
        serviceDuration={service.duration}
        serviceId={service.id}
        availableTimeSlots={availableTimeSlots}
        hasTimeConflict={hasTimeConflict}
        onTimeSelect={onTimeSelect}
        selectedProfessional={selectedProfessional}
        isLoading={availabilityQuery?.isLoading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  serviceContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
    overflow: 'hidden',
  },
});
