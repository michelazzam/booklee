import { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, FlatList, Pressable } from 'react-native';
import { theme } from '~/src/constants/theme';
import { Text, HeaderNavigation } from '~/src/components/base';
import ChevronRightIcon from '~/src/assets/icons/ChevronRightIcon';
import { useRouter } from 'expo-router';

// Mock data types
interface Appointment {
  id: string;
  customerName: string;
  dateTime: string;
  servicesCount: number;
  totalMinutes: number;
  status: 'today' | 'future' | 'past';
}

type FilterType = 'all' | 'today' | 'future';

const Appointments = () => {
  /*** Constants ***/
  const router = useRouter();

  /*** State ***/
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('today');

  /*** Mock Data ***/
  const allAppointments: Appointment[] = [
    {
      id: '1',
      customerName: 'John Doe',
      dateTime: 'THU 23 AUG - 09:00',
      servicesCount: 2,
      totalMinutes: 20,
      status: 'today',
    },
    {
      id: '2',
      customerName: 'John Doe',
      dateTime: 'THU 23 AUG - 09:00',
      servicesCount: 2,
      totalMinutes: 20,
      status: 'today',
    },
    {
      id: '3',
      customerName: 'John Doe',
      dateTime: 'THU 23 AUG - 09:00',
      servicesCount: 2,
      totalMinutes: 20,
      status: 'today',
    },
    {
      id: '4',
      customerName: 'John Doe',
      dateTime: 'THU 23 AUG - 09:00',
      servicesCount: 2,
      totalMinutes: 20,
      status: 'today',
    },
    {
      id: '5',
      customerName: 'John Doe',
      dateTime: 'THU 23 AUG - 09:00',
      servicesCount: 2,
      totalMinutes: 20,
      status: 'future',
    },
    {
      id: '6',
      customerName: 'John Doe',
      dateTime: 'THU 23 AUG - 09:00',
      servicesCount: 2,
      totalMinutes: 20,
      status: 'future',
    },
    {
      id: '7',
      customerName: 'John Doe',
      dateTime: 'THU 23 AUG - 09:00',
      servicesCount: 2,
      totalMinutes: 20,
      status: 'future',
    },
    {
      id: '8',
      customerName: 'John Doe',
      dateTime: 'THU 23 AUG - 09:00',
      servicesCount: 2,
      totalMinutes: 20,
      status: 'future',
    },
    {
      id: '9',
      customerName: 'John Doe',
      dateTime: 'THU 23 AUG - 09:00',
      servicesCount: 2,
      totalMinutes: 20,
      status: 'today',
    },
    {
      id: '10',
      customerName: 'John Doe',
      dateTime: 'THU 23 AUG - 09:00',
      servicesCount: 2,
      totalMinutes: 20,
      status: 'today',
    },
  ];

  /*** Computed Values ***/
  const filteredAppointments = allAppointments.filter((appointment) => {
    if (selectedFilter === 'all') return true;
    return appointment.status === selectedFilter;
  });

  /*** Handlers ***/
  const handleAddAppointment = () => {
    router.push('/(dashboard)/dashboard/AddApointment');
  };

  /*** Render Functions ***/
  const renderAppointmentCard = ({ item }: { item: Appointment }) => (
    <TouchableOpacity style={styles.appointmentCard} activeOpacity={0.7}>
      <View style={styles.appointmentContent}>
        <Text
          size={theme.typography.fontSizes.md}
          weight="semiBold"
          color={theme.colors.darkText[100]}>
          {item.customerName}
        </Text>
        <Text
          size={theme.typography.fontSizes.xs}
          weight="regular"
          color={theme.colors.lightText}
          style={{ marginTop: 2 }}>
          {item.dateTime}
        </Text>
        <Text
          size={theme.typography.fontSizes.xs}
          weight="regular"
          color={theme.colors.lightText}
          style={{ marginTop: 4 }}>
          {item.servicesCount} Services
        </Text>
        <Text size={theme.typography.fontSizes.xs} weight="regular" color={theme.colors.lightText}>
          Total min: ${item.totalMinutes}
        </Text>
      </View>
      <ChevronRightIcon color={theme.colors.lightText} width={20} height={20} />
    </TouchableOpacity>
  );

  const renderFilterTab = (filter: FilterType, label: string) => {
    const isSelected = selectedFilter === filter;
    return (
      <Pressable
        key={filter}
        style={[styles.filterTab, isSelected && styles.filterTabActive]}
        onPress={() => setSelectedFilter(filter)}>
        <Text
          size={theme.typography.fontSizes.sm}
          weight={isSelected ? 'semiBold' : 'regular'}
          color={isSelected ? theme.colors.white.DEFAULT : theme.colors.darkText[100]}>
          {label}
        </Text>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <HeaderNavigation
        title="APPOINTMENTS"
        showBackButton={true}
        rightIcon={
          <TouchableOpacity onPress={handleAddAppointment} activeOpacity={0.7}>
            <Text
              size={theme.typography.fontSizes.md}
              weight="medium"
              color={theme.colors.darkText[100]}>
              Add
            </Text>
          </TouchableOpacity>
        }
      />

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}>
        {/* Filter Tabs */}
        <View style={styles.filtersContainer}>
          {renderFilterTab('all', 'All')}
          {renderFilterTab('today', 'Today')}
          {renderFilterTab('future', 'Future')}
        </View>

        {/* Appointments Grid */}
        <FlatList
          data={filteredAppointments}
          keyExtractor={(item) => item.id}
          renderItem={renderAppointmentCard}
          numColumns={2}
          columnWrapperStyle={styles.appointmentsRow}
          scrollEnabled={false}
          contentContainerStyle={styles.appointmentsGrid}
        />
      </ScrollView>
    </View>
  );
};

export default Appointments;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white.DEFAULT,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: theme.spacing.lg,
  },
  filtersContainer: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  filterTab: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.radii.sm,
    backgroundColor: theme.colors.white.DEFAULT,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  filterTabActive: {
    backgroundColor: theme.colors.primaryGreen[100],
    borderColor: theme.colors.primaryGreen[100],
  },
  appointmentsGrid: {
    paddingBottom: theme.spacing['3xl'],
  },
  appointmentsRow: {
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  appointmentCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.white.DEFAULT,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.soft,
  },
  appointmentContent: {
    flex: 1,
  },
});
