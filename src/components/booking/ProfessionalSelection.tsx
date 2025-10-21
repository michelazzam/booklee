import { View, StyleSheet } from 'react-native';
import { Text } from '../base';
import { AnimatedButton } from './AnimatedButton';
import { CoupleIcon, GroupIcon, StarIcon } from '~/src/assets/icons';
import { theme } from '~/src/constants/theme';
import type { Employee } from '~/src/services';

type ProfessionalSelectionProps = {
  selectedProfessional: Employee | 'any' | undefined;
  employees: Employee[];
  selectedDate?: string;
  selectedTime?: string;
  serviceDuration: number;
  serviceId: string;
  hasProfessionalConflict: (
    professionalId: string,
    date: string,
    time: string,
    duration: number,
    excludeServiceId?: string
  ) => boolean;
  onProfessionalSelect: (serviceId: string, employee: Employee | undefined) => void;
};

export const ProfessionalSelection = ({
  selectedProfessional,
  employees,
  selectedDate,
  selectedTime,
  serviceDuration,
  serviceId,
  hasProfessionalConflict,
  onProfessionalSelect,
}: ProfessionalSelectionProps) => {
  return (
    <View style={styles.section}>
      <Text size={theme.typography.fontSizes.md} weight="medium" style={styles.sectionTitle}>
        Select Professional
      </Text>

      <View style={styles.professionalGrid}>
        {/* Any Available Professional Option */}
        <AnimatedButton
          style={styles.professionalOption}
          isSelected={selectedProfessional === 'any'}
          onPress={() => onProfessionalSelect(serviceId, undefined)}>
          <GroupIcon width={24} height={24} />
          <Text size={theme.typography.fontSizes.sm} weight="medium">
            Any Available
          </Text>
        </AnimatedButton>

        {/* Specific Professionals */}
        {employees.map((employee) => {
          // Check if this professional has conflicts with other services
          const hasProfessionalConflictCheck =
            selectedDate && selectedTime
              ? hasProfessionalConflict(
                  employee._id,
                  selectedDate,
                  selectedTime,
                  serviceDuration,
                  serviceId
                )
              : false;

          return (
            <AnimatedButton
              key={employee._id}
              style={[
                styles.professionalOption,
                hasProfessionalConflictCheck && styles.conflictProfessionalOption,
              ]}
              isSelected={
                selectedProfessional &&
                typeof selectedProfessional === 'object' &&
                selectedProfessional._id === employee._id
              }
              onPress={() => onProfessionalSelect(serviceId, employee)}>
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
                {hasProfessionalConflictCheck && (
                  <Text
                    size={theme.typography.fontSizes.xs}
                    color={theme.colors.red['100']}
                    style={styles.conflictText}>
                    Has conflict
                  </Text>
                )}
              </View>
            </AnimatedButton>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
