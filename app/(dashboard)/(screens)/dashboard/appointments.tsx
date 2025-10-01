import { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { theme } from '~/src/constants/theme';
import { Text, HeaderNavigation } from '~/src/components/base';
import ChevronRightIcon from '~/src/assets/icons/ChevronRightIcon';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { DashboardServices, UserServices } from '~/src/services';
import type { DashboardAppointmentType } from '~/src/services';
import { format, isToday } from 'date-fns';

type FilterType = 'all' | 'today' | 'upcoming' | 'past';

const Appointments = () => {
  /*** Constants ***/
  const router = useRouter();
  const params = useLocalSearchParams<{ locationId?: string }>();

  /*** State ***/
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('today');

  /*** Hooks ***/
  const { data: locations = [] } = UserServices.useGetUserLocations();

  const getQueryParams = () => {
    const baseParams = {
      locationId: params.locationId || locations[0]?.id,
    };

    if (selectedFilter === 'upcoming') return { ...baseParams, upcoming: true };
    if (selectedFilter === 'past') return { ...baseParams, past: true };
    return baseParams;
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    DashboardServices.useGetAllAppointments(getQueryParams());

  /*** Computed Values ***/
  const allAppointments = data?.pages.flatMap((page) => page.appointments) || [];

  const filteredAppointments =
    selectedFilter === 'all'
      ? allAppointments
      : selectedFilter === 'today'
        ? allAppointments.filter((apt) => isToday(new Date(apt.startAt)))
        : allAppointments;

  /*** Handlers ***/
  const handleAddAppointment = () => {
    router.push('/(dashboard)/(screens)/dashboard/AddAppointment');
  };

  /*** Handlers ***/
  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  /*** Render Functions ***/
  const renderAppointmentCard = ({ item }: { item: DashboardAppointmentType }) => {
    const formattedDate = format(new Date(item.startAt), 'EEE dd MMM - HH:mm').toUpperCase();

    return (
      <TouchableOpacity style={styles.appointmentCard} activeOpacity={0.7}>
        <View style={styles.appointmentContent}>
          <Text
            size={theme.typography.fontSizes.md}
            weight="semiBold"
            color={theme.colors.darkText[100]}>
            {item.clientName}
          </Text>
          <Text
            size={theme.typography.fontSizes.xs}
            weight="regular"
            color={theme.colors.lightText}
            style={{ marginTop: 2 }}>
            {formattedDate}
          </Text>
          <Text
            size={theme.typography.fontSizes.xs}
            weight="regular"
            color={theme.colors.lightText}
            style={{ marginTop: 4 }}>
            {item.totalServices} Services
          </Text>
          <Text
            size={theme.typography.fontSizes.xs}
            weight="regular"
            color={theme.colors.lightText}>
            Total min: {item.totalDurationMinutes}
          </Text>
        </View>
        <ChevronRightIcon color={theme.colors.lightText} width={20} height={20} />
      </TouchableOpacity>
    );
  };

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={theme.colors.primaryGreen[100]} />
      </View>
    );
  };

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

  if (isLoading) {
    return (
      <View style={styles.container}>
        <HeaderNavigation title="APPOINTMENTS" showBackButton={true} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primaryGreen[100]} />
        </View>
      </View>
    );
  }

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

      <View style={styles.content}>
        {/* Filter Tabs */}
        <View style={styles.filtersContainer}>
          {renderFilterTab('all', 'All')}
          {renderFilterTab('today', 'Today')}
          {renderFilterTab('upcoming', 'Upcoming')}
          {renderFilterTab('past', 'Past')}
        </View>

        {/* Appointments Grid */}
        <FlatList
          data={filteredAppointments}
          keyExtractor={(item) => item.id}
          renderItem={renderAppointmentCard}
          numColumns={2}
          columnWrapperStyle={styles.appointmentsRow}
          contentContainerStyle={styles.appointmentsGrid}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          showsVerticalScrollIndicator={false}
        />
      </View>
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
    paddingHorizontal: theme.spacing.lg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerLoader: {
    paddingVertical: theme.spacing.lg,
    alignItems: 'center',
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
