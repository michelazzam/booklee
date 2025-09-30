import { useState } from 'react';
import { View, StyleSheet, ScrollView, Switch, TouchableOpacity, FlatList } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { theme } from '~/src/constants/theme';
import DashboardHeader from '~/src/components/DashboardHeader';
import { Text } from '~/src/components/base';
import ChevronRightIcon from '~/src/assets/icons/ChevronRightIcon';
import { AddAppointmentIcon } from '~/src/assets/icons';

// Mock data types
interface Appointment {
  id: string;
  customerName: string;
  dateTime: string;
  servicesCount: number;
  totalMinutes: number;
}

const DashboardHome = () => {
  /*** Constants ***/
  const router = useRouter();

  /*** State ***/
  const [selectedBranch, setSelectedBranch] = useState('Naccache');
  const [workingMode, setWorkingMode] = useState(true);

  /*** Mock Data ***/
  const businessName = 'Salon Massoud';
  const todayRevenue = { amount: 450, change: 20 };
  const todayAppointments = { count: 4, change: -5 };

  const upcomingAppointments: Appointment[] = [
    {
      id: '1',
      customerName: 'John Doe',
      dateTime: 'THU 23 AUG - 09:00',
      servicesCount: 2,
      totalMinutes: 20,
    },
    {
      id: '2',
      customerName: 'John Doe',
      dateTime: 'THU 23 AUG - 09:00',
      servicesCount: 2,
      totalMinutes: 20,
    },
    {
      id: '3',
      customerName: 'John Doe',
      dateTime: 'THU 23 AUG - 09:00',
      servicesCount: 2,
      totalMinutes: 20,
    },
    {
      id: '4',
      customerName: 'John Doe',
      dateTime: 'THU 23 AUG - 09:00',
      servicesCount: 2,
      totalMinutes: 20,
    },
    {
      id: '5',
      customerName: 'John Doe',
      dateTime: 'THU 23 AUG - 09:00',
      servicesCount: 2,
      totalMinutes: 20,
    },
    {
      id: '6',
      customerName: 'John Doe',
      dateTime: 'THU 23 AUG - 09:00',
      servicesCount: 2,
      totalMinutes: 20,
    },
  ];

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

  return (
    <View style={styles.container}>
      <DashboardHeader selectedBranch={selectedBranch} onBranchChange={setSelectedBranch} />

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}>
        {/* Business Name */}
        <Text
          size={theme.typography.fontSizes['2xl']}
          weight="bold"
          color={theme.colors.darkText[100]}
          style={styles.businessName}>
          {businessName}
        </Text>

        {/* Working Mode Toggle */}
        <View style={styles.workingModeContainer}>
          <Text
            size={theme.typography.fontSizes.sm}
            weight="semiBold"
            color={theme.colors.darkText[100]}
            style={{ letterSpacing: 1, textTransform: 'uppercase' }}>
            WORKING MODE
          </Text>
          <View style={styles.switchContainer}>
            <Text
              size={theme.typography.fontSizes.xs}
              weight="medium"
              color={theme.colors.darkText[100]}
              style={{ marginRight: theme.spacing.sm }}>
              {workingMode ? 'ON' : 'OFF'}
            </Text>
            <Switch
              value={workingMode}
              onValueChange={setWorkingMode}
              trackColor={{
                false: theme.colors.grey[100],
                true: theme.colors.primaryGreen[100],
              }}
              thumbColor={theme.colors.white.DEFAULT}
              ios_backgroundColor={theme.colors.grey[100]}
            />
          </View>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          {/* Revenue Card */}
          <View style={styles.statCard}>
            <Text
              size={theme.typography.fontSizes.xs}
              weight="regular"
              color={theme.colors.lightText}
              style={{ marginBottom: theme.spacing.sm }}>
              Today's
            </Text>
            <Text
              size={theme.typography.fontSizes.md}
              weight="semiBold"
              color={theme.colors.darkText[100]}
              style={{ marginBottom: theme.spacing.xs }}>
              Revenue
            </Text>
            <Text
              size={theme.typography.fontSizes['3xl']}
              weight="bold"
              color={theme.colors.darkText[100]}
              style={{ marginBottom: theme.spacing.xs }}>
              {todayRevenue.amount}$
            </Text>
            <Text
              size={theme.typography.fontSizes.sm}
              weight="medium"
              color={theme.colors.green[100]}>
              ({todayRevenue.change > 0 ? '+' : ''}
              {todayRevenue.change}%)
            </Text>
          </View>

          {/* Appointments Card */}
          <View style={styles.statCard}>
            <Text
              size={theme.typography.fontSizes.xs}
              weight="regular"
              color={theme.colors.lightText}
              style={{ marginBottom: theme.spacing.sm }}>
              Today's
            </Text>
            <Text
              size={theme.typography.fontSizes.md}
              weight="semiBold"
              color={theme.colors.darkText[100]}
              style={{ marginBottom: theme.spacing.xs }}>
              Appointments
            </Text>
            <Text
              size={theme.typography.fontSizes['3xl']}
              weight="bold"
              color={theme.colors.darkText[100]}
              style={{ marginBottom: theme.spacing.xs }}>
              {todayAppointments.count}
            </Text>
            <Text
              size={theme.typography.fontSizes.sm}
              weight="medium"
              color={theme.colors.red[100]}>
              ({todayAppointments.change > 0 ? '+' : ''}
              {todayAppointments.change}%)
            </Text>
          </View>
        </View>

        {/* Upcoming Appointments */}
        <View style={styles.appointmentsSection}>
          <View style={styles.sectionHeader}>
            <Text
              size={theme.typography.fontSizes.xs}
              weight="semiBold"
              color={theme.colors.darkText[100]}
              style={{ letterSpacing: 1, textTransform: 'uppercase' }}>
              UPCOMING APPOINTMENTS
            </Text>
            <Link href="/(dashboard)/(screens)/dashboard/appointments" asChild>
              <TouchableOpacity activeOpacity={0.7}>
                <Text
                  size={theme.typography.fontSizes.sm}
                  weight="semiBold"
                  color={theme.colors.darkText[100]}
                  style={{ textDecorationLine: 'underline' }}>
                  see all
                </Text>
              </TouchableOpacity>
            </Link>
          </View>

          <FlatList
            data={upcomingAppointments}
            keyExtractor={(item) => item.id}
            renderItem={renderAppointmentCard}
            numColumns={2}
            columnWrapperStyle={styles.appointmentsRow}
            scrollEnabled={false}
            contentContainerStyle={{ paddingBottom: 100 }}
          />
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.8}
        onPress={() => router.push('/(dashboard)/(screens)/dashboard/AddApointment')}>
        <AddAppointmentIcon color={theme.colors.white.DEFAULT} width={28} height={28} />
      </TouchableOpacity>
    </View>
  );
};

export default DashboardHome;

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
    paddingTop: theme.spacing.lg,
  },
  businessName: {
    marginBottom: theme.spacing.lg,
  },
  workingModeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.white.DEFAULT,
    borderRadius: theme.radii.md,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  statCard: {
    flex: 1,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.white.DEFAULT,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.soft,
  },
  appointmentsSection: {
    marginBottom: theme.spacing['2xl'],
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.md,
    padding: theme.spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
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
  fab: {
    position: 'absolute',
    right: theme.spacing.lg,
    bottom: 20, // Account for tab bar
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.primaryGreen[100],
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.soft,
    shadowRadius: 8,
    shadowOpacity: 0.3,
    elevation: 8,
  },
});
