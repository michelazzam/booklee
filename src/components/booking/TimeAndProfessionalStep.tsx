import { View, StyleSheet, ScrollView } from 'react-native';
import { useState, useMemo } from 'react';

import {
  type AvailabilityResponse,
  type SelectedService,
  AppointmentServices,
  type ServiceBooking,
  type Employee,
} from '~/src/services';

import { theme } from '~/src/constants/theme';

import { ServiceSection } from './ServiceSection';
import { Text } from '../base';

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
  hasProfessionalConflict: (
    professionalId: string,
    date: string,
    time: string,
    duration: number,
    excludeServiceId?: string
  ) => boolean;
  onEmployeeSelect: (serviceId: string, employee: Employee | undefined) => void;
  onTimeSelect: (serviceId: string, time: string, availabilityData: AvailabilityResponse) => void;
};

export const TimeAndProfessionalStep = ({
  selectedServices,
  locationId,
  serviceBookings,
  hasTimeConflict,
  hasProfessionalConflict,
  onEmployeeSelect,
  onTimeSelect,
}: TimeAndProfessionalStepProps) => {
  // Track expanded services
  const [expandedServices, setExpandedServices] = useState<Record<string, boolean>>({});

  // Track selected professionals per service - auto-select "any" for first service
  const [selectedProfessionals, setSelectedProfessionals] = useState<
    Record<string, Employee | 'any' | undefined>
  >(() => {
    const initial: Record<string, Employee | 'any' | undefined> = {};
    if (selectedServices.length > 0) {
      initial[selectedServices[0].id] = 'any';
    }
    return initial;
  });

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
    setExpandedServices((prev) => {
      const isCurrentlyExpanded = prev[serviceId];
      const newExpanded = !isCurrentlyExpanded;

      return {
        ...prev,
        [serviceId]: newExpanded,
      };
    });

    // If expanding for the first time and no professional is selected, auto-select "any"
    if (!expandedServices[serviceId] && !selectedProfessionals[serviceId]) {
      handleProfessionalSelect(serviceId, undefined); // undefined means "any"
    }
  };

  const handleProfessionalSelect = (serviceId: string, employee: Employee | undefined) => {
    const professionalValue = employee === undefined ? 'any' : employee;
    setSelectedProfessionals((prev) => ({
      ...prev,
      [serviceId]: professionalValue,
    }));

    // Clear any previously selected time when professional changes
    onEmployeeSelect(serviceId, employee);

    // Also clear the selected time in the booking data
    onTimeSelect(serviceId, '', null as any);
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
            hasProfessionalConflict={hasProfessionalConflict}
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
});

export default TimeAndProfessionalStep;
