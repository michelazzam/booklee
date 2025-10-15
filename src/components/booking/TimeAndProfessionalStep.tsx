import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useState, useMemo } from 'react';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

import { theme } from '~/src/constants/theme';
import { Text, Icon } from '../base';
import type {
  Employee,
  SelectedService,
  ServiceBooking,
  AvailabilityResponse,
  TimeSlot,
} from '~/src/services';
import { AppointmentServices } from '~/src/services';
import { CoupleIcon, GroupIcon, StarIcon, ClockIcon } from '~/src/assets/icons';

type AnimatedButtonProps = {
  style?: any;
  isSelected?: boolean;
  onPress?: () => void;
  children: React.ReactNode;
};

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);
const AnimatedButton = ({ style, onPress, children, isSelected = false }: AnimatedButtonProps) => {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      borderColor: withTiming(isSelected ? theme.colors.primaryBlue['100'] : theme.colors.border, {
        duration: 300,
      }),
      backgroundColor: withTiming(
        isSelected ? theme.colors.primaryBlue['10'] : theme.colors.white.DEFAULT,
        { duration: 300 }
      ),
    };
  });

  return (
    <AnimatedTouchableOpacity onPress={onPress} activeOpacity={0.8} style={[style, animatedStyle]}>
      {children}
    </AnimatedTouchableOpacity>
  );
};

type TimeAndProfessionalStepProps = {
  selectedServices: SelectedService[];
  locationId: string;
  serviceBookings: Record<string, ServiceBooking>;
  hasTimeConflict: (
    date: string,
    time: string,
    duration: number,
    excludeServiceId?: string
  ) => boolean;
  onEmployeeSelect: (serviceId: string, employee: Employee | undefined) => void;
  onTimeSelect: (serviceId: string, time: string, availabilityData: AvailabilityResponse) => void;
};

const TimeAndProfessionalStep = ({
  selectedServices,
  locationId,
  serviceBookings,
  hasTimeConflict,
  onEmployeeSelect,
  onTimeSelect,
}: TimeAndProfessionalStepProps) => {
  // Auto-expand the first service by default for better UX
  const [expandedServices, setExpandedServices] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    if (selectedServices.length > 0) {
      initial[selectedServices[0].id] = true;
    }
    return initial;
  });

  // Track selected professionals per service
  const [selectedProfessionals, setSelectedProfessionals] = useState<
    Record<string, Employee | 'any' | undefined>
  >({});

  const { data: locationBookingData } = AppointmentServices.useGetLocationBookingData(locationId);

  // Get employees for each service
  const serviceEmployees = useMemo(() => {
    const employees: Record<string, Employee[]> = {};
    selectedServices.forEach((service) => {
      const serviceEmp =
        locationBookingData?.data?.employees?.filter((emp: any) =>
          emp.serviceIds.includes(service.id)
        ) || [];
      employees[service.id] = serviceEmp;
    });
    return employees;
  }, [selectedServices, locationBookingData]);

  const toggleServiceExpansion = (serviceId: string) => {
    setExpandedServices((prev) => ({
      ...prev,
      [serviceId]: !prev[serviceId],
    }));
  };

  const handleProfessionalSelect = (serviceId: string, employee: Employee | undefined) => {
    const professionalValue = employee === undefined ? 'any' : employee;
    setSelectedProfessionals((prev) => ({
      ...prev,
      [serviceId]: professionalValue,
    }));

    // Clear any previously selected time when professional changes
    onEmployeeSelect(serviceId, employee);
  };

  return (
    <View style={styles.container}>
      <Text size={theme.typography.fontSizes.lg} weight="medium" style={styles.title}>
        Select Professional & Time
      </Text>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollContainer}>
        {selectedServices.map((service) => (
          <ServiceSection
            key={service.id}
            service={service}
            locationId={locationId}
            serviceBookings={serviceBookings}
            hasTimeConflict={hasTimeConflict}
            onProfessionalSelect={handleProfessionalSelect}
            onTimeSelect={onTimeSelect}
            isExpanded={expandedServices[service.id] || false}
            onToggleExpansion={toggleServiceExpansion}
            selectedProfessional={selectedProfessionals[service.id]}
            employees={serviceEmployees[service.id] || []}
          />
        ))}
      </ScrollView>
    </View>
  );
};

