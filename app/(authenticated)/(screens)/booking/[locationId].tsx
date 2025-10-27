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

import { ProfessionalSelectionOnlyStep, DateAndTimeSelectionStep } from '~/src/components/booking';
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
    { key: 'datetime', title: 'Select Date & Time' },
    { key: 'timeprofessional', title: 'Select Professional' },
    { key: 'confirm', title: 'Confirm' },
  ];

  const currentStepIndex = steps.findIndex((step) => step.key === currentStep);

  // No longer needed since we handle all services together

  // Auto-assign professionals for services that have "Any Available" (undefined)
  const autoAssignProfessionals = () => {
    if (!locationBookingData?.data?.employees) return;

    const updatedServiceBookings = { ...bookingData.serviceBookings };

    selectedServices.forEach((service) => {
      const booking = bookingData.serviceBookings[service.id];

      // Skip if already has an employee selected
      if (booking.selectedEmployee) return;

      // Get all employees who can do this service
      const serviceEmployees = locationBookingData.data.employees.filter((emp: any) =>
        emp.serviceIds.includes(service.id)
      );

      // Find the first available employee
      const firstAvailable = serviceEmployees.find((employee: any) => {
        // Check if this employee would conflict with other services
        const hasConflict = hasProfessionalConflict(
          employee._id,
          booking.selectedDate || '',
          booking.selectedTime || '',
          service.duration,
          service.id
        );
        return !hasConflict;
      });

      if (firstAvailable) {
        updatedServiceBookings[service.id] = {
          ...booking,
          selectedEmployee: firstAvailable,
        };
      }
    });

    setBookingData((prev) => ({
      ...prev,
      serviceBookings: updatedServiceBookings,
    }));
  };

  const handleNext = () => {
    if (currentStep === 'datetime') {
      setCurrentStep('timeprofessional');
    } else if (currentStep === 'timeprofessional') {
      // Auto-assign professionals before moving to confirm
      autoAssignProfessionals();
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
  // Check if a professional is already selected for another service at the same time
  const hasProfessionalConflict = (
    professionalId: string,
    newDate: string,
    newTime: string,
    newDuration: number,
    excludeServiceId?: string
  ): boolean => {
    const newStart = new Date(`${newDate}T${newTime}:00`);
    const newEnd = new Date(newStart.getTime() + newDuration * 60 * 1000);

    for (const [serviceId, booking] of Object.entries(bookingData.serviceBookings)) {
      if (
        serviceId === excludeServiceId ||
        !booking.selectedDate ||
        !booking.selectedTime ||
        !booking.selectedEmployee
      ) {
        continue;
      }

      // Check if the same professional is selected
      if (booking.selectedEmployee._id === professionalId) {
        const service = selectedServices.find((s) => s.id === serviceId);
        if (!service) continue;

        const existingStart = new Date(`${booking.selectedDate}T${booking.selectedTime}:00`);
        const existingEnd = new Date(existingStart.getTime() + service.duration * 60 * 1000);

        // Check if there's time overlap with the same professional
        if (newStart < existingEnd && newEnd > existingStart) {
          return true;
        }
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
      case 'datetime': {
        const currentServiceBooking = bookingData.serviceBookings[selectedServices[0]?.id];
        const firstService = selectedServices[0];
        return (
          <DateAndTimeSelectionStep
            selectedDate={currentServiceBooking?.selectedDate}
            selectedTime={currentServiceBooking?.selectedTime}
            locationId={locationId || ''}
            serviceId={firstService?.id || ''}
            serviceDuration={firstService?.duration || 0}
            onDateSelect={(date) => {
              setBookingData((prev) => {
                const updatedServiceBookings = { ...prev.serviceBookings };

                // Set the selected date for ALL selected services
                selectedServices.forEach((service) => {
                  updatedServiceBookings[service.id] = {
                    ...updatedServiceBookings[service.id],
                    selectedDate: date,
                    selectedTime: undefined, // Clear time when date changes
                    selectedEmployee: undefined, // Clear employee when date changes
                  };
                });

                return {
                  ...prev,
                  serviceBookings: updatedServiceBookings,
                };
              });
            }}
            onTimeSelect={(time, availabilityData) => {
              // Calculate sequential times for all services
              setBookingData((prev) => {
                const updatedServiceBookings = { ...prev.serviceBookings };
                const selectedDate = prev.serviceBookings[firstService.id]?.selectedDate;

                if (!selectedDate || !time) return prev;

                // Parse the start time (e.g., "09:00")
                let currentTime = new Date(`${selectedDate}T${time}:00`);

                // Assign times to each service sequentially
                selectedServices.forEach((service, index) => {
                  if (index === 0) {
                    // First service gets the selected time
                    updatedServiceBookings[service.id] = {
                      ...updatedServiceBookings[service.id],
                      selectedTime: time,
                      availabilityData,
                      selectedDate,
                    };
                  } else {
                    // Subsequent services start when previous service ends
                    const timeString = currentTime.toTimeString().slice(0, 5); // Format: "HH:mm"
                    updatedServiceBookings[service.id] = {
                      ...updatedServiceBookings[service.id],
                      selectedTime: timeString,
                      availabilityData,
                      selectedDate,
                    };
                  }

                  // Add the service duration to get the start time for the next service
                  currentTime = new Date(currentTime.getTime() + service.duration * 60 * 1000);
                });

                return {
                  ...prev,
                  serviceBookings: updatedServiceBookings,
                };
              });
            }}
            onComplete={() => {
              // Automatically navigate to professional selection step
              setCurrentStep('timeprofessional');
            }}
          />
        );
      }
      case 'timeprofessional': {
        return (
          <ProfessionalSelectionOnlyStep
            selectedServices={selectedServices}
            locationId={locationId || ''}
            serviceBookings={bookingData.serviceBookings}
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
            hasProfessionalConflict={hasProfessionalConflict}
          />
        );
      }
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
        // Check if date AND time are selected
        const currentBooking = bookingData.serviceBookings[selectedServices[0]?.id];
        return !!currentBooking?.selectedDate && !!currentBooking?.selectedTime;
      case 'timeprofessional':
        // Professional selection is optional - proceed if all services have an employee (even if undefined/any)
        // All services should have a value (either an employee or undefined for "any")
        return selectedServices.every((service) => {
          const booking = bookingData.serviceBookings[service.id];
          // Just check that the booking exists - employee can be undefined (which means "any")
          return !!booking;
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
                  size={isCurrent ? 10 : 8}
                  weight={isCurrent ? 'bold' : 'regular'}
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
      {currentStep !== 'datetime' && (
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
      )}

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
