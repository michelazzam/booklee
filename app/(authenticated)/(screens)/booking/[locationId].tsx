import { useState, useMemo, useRef, Fragment } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { useAppSafeAreaInsets } from '~/src/hooks';
import { theme } from '~/src/constants/theme';
import { AwareScrollView, Text } from '~/src/components/base';
import { Button } from '~/src/components/buttons';
import { LocationServices, AppointmentServices } from '~/src/services';
import type { BookingData, BookingStep, SelectedService, ServiceBooking } from '~/src/services';
import {
  CancelBookingConfirmationModal,
  type CancelBookingConfirmationModalRef,
} from '~/src/components/modals';

import DateTimeSelectionStep from '~/src/components/booking/DateTimeSelectionStep';
import TimeAndProfessionalStep from '~/src/components/booking/TimeAndProfessionalStep';
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

  // Initialize service bookings for each selected service
  const initialServiceBookings = useMemo(() => {
    const bookings: Record<string, ServiceBooking> = {};
    selectedServices.forEach((service) => {
      bookings[service.id] = {
        serviceId: service.id,
      };
    });
    return bookings;
  }, [selectedServices]);

  // Booking state
  const [currentStep, setCurrentStep] = useState<BookingStep>('datetime');
  const [bookingData, setBookingData] = useState<BookingData>({
    locationId: locationId || '',
    locationName: location?.name || '',
    selectedServices,
    serviceBookings: initialServiceBookings,
    currentServiceIndex: 0,
  });

  const steps: { key: BookingStep; title: string }[] = [
    { key: 'service', title: 'Select Service' },
    { key: 'datetime', title: 'Select Date' },
    { key: 'timeprofessional', title: 'Select Professional & Time' },
    { key: 'confirm', title: 'Confirm' },
  ];

  const currentStepIndex = steps.findIndex((step) => step.key === currentStep);

  // No longer needed since we handle all services together

  const handleNext = () => {
    if (currentStep === 'datetime') {
      setCurrentStep('timeprofessional');
    } else if (currentStep === 'timeprofessional') {
      setCurrentStep('confirm');
    }
  };
  const handleBack = () => {
    if (currentStep === 'confirm') {
      setCurrentStep('timeprofessional');
    } else if (currentStep === 'timeprofessional') {
      setCurrentStep('datetime');
    } else if (currentStep === 'datetime') {
      router.back();
    }
  };
  const handleCancelBooking = () => {
    cancelConfirmationModalRef.current?.present();
  };
  const handleConfirmCancel = () => {
    router.back();
  };
  const hasTimeConflict = (
    newDate: string,
    newTime: string,
    newDuration: number,
    excludeServiceId?: string
  ): boolean => {
    const newStart = new Date(`${newDate}T${newTime}:00`);
    const newEnd = new Date(newStart.getTime() + newDuration * 60 * 1000);

    for (const [serviceId, booking] of Object.entries(bookingData.serviceBookings)) {
      if (serviceId === excludeServiceId || !booking.selectedDate || !booking.selectedTime) {
        continue;
      }

      const service = selectedServices.find((s) => s.id === serviceId);
      if (!service) continue;

      const existingStart = new Date(`${booking.selectedDate}T${booking.selectedTime}:00`);
      const existingEnd = new Date(existingStart.getTime() + service.duration * 60 * 1000);

      // Check if there's overlap
      if (newStart < existingEnd && newEnd > existingStart) {
        return true;
      }
    }

    return false;
  };
  const handleConfirmBooking = async () => {
    try {
      // Validate that all services have been scheduled
      const unscheduledServices = selectedServices.filter((service) => {
        const booking = bookingData.serviceBookings[service.id];
        return !booking.selectedDate || !booking.selectedTime;
      });

      if (unscheduledServices.length > 0) {
        Alert.alert('Error', 'Please schedule all selected services');
        return;
      }

      // Create appointments for each service
      const appointments = [];

      for (const service of selectedServices) {
        const booking = bookingData.serviceBookings[service.id];
        if (!booking.selectedDate || !booking.selectedTime) continue;

        const startAt = new Date(
          `${booking.selectedDate}T${booking.selectedTime}:00`
        ).toISOString();

        let selectedEmployee = booking.selectedEmployee;

        // If no employee selected, choose from available ones
        if (!selectedEmployee && booking.availabilityData) {
          const availableSlot = booking.availabilityData.availability.slots.find(
            (slot) => slot.value === booking.selectedTime && slot.isAvailable
          );

          if (availableSlot && availableSlot.availableEmployeeIds.length > 0) {
            // Get employees from locationBookingData (fallback to availability data if needed)
            const employees = locationBookingData?.data?.employees || [];
            const availableEmployees = employees.filter((emp: any) =>
              availableSlot.availableEmployeeIds.includes(emp._id)
            );

            if (availableEmployees.length > 0) {
              selectedEmployee =
                availableEmployees[Math.floor(Math.random() * availableEmployees.length)];
            }
          }
        }

        // Final fallback: if still no employee, try to get any employee who can do this service
        if (!selectedEmployee) {
          const employees = locationBookingData?.data?.employees || [];
          const serviceEmployees = employees.filter((emp: any) =>
            emp.serviceIds.includes(service.id)
          );

          if (serviceEmployees.length > 0) {
            selectedEmployee =
              serviceEmployees[Math.floor(Math.random() * serviceEmployees.length)];
          }
        }

        // Ensure we have an employee (fallback to any available if none selected)
        if (!selectedEmployee) {
          // This shouldn't happen due to our validation, but as a safety net
          console.warn(`No employee assigned for service ${service.name}`);
          continue;
        }

        const appointmentData = {
          locationId: bookingData.locationId,
          startAt,
          items: [
            {
              serviceId: service.id,
              serviceName: service.name,
              durationMinutes: service.duration,
              price: service.price,
              employeeId: selectedEmployee._id,
              employeeName: selectedEmployee.name,
            },
          ],
          status: 'confirmed' as const,
          source: 'mobile' as const,
          ...(bookingData.notes && { notes: bookingData.notes }),
        };

        appointments.push(appointmentData);
      }

      // Create all appointments
      for (const appointmentData of appointments) {
        await createAppointmentMutation.mutateAsync(appointmentData);
      }

      router.replace('/(authenticated)/(tabs)/bookings');
    } catch (error: any) {
      console.error('Booking error:', error);

      const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
      Toast.error('Failed to create booking: ' + errorMessage);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'datetime':
        const currentServiceBooking = bookingData.serviceBookings[selectedServices[0]?.id];
        return (
          <DateTimeSelectionStep
            selectedDate={currentServiceBooking?.selectedDate}
            onDateSelect={(date) =>
              setBookingData((prev) => {
                const updatedServiceBookings = { ...prev.serviceBookings };

                // Set the selected date for ALL selected services
                selectedServices.forEach((service) => {
                  updatedServiceBookings[service.id] = {
                    ...updatedServiceBookings[service.id],
                    selectedDate: date,
                    selectedTime: undefined, // Clear previously selected time when date changes
                    selectedEmployee: undefined, // Also clear employee selection
                  };
                });

                return {
                  ...prev,
                  serviceBookings: updatedServiceBookings,
                };
              })
            }
            onDateSelectAndProceed={() => {
              // Automatically move to next step when date is selected
              setCurrentStep('timeprofessional');
            }}
          />
        );
      case 'timeprofessional':
        return (
          <TimeAndProfessionalStep
            selectedServices={selectedServices}
            locationId={locationId || ''}
            serviceBookings={bookingData.serviceBookings}
            hasTimeConflict={hasTimeConflict}
            onEmployeeSelect={(serviceId, employee) =>
              setBookingData((prev) => ({
                ...prev,
                serviceBookings: {
                  ...prev.serviceBookings,
                  [serviceId]: {
                    ...prev.serviceBookings[serviceId],
                    selectedEmployee: employee,
                  },
                },
              }))
            }
            onTimeSelect={(serviceId, time, availabilityData) =>
              setBookingData((prev) => ({
                ...prev,
                serviceBookings: {
                  ...prev.serviceBookings,
                  [serviceId]: {
                    ...prev.serviceBookings[serviceId],
                    selectedTime: time,
                    availabilityData,
                  },
                },
              }))
            }
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
        const selectedDate = bookingData.serviceBookings[selectedServices[0]?.id]?.selectedDate;
        return !!selectedDate;
      case 'timeprofessional':
        // Check if all services have both professional and time selected
        return selectedServices.every((service) => {
          const booking = bookingData.serviceBookings[service.id];
          return booking?.selectedTime; // Professional selection is optional
        });
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

        <View style={{ alignItems: 'center' }}>
          <Text size={theme.typography.fontSizes.md} weight="medium">
            BOOK AN APPOINTMENT
          </Text>
          {currentStep !== 'confirm' && (
            <Text size={theme.typography.fontSizes.sm} color={theme.colors.darkText['50']}>
              {selectedServices.length} service{selectedServices.length > 1 ? 's' : ''} selected
            </Text>
          )}
        </View>

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
      <AwareScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        bounces={false}>
        {renderStepContent()}
      </AwareScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        {currentStep === 'confirm' ? (
          <Button
            title="Confirm Booking"
            onPress={handleConfirmBooking}
            isLoading={createAppointmentMutation.isPending}
            disabled={!canProceed()}
          />
        ) : (
          <Button
            title={currentStep === 'timeprofessional' ? 'Review Booking' : 'Next'}
            onPress={handleNext}
            disabled={!canProceed()}
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
    flexGrow: 1,
    marginTop: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
  },
  footer: {
    padding: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
});