// Individual service section component
const ServiceSection = ({
  service,
  locationId,
  serviceBookings,
  hasTimeConflict,
  onProfessionalSelect,
  onTimeSelect,
  isExpanded,
  onToggleExpansion,
  selectedProfessional,
  employees,
}: {
  service: SelectedService;
  locationId: string;
  serviceBookings: Record<string, ServiceBooking>;
  hasTimeConflict: (
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
}) => {
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
  const availableTimeSlots = useMemo(() => {
    if (!selectedProfessional) return [];

    const allTimeSlots = availabilityData?.availability?.slots || [];
    const busyData = availabilityData?.availability?.busy || {};

    return allTimeSlots.map((slot: TimeSlot) => {
      let isAvailable = false;
      let isProfessionalBusy = false;

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
          return !employeeBusyTimes.some((busyTime) =>
            isTimeOverlapping(slotStart, slotEnd, busyTime.start, busyTime.end)
          );
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

          if (isProfessionalBusy) {
            isAvailable = false;
          }
        }
      }

      return {
        ...slot,
        isAvailable,
        isProfessionalBusy,
      };
    });
  }, [availabilityData, selectedProfessional, selectedDate, service.duration]);

  const isTimeSlotPassed = (timeValue: string) => {
    if (!selectedDate) return false;
    const isToday = selectedDate === new Date().toISOString().split('T')[0];
    if (!isToday) return false;

    const now = new Date();
    const [hours, minutes] = timeValue.split(':').map(Number);
    const slotTime = new Date();
    slotTime.setHours(hours, minutes, 0, 0);

    return now >= slotTime;
  };

  return (
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
          <Icon
            name={isExpanded ? 'chevron-up' : 'chevron-down'}
            size={20}
            color={theme.colors.darkText['100']}
          />
        </View>
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.serviceContent}>
          {/* Professional Selection */}
          <View style={styles.section}>
            <Text size={theme.typography.fontSizes.md} weight="medium" style={styles.sectionTitle}>
              Select Professional
            </Text>

            <View style={styles.professionalGrid}>
              {/* Any Available Professional Option */}
              <AnimatedButton
                style={styles.professionalOption}
                isSelected={selectedProfessional === 'any'}
                onPress={() => onProfessionalSelect(service.id, undefined)}>
                <GroupIcon width={24} height={24} />
                <Text size={theme.typography.fontSizes.sm} weight="medium">
                  Any Available
                </Text>
              </AnimatedButton>

              {/* Specific Professionals */}
              {employees.map((employee) => (
                <AnimatedButton
                  key={employee._id}
                  style={styles.professionalOption}
                  isSelected={
                    selectedProfessional &&
                    typeof selectedProfessional === 'object' &&
                    selectedProfessional._id === employee._id
                  }
                  onPress={() => onProfessionalSelect(service.id, employee)}>
                  <CoupleIcon width={24} height={24} />
                  <View style={styles.employeeInfo}>
                    <Text size={theme.typography.fontSizes.sm} weight="medium">
                      {employee.name}
                    </Text>
                    <View style={styles.ratingContainer}>
                      <StarIcon width={14} height={14} />
                      <Text
                        size={theme.typography.fontSizes.xs}
                        color={theme.colors.darkText['50']}>
                        {employee.rating}
                      </Text>
                    </View>
                  </View>
                </AnimatedButton>
              ))}
            </View>
          </View>

          {/* Time Selection - Only show if professional is selected */}
          {selectedProfessional && (
            <View style={styles.section}>
              <Text
                size={theme.typography.fontSizes.md}
                weight="medium"
                style={styles.sectionTitle}>
                Select Time
                {selectedProfessional === 'any'
                  ? ' (Any Available Professional)'
                  : selectedProfessional && typeof selectedProfessional === 'object'
                    ? ` (${selectedProfessional.name})`
                    : ''}
              </Text>

              {availabilityQuery?.isLoading ? (
                <View style={styles.loadingContainer}>
                  <Text size={theme.typography.fontSizes.sm} color={theme.colors.darkText['50']}>
                    Loading available times...
                  </Text>
                </View>
              ) : (
                <View style={styles.timeSlotsGrid}>
                  {availableTimeSlots.map((slot: any) => {
                    const hasConflict = hasTimeConflict(
                      selectedDate || '',
                      slot.value,
                      service.duration,
                      service.id
                    );
                    const isPassed = isTimeSlotPassed(slot.value);
                    const isDisabled = !slot.isAvailable || hasConflict || isPassed;
                    const isSelected = selectedTime === slot.value;

                    return (
                      <TouchableOpacity
                        activeOpacity={0.8}
                        key={slot.value}
                        style={[
                          styles.timeSlot,
                          isSelected && styles.selectedTimeSlot,
                          isDisabled && styles.disabledTimeSlot,
                        ]}
                        disabled={isDisabled}
                        onPress={() => onTimeSelect(service.id, slot.value, availabilityData!)}>
                        <View style={styles.timeSlotContent}>
                          <ClockIcon
                            width={16}
                            height={16}
                            color={
                              isSelected ? theme.colors.white.DEFAULT : theme.colors.darkText['100']
                            }
                          />

                          <Text
                            size={theme.typography.fontSizes.xs}
                            color={
                              isDisabled
                                ? theme.colors.darkText['25']
                                : isSelected
                                  ? theme.colors.white.DEFAULT
                                  : theme.colors.darkText['100']
                            }>
                            {slot.label}
                          </Text>

                          {!isDisabled &&
                            slot.availableEmployeeCount > 0 &&
                            selectedProfessional === 'any' && (
                              <Text
                                weight="medium"
                                size={theme.typography.fontSizes.xs}
                                color={
                                  isSelected
                                    ? theme.colors.white.DEFAULT
                                    : theme.colors.darkText['50']
                                }>
                                {slot.availableEmployeeCount} available
                              </Text>
                            )}
                        </View>
                      </TouchableOpacity>
                    );
                  })}

                  {availableTimeSlots.length === 0 && !availabilityQuery?.isLoading && (
                    <View style={styles.noSlotsContainer}>
                      <Text
                        size={theme.typography.fontSizes.sm}
                        color={theme.colors.darkText['50']}>
                        No available times for{' '}
                        {selectedProfessional === 'any'
                          ? 'any professional'
                          : selectedProfessional && typeof selectedProfessional === 'object'
                            ? selectedProfessional.name
                            : 'selected professional'}
                      </Text>
                    </View>
                  )}
                </View>
              )}
            </View>
          )}
        </View>
      )}
    </View>
  );
};

export default TimeAndProfessionalStep;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: theme.spacing.lg,
  },
  title: {
    marginBottom: theme.spacing.md,
  },
  scrollContainer: {
    flex: 1,
  },
  serviceContainer: {
    backgroundColor: theme.colors.white.DEFAULT,
    borderRadius: theme.radii.lg,
    marginBottom: theme.spacing.md,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
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
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
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
  employeeInfo: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  timeSlotsGrid: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    gap: theme.spacing.sm,
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.sm,
  },
  timeSlot: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.white.DEFAULT,
    minWidth: 80,
    alignItems: 'center',
  },
  selectedTimeSlot: {
    backgroundColor: theme.colors.primaryBlue['100'],
    borderColor: theme.colors.primaryBlue['100'],
  },
  disabledTimeSlot: {
    backgroundColor: theme.colors.grey['10'],
    borderColor: theme.colors.grey['100'],
    opacity: 0.6,
  },
  timeSlotContent: {
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  unavailableReason: {
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: theme.spacing.xs,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
  },
  noSlotsContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
    width: '100%',
  },
});
