import { useState, Fragment } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

import { useAppSafeAreaInsets } from '~/src/hooks';
import { theme } from '~/src/constants/theme';
import { Text } from '~/src/components/base';
import { Button } from '~/src/components/buttons';
import { ArrowLeftIcon, ChevronDownIcon, DoneStepIcon, CurrentStepIcon } from '~/src/assets/icons';

type AppointmentStep = 'service' | 'professional' | 'datetime' | 'confirm';

type Service = {
  id: string;
  name: string;
  price: number;
  duration: number;
  description?: string;
};

const AddAppointment = () => {
  const router = useRouter();
  const { top, bottom } = useAppSafeAreaInsets();

  /*** State ***/
  const [currentStep, setCurrentStep] = useState<AppointmentStep>('service');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [clientType, setClientType] = useState<'directory' | 'manual'>('directory');
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  /*** Mock Data ***/
  const steps: { key: AppointmentStep; title: string }[] = [
    { key: 'service', title: 'Select Service\n& Client' },
    { key: 'professional', title: 'Assign Professional' },
    { key: 'datetime', title: 'Select Date & Time' },
    { key: 'confirm', title: 'Confirm' },
  ];

  const services: Service[] = [
    {
      id: '1',
      name: 'Blow-dry',
      price: 10,
      duration: 45,
    },
    {
      id: '2',
      name: 'Hairstyle',
      price: 10,
      duration: 45,
    },
    {
      id: '3',
      name: 'Haircut & blow-dry',
      price: 10,
      duration: 45,
    },
    {
      id: '4',
      name: 'Caviar Treatment',
      price: 10,
      duration: 45,
      description:
        'Mask made with caviar extract is applied to the hair, then left to absorb before rinsing and styling',
    },
    {
      id: '5',
      name: 'Roots color',
      price: 10,
      duration: 45,
      description:
        'Styling includes washing, brushing, and setting the hair into the desired look.',
    },
    {
      id: '6',
      name: 'Rooms ammonia free color',
      price: 10,
      duration: 45,
    },
  ];

  const currentStepIndex = steps.findIndex((step) => step.key === currentStep);

  /*** Handlers ***/
  const handleBack = () => {
    if (currentStep === 'service') {
      router.back();
    } else if (currentStep === 'professional') {
      setCurrentStep('service');
    } else if (currentStep === 'datetime') {
      setCurrentStep('professional');
    } else if (currentStep === 'confirm') {
      setCurrentStep('datetime');
    }
  };

  const handleNext = () => {
    if (currentStep === 'service') {
      setCurrentStep('professional');
    } else if (currentStep === 'professional') {
      setCurrentStep('datetime');
    } else if (currentStep === 'datetime') {
      setCurrentStep('confirm');
    }
  };

  const handleServiceToggle = (serviceId: string) => {
    if (selectedServices.includes(serviceId)) {
      setSelectedServices((prev) => prev.filter((id) => id !== serviceId));
    } else {
      setSelectedServices((prev) => [...prev, serviceId]);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 'service':
        return selectedBranch && selectedClient && selectedServices.length > 0;
      case 'professional':
        return true; // Can proceed with or without selecting specific professional
      case 'datetime':
        return true; // Will be validated later
      case 'confirm':
        return true;
      default:
        return false;
    }
  };

  /*** Render Functions ***/
  const renderStepContent = () => {
    switch (currentStep) {
      case 'service':
        return (
          <View style={styles.formContent}>
            {/* Branch Selection */}
            <View style={styles.formSection}>
              <Text
                size={theme.typography.fontSizes.sm}
                weight="medium"
                color={theme.colors.darkText[100]}
                style={{ marginBottom: theme.spacing.sm }}>
                Branch
              </Text>
              <TouchableOpacity
                style={styles.dropdown}
                activeOpacity={0.7}
                onPress={() => setSelectedBranch('Naccache')}>
                <Text
                  size={theme.typography.fontSizes.md}
                  color={selectedBranch ? theme.colors.darkText[100] : theme.colors.lightText}>
                  {selectedBranch || 'Select'}
                </Text>
                <ChevronDownIcon color={theme.colors.darkText[100]} width={20} height={20} />
              </TouchableOpacity>
            </View>

            {/* Client Selection */}
            <View style={styles.formSection}>
              <Text
                size={theme.typography.fontSizes.sm}
                weight="medium"
                color={theme.colors.darkText[100]}
                style={{ marginBottom: theme.spacing.sm }}>
                Client
              </Text>

              {/* Radio Buttons */}
              <View style={styles.radioGroup}>
                <Pressable style={styles.radioOption} onPress={() => setClientType('directory')}>
                  <View style={styles.radioOuter}>
                    {clientType === 'directory' && <View style={styles.radioInner} />}
                  </View>
                  <Text size={theme.typography.fontSizes.md} color={theme.colors.darkText[100]}>
                    Add from Directory
                  </Text>
                </Pressable>

                <Pressable style={styles.radioOption} onPress={() => setClientType('manual')}>
                  <View style={styles.radioOuter}>
                    {clientType === 'manual' && <View style={styles.radioInner} />}
                  </View>
                  <Text size={theme.typography.fontSizes.md} color={theme.colors.darkText[100]}>
                    Add Manually
                  </Text>
                </Pressable>
              </View>

              {/* Client Search Dropdown */}
              <TouchableOpacity
                style={styles.dropdown}
                activeOpacity={0.7}
                onPress={() => setSelectedClient('John Doe')}>
                <Text
                  size={theme.typography.fontSizes.md}
                  color={selectedClient ? theme.colors.darkText[100] : theme.colors.lightText}>
                  {selectedClient || 'Search by name'}
                </Text>
                <ChevronDownIcon color={theme.colors.darkText[100]} width={20} height={20} />
              </TouchableOpacity>
            </View>

            {/* Service Search */}
            <View style={styles.formSection}>
              <Text
                size={theme.typography.fontSizes.sm}
                weight="medium"
                color={theme.colors.darkText[100]}
                style={{ marginBottom: theme.spacing.sm }}>
                Service
              </Text>
              <TouchableOpacity
                style={styles.dropdown}
                activeOpacity={0.7}
                onPress={() => setSelectedService('Haircut')}>
                <Text
                  size={theme.typography.fontSizes.md}
                  color={selectedService ? theme.colors.darkText[100] : theme.colors.lightText}>
                  {selectedService || 'Search by name'}
                </Text>
                <ChevronDownIcon color={theme.colors.darkText[100]} width={20} height={20} />
              </TouchableOpacity>
            </View>

            {/* Services List */}
            <View style={styles.servicesSection}>
              <Text
                size={theme.typography.fontSizes.lg}
                weight="semiBold"
                color={theme.colors.darkText[100]}
                style={{ marginBottom: theme.spacing.md }}>
                HAIR & STYLING
              </Text>

              <View style={styles.servicesList}>
                {services.map((service) => (
                  <TouchableOpacity
                    key={service.id}
                    style={styles.serviceItem}
                    onPress={() => handleServiceToggle(service.id)}
                    activeOpacity={0.7}>
                    <View style={styles.serviceItemLeft}>
                      <View style={styles.checkbox}>
                        {selectedServices.includes(service.id) && (
                          <View style={styles.checkboxInner} />
                        )}
                      </View>
                      <View style={styles.serviceInfo}>
                        <Text
                          size={theme.typography.fontSizes.md}
                          weight="medium"
                          color={theme.colors.darkText[100]}>
                          {service.name}
                        </Text>
                        {service.description && (
                          <Text
                            size={theme.typography.fontSizes.xs}
                            color={theme.colors.lightText}
                            style={{ marginTop: 4 }}>
                            {service.description}
                          </Text>
                        )}
                      </View>
                    </View>
                    <View style={styles.servicePrice}>
                      <Text
                        size={theme.typography.fontSizes.sm}
                        weight="medium"
                        color={theme.colors.darkText[100]}
                        style={{ textAlign: 'right' }}>
                        Starting {service.price}$
                      </Text>
                      <Text
                        size={theme.typography.fontSizes.xs}
                        color={theme.colors.lightText}
                        style={{ textAlign: 'right' }}>
                        {service.duration} min
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        );
      case 'professional':
        return (
          <View style={styles.placeholderContent}>
            <Text size={theme.typography.fontSizes.lg} weight="medium">
              Professional Selection
            </Text>
            <Text size={theme.typography.fontSizes.md} color={theme.colors.lightText}>
              This step will show available professionals
            </Text>
          </View>
        );
      case 'datetime':
        return (
          <View style={styles.placeholderContent}>
            <Text size={theme.typography.fontSizes.lg} weight="medium">
              Date & Time Selection
            </Text>
            <Text size={theme.typography.fontSizes.md} color={theme.colors.lightText}>
              This step will show calendar and time slots
            </Text>
          </View>
        );
      case 'confirm':
        return (
          <View style={styles.placeholderContent}>
            <Text size={theme.typography.fontSizes.lg} weight="medium">
              Confirmation
            </Text>
            <Text size={theme.typography.fontSizes.md} color={theme.colors.lightText}>
              This step will show booking summary
            </Text>
          </View>
        );
      default:
        return null;
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
          ADD AN APPOINTMENT
        </Text>

        <View style={{ width: 30 }} />
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
          <Button title="Confirm Appointment" onPress={() => router.back()} />
        ) : (
          <Button title="Next" onPress={handleNext} disabled={!canProceed()} />
        )}
      </View>
    </View>
  );
};

export default AddAppointment;

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
    marginBottom: theme.spacing.xl,
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
    marginTop: 13,
    marginHorizontal: -25,
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
    marginTop: 4,
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
  },
  formContent: {
    paddingHorizontal: theme.spacing.lg,
  },
  formSection: {
    marginBottom: theme.spacing.xl,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.white.DEFAULT,
    borderRadius: theme.radii.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  radioGroup: {
    flexDirection: 'row',
    gap: theme.spacing.xl,
    marginBottom: theme.spacing.md,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.colors.darkText[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.darkText[100],
  },
  servicesSection: {
    marginTop: theme.spacing.md,
  },
  servicesList: {
    gap: theme.spacing.md,
  },
  serviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  serviceItemLeft: {
    flexDirection: 'row',
    flex: 1,
    gap: theme.spacing.md,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: theme.colors.darkText[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxInner: {
    width: 14,
    height: 14,
    borderRadius: 2,
    backgroundColor: theme.colors.darkText[100],
  },
  serviceInfo: {
    flex: 1,
  },
  servicePrice: {
    alignItems: 'flex-end',
    marginLeft: theme.spacing.md,
  },
  placeholderContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  footer: {
    padding: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
});
