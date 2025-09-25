import { useState, useMemo, useRef, Fragment } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { useAppSafeAreaInsets } from '~/src/hooks';
import { theme } from '~/src/constants/theme';
import { Text } from '~/src/components/base';
import { Button } from '~/src/components/buttons';
import { LocationServices, AppointmentServices } from '~/src/services';
import type { BookingData, BookingStep, SelectedService } from '~/src/services';
import {
  CancelBookingConfirmationModal,
  type CancelBookingConfirmationModalRef,
} from '~/src/components/modals';

import ProfessionalSelectionStep from '~/src/components/booking/ProfessionalSelectionStep';
import DateTimeSelectionStep from '~/src/components/booking/DateTimeSelectionStep';
import ConfirmationStep from '~/src/components/booking/ConfirmationStep';
import { Toast } from 'toastify-react-native';
import { ArrowLeftIcon, XIcon, DoneStepIcon, CurrentStepIcon } from '~/src/assets/icons';

const BookingFlow = () => {
  const router = useRouter();
  const { top, bottom } = useAppSafeAreaInsets();
  const { locationId, services } = useLocalSearchParams<{
    locationId: string;
    services: string;
  }>();

  // Modal refs
  const cancelConfirmationModalRef = useRef<CancelBookingConfirmationModalRef>(null);

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
  const [currentStep, setCurrentStep] = useState<BookingStep>('datetime');
  const [bookingData, setBookingData] = useState<BookingData>({
    locationId: locationId || '',
    locationName: location?.name || '',
    selectedServices,
  });
  const [hasChosenOption, setHasChosenOption] = useState(false);

  const steps: { key: BookingStep; title: string }[] = [
    { key: 'service', title: 'Select Service' },
    { key: 'datetime', title: 'Select Date & Time' },
    { key: 'professional', title: 'Select Professional' },
    { key: 'confirm', title: 'Confirm' },
  ];

  const currentStepIndex = steps.findIndex((step) => step.key === currentStep);

  const handleNext = () => {
    const stepOrder: BookingStep[] = ['datetime', 'professional', 'confirm'];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex < stepOrder.length - 1) {
      setCurrentStep(stepOrder[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    const stepOrder: BookingStep[] = ['datetime', 'professional', 'confirm'];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1]);
    } else {
      router.back();
    }
  };

  const handleCancelBooking = () => {
    cancelConfirmationModalRef.current?.present();
  };

  const handleConfirmCancel = () => {
    router.back();
  };

  const handleConfirmBooking = async () => {
    try {
      if (!bookingData.selectedDate || !bookingData.selectedTime) {
        Alert.alert('Error', 'Please select a date and time');
        return;
      }

      // Get available employees from the booking data
      const availableEmployees = locationBookingData?.data?.employees || [];

      // Create proper ISO string for the appointment time
      const startAt = new Date(
        `${bookingData.selectedDate}T${bookingData.selectedTime}:00`
      ).toISOString();

      const appointmentData = {
        locationId: bookingData.locationId,
        startAt,
        items: bookingData.selectedServices.map((service) => {
          let selectedEmployee = bookingData.selectedEmployeesByService?.[service.id];

          // If no employee selected, choose a random one who can perform this service
          if (!selectedEmployee && availableEmployees.length > 0) {
            const serviceEmployees = availableEmployees.filter((emp) =>
              emp.serviceIds.includes(service.id)
            );

            if (serviceEmployees.length > 0) {
              // Pick a random employee from those who can perform this service
              const randomIndex = Math.floor(Math.random() * serviceEmployees.length);
              selectedEmployee = serviceEmployees[randomIndex];
            } else {
              // Fallback: pick any random employee
              const randomIndex = Math.floor(Math.random() * availableEmployees.length);
              selectedEmployee = availableEmployees[randomIndex];
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

      // Final validation before sending
      const missingEmployees = appointmentData.items.filter(
        (item) => !item.employeeId || !item.employeeName
      );
      if (missingEmployees.length > 0) {
        console.error('ERROR: Some items are missing employee data:', missingEmployees);
        Alert.alert('Error', 'Failed to assign employees to all services. Please try again.');
        return;
      }

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
      case 'datetime':
        return (
          <DateTimeSelectionStep
            selectedDate={bookingData.selectedDate}
            selectedTime={bookingData.selectedTime}
            onDateSelect={(date) => setBookingData((prev) => ({ ...prev, selectedDate: date }))}
            onTimeSelect={(time) => setBookingData((prev) => ({ ...prev, selectedTime: time }))}
          />
        );
      case 'professional':
        return (
          <ProfessionalSelectionStep
            locationId={locationId || ''}
            selectedServices={selectedServices}
            selectedEmployeesByService={bookingData.selectedEmployeesByService}
            onEmployeeSelect={(serviceId, employee) =>
              setBookingData((prev) => ({
                ...prev,
                selectedEmployeesByService: {
                  ...(prev.selectedEmployeesByService || {}),
                  [serviceId]: employee,
                },
              }))
            }
            onOptionChosen={() => setHasChosenOption(true)}
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
      case 'datetime':
        return bookingData.selectedDate && bookingData.selectedTime;
      case 'professional':
        return true; // Can proceed with or without selecting specific professional
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
          <ArrowLeftIcon width={30} height={30} />
        </TouchableOpacity>

        <Text size={theme.typography.fontSizes.md} weight="medium">
          BOOK AN APPOINTMENT
        </Text>

        <TouchableOpacity onPress={handleCancelBooking}>
          <XIcon width={30} height={30} />
        </TouchableOpacity>
      </View>

      {/* Progress Bar */}
      <View style={styles.stepsContainer}>
        {steps.map((step, index) => {
          const isCompleted = index < currentStepIndex;
          const isCurrent = index === currentStepIndex;
          const isPending = index > currentStepIndex;

          return (
            <Fragment key={step.key}>
              {/* Step Indicator */}
              <View style={styles.stepIndicator}>
                {/* Step Icon */}
                <View style={styles.stepIconContainer}>
                  {isCompleted ? (
                    <DoneStepIcon width={20} height={20} />
                  ) : isCurrent ? (
                    <CurrentStepIcon width={20} height={20} />
                  ) : (
                    <View style={styles.pendingStepIcon} />
                  )}
                </View>

                {/* Step Text */}
                <Text
                  size={theme.typography.fontSizes.xs}
                  style={[
                    styles.stepText,
                    isCurrent && styles.stepTextActive,
                    isPending && styles.stepTextPending,
                  ]}>
                  {step.title}
                </Text>
              </View>

              {/* Connecting Line to Next Step */}
              {index < steps.length - 1 && (
                <View
                  style={[
                    styles.connectingLine,
                    isCompleted ? styles.connectingLineCompleted : styles.connectingLinePending,
                    // Adjust margins for the last connecting line
                    index === steps.length - 2 && { marginRight: -5 },
                  ]}
                />
              )}
            </Fragment>
          );
        })}
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
          <Button
            title="Next"
            onPress={handleNext}
            disabled={currentStep === 'professional' ? !hasChosenOption : !canProceed()}
          />
        )}
      </View>

      {/* Cancel Confirmation Modal */}
      <CancelBookingConfirmationModal
        ref={cancelConfirmationModalRef}
        onConfirm={handleConfirmCancel}
      />
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
    marginBottom: theme.spacing.lg,
  },
  stepsContainer: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.lg,
  },
  stepIndicator: {
    zIndex: 2,
    alignItems: 'center',
  },
  stepIconContainer: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Completed step (checkmark with black background)
  completedStepIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
  },
  // Current step (filled circle with outer ring)
  currentStepIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  currentStepInner: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#000000',
  },
  // Pending step (empty circle)
  pendingStepIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    backgroundColor: 'transparent',
  },
  connectingLine: {
    flex: 1,
    height: 3,
    marginTop: 13, // Center with the circles (32/2 - 2/2 = 15, but adjust as needed)
    marginHorizontal: -25, // Slight overlap to connect properly
    zIndex: 1,
  },
  connectingLineCompleted: {
    backgroundColor: '#000000',
  },
  connectingLinePending: {
    borderTopWidth: 1,
    borderTopColor: '#D1D5DB',
    backgroundColor: 'transparent',
  },
  stepText: {
    color: '#6B7280',
    textAlign: 'center',
    maxWidth: 80,
    lineHeight: 16,
  },
  stepTextActive: {
    color: '#000000',
    fontWeight: '600',
  },
  stepTextPending: {
    color: '#9CA3AF',
  },
  content: {
    flex: 1,
    marginTop: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
  },
  footer: {
    padding: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
});
