import { useState, useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { useAppSafeAreaInsets } from '~/src/hooks';
import { theme } from '~/src/constants/theme';
import { Text, Icon } from '~/src/components/base';
import { Button } from '~/src/components/buttons';
import { LocationServices, AppointmentServices } from '~/src/services';
import type { BookingData, BookingStep, SelectedService } from '~/src/services';

import ProfessionalSelectionStep from '~/src/components/booking/ProfessionalSelectionStep';
import DateTimeSelectionStep from '~/src/components/booking/DateTimeSelectionStep';
import ConfirmationStep from '~/src/components/booking/ConfirmationStep';
import { Toast } from 'toastify-react-native';

const BookingFlow = () => {
  const router = useRouter();
  const { top, bottom } = useAppSafeAreaInsets();
  const { locationId, services } = useLocalSearchParams<{
    locationId: string;
    services: string;
  }>();

  // Parse selected services from params
  const selectedServices: SelectedService[] = useMemo(() => {
    if (!services) return [];
    try {
      const decodedServices = decodeURIComponent(services);
      return JSON.parse(decodedServices);
    } catch {
      return [];
    }
  }, [services]);

  const { data: location } = LocationServices.useGetLocationById(locationId || '');
  const { data: locationBookingData } = AppointmentServices.useGetLocationBookingData(
    locationId || ''
  );
  const createAppointmentMutation = AppointmentServices.useCreateAppointment();

  // Booking state
  const [currentStep, setCurrentStep] = useState<BookingStep>('professional');
  const [bookingData, setBookingData] = useState<BookingData>({
    locationId: locationId || '',
    locationName: location?.name || '',
    selectedServices,
  });

  const steps: { key: BookingStep; title: string }[] = [
    { key: 'service', title: 'Select Service' },
    { key: 'professional', title: 'Select Professional' },
    { key: 'datetime', title: 'Select Date & Time' },
    { key: 'confirm', title: 'Confirm' },
  ];

  const currentStepIndex = steps.findIndex((step) => step.key === currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const handleNext = () => {
    const stepOrder: BookingStep[] = ['professional', 'datetime', 'confirm'];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex < stepOrder.length - 1) {
      setCurrentStep(stepOrder[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    const stepOrder: BookingStep[] = ['professional', 'datetime', 'confirm'];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1]);
    } else {
      router.back();
    }
  };

  const handleConfirmBooking = async () => {
    try {
      if (!bookingData.selectedDate || !bookingData.selectedTime) {
        Alert.alert('Error', 'Please select a date and time');
        return;
      }

      // Get available employees from the booking data
      const availableEmployees = locationBookingData?.data?.employees || [];
      console.log(
        'Available employees:',
        availableEmployees.length,
        availableEmployees.map((e) => ({
          id: e._id,
          name: e.name,
          serviceIds: e.serviceIds,
        }))
      );

      // Create proper ISO string for the appointment time
      const startAt = new Date(
        `${bookingData.selectedDate}T${bookingData.selectedTime}:00`
      ).toISOString();

      const appointmentData = {
        locationId: bookingData.locationId,
        startAt,
        items: bookingData.selectedServices.map((service) => {
          let selectedEmployee = bookingData.selectedEmployee;

          // If no employee selected, choose a random one who can perform this service
          if (!selectedEmployee && availableEmployees.length > 0) {
            const serviceEmployees = availableEmployees.filter((emp) =>
              emp.serviceIds.includes(service.id)
            );

            if (serviceEmployees.length > 0) {
              // Pick a random employee from those who can perform this service
              const randomIndex = Math.floor(Math.random() * serviceEmployees.length);
              selectedEmployee = serviceEmployees[randomIndex];
              console.log(`Auto-selected employee for ${service.name}:`, selectedEmployee.name);
            } else {
              // Fallback: pick any random employee
              const randomIndex = Math.floor(Math.random() * availableEmployees.length);
              selectedEmployee = availableEmployees[randomIndex];
              console.log(
                `Auto-selected random employee for ${service.name}:`,
                selectedEmployee.name
              );
            }
          }

          const item = {
            serviceId: service.id,
            serviceName: service.name,
            durationMinutes: service.duration,
            price: service.price,
            ...(selectedEmployee && {
              employeeId: selectedEmployee._id,
              employeeName: selectedEmployee.name,
            }),
          };

          return item;
        }),
        status: 'pending' as const,
        source: 'online' as const,
        ...(bookingData.notes && { notes: bookingData.notes }),
      };

      console.log('Sending appointment data:', JSON.stringify(appointmentData, null, 2));

      // Validate data structure matches API specification
      console.log('Data validation:');
      console.log('- locationId:', typeof appointmentData.locationId, appointmentData.locationId);
      console.log('- startAt:', typeof appointmentData.startAt, appointmentData.startAt);
      console.log('- items count:', appointmentData.items.length);
      appointmentData.items.forEach((item, index) => {
        console.log(`- item[${index}]:`, {
          serviceId: item.serviceId,
          serviceName: item.serviceName,
          durationMinutes: item.durationMinutes,
          price: item.price,
          employeeId: item.employeeId || 'MISSING - ERROR',
          employeeName: item.employeeName || 'MISSING - ERROR',
        });
      });
      console.log('- status:', appointmentData.status);
      console.log('- source:', appointmentData.source);
      console.log('- notes:', appointmentData.notes || 'none');

      // Final validation before sending
      const missingEmployees = appointmentData.items.filter(
        (item) => !item.employeeId || !item.employeeName
      );
      if (missingEmployees.length > 0) {
        console.error('ERROR: Some items are missing employee data:', missingEmployees);
        Alert.alert('Error', 'Failed to assign employees to all services. Please try again.');
        return;
      }

      console.log('✅ All validations passed. Sending to API...');
      console.log('API endpoint: POST /appointments');
      console.log('Request payload size:', JSON.stringify(appointmentData).length, 'characters');

      await createAppointmentMutation.mutateAsync(appointmentData, {
        onSuccess: () => {
          Toast.success('Booking confirmed');
          router.push('/(authenticated)/(tabs)/bookings');
        },
      });
    } catch (error: any) {
      console.error('Booking error:', error);

      const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
      Toast.error('Failed to create booking' + errorMessage);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'professional':
        return (
          <ProfessionalSelectionStep
            locationId={locationId || ''}
            selectedServices={selectedServices}
            selectedEmployee={bookingData.selectedEmployee}
            onEmployeeSelect={(employee) =>
              setBookingData((prev) => ({ ...prev, selectedEmployee: employee }))
            }
          />
        );
      case 'datetime':
        return (
          <DateTimeSelectionStep
            selectedDate={bookingData.selectedDate}
            selectedTime={bookingData.selectedTime}
            onDateSelect={(date) => setBookingData((prev) => ({ ...prev, selectedDate: date }))}
            onTimeSelect={(time) => setBookingData((prev) => ({ ...prev, selectedTime: time }))}
          />
        );
      case 'confirm':
        return (
          <ConfirmationStep
            bookingData={bookingData}
            location={location}
            onNotesChange={(notes) => setBookingData((prev) => ({ ...prev, notes }))}
          />
        );
      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 'professional':
        return true; // Can proceed with or without selecting specific professional
      case 'datetime':
        return bookingData.selectedDate && bookingData.selectedTime;
      case 'confirm':
        return true;
      default:
        return false;
    }
  };

  return (
    <View style={[styles.container, { paddingTop: top, paddingBottom: bottom }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Icon name="arrow-left" size={24} color={theme.colors.darkText['100']} />
        </TouchableOpacity>

        <Text size={theme.typography.fontSizes.lg} weight="medium">
          BOOK AN APPOINTMENT
        </Text>

        <TouchableOpacity onPress={() => router.back()}>
          <Text size={theme.typography.fontSizes.lg}>✕</Text>
        </TouchableOpacity>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>

        <View style={styles.stepsContainer}>
          {steps.map((step, index) => (
            <View key={step.key} style={styles.stepIndicator}>
              <View
                style={[styles.stepCircle, index <= currentStepIndex && styles.stepCircleActive]}>
                {index < currentStepIndex && (
                  <Text size={12} color={theme.colors.white.DEFAULT}>
                    ✓
                  </Text>
                )}
              </View>
              <Text
                size={theme.typography.fontSizes.xs}
                style={[styles.stepText, index === currentStepIndex && styles.stepTextActive]}>
                {step.title}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false} bounces={false}>
        {renderStepContent()}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        {currentStep === 'confirm' ? (
          <Button
            title="Confirm"
            onPress={handleConfirmBooking}
            isLoading={createAppointmentMutation.isPending}
            disabled={!canProceed()}
          />
        ) : (
          <Button title="Next" onPress={handleNext} disabled={!canProceed()} />
        )}
      </View>
    </View>
  );
};

export default BookingFlow;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white.DEFAULT,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  progressContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
  },
  progressTrack: {
    height: 2,
    backgroundColor: theme.colors.border,
    borderRadius: 1,
    marginBottom: theme.spacing.md,
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.darkText['100'],
    borderRadius: 1,
  },
  stepsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stepIndicator: {
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  stepCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCircleActive: {
    backgroundColor: theme.colors.darkText['100'],
  },
  stepText: {
    color: theme.colors.darkText['50'],
    textAlign: 'center',
    maxWidth: 80,
  },
  stepTextActive: {
    color: theme.colors.darkText['100'],
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
  },
  footer: {
    padding: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
});
