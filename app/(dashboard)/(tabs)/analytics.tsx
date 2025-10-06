import { useState, useMemo } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  Modal,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { theme } from '~/src/constants/theme';
import DashboardHeader from '~/src/components/DashboardHeader';
import { Text } from '~/src/components/base';
import ChevronDownIcon from '~/src/assets/icons/ChevronDownIcon';
import { UserServices, AnalyticsServices, type AnalyticsPeriod } from '~/src/services';
import { useEffect } from 'react';
import { DateRangePicker } from '~/src/components/analytics';
import { format } from 'date-fns';

const Analytics = () => {
  /*** State ***/
  const [selectedLocationId, setSelectedLocationId] = useState<string>();
  const [activeTab, setActiveTab] = useState<'global' | 'employee'>('global');
  const [selectedPeriod, setSelectedPeriod] = useState<AnalyticsPeriod | 'custom'>('3m');
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [fromDate, setFromDate] = useState<string | null>(null);
  const [toDate, setToDate] = useState<string | null>(null);
  const [periodDropdownVisible, setPeriodDropdownVisible] = useState(false);
  const [employeeDropdownVisible, setEmployeeDropdownVisible] = useState(false);
  const [dateRangePickerVisible, setDateRangePickerVisible] = useState(false);

  /*** Hooks ***/
  const { data: locations = [] } = UserServices.useGetUserLocations();
  const { data: locationsWithData } = UserServices.useGetUserLocationsWithData();
  const { width: screenWidth } = useWindowDimensions();
  
  // Fetch analytics data
  const { data: analyticsData, isLoading: isLoadingAnalytics } = AnalyticsServices.useGetAnalytics({
    period: selectedPeriod === 'custom' ? '3m' : selectedPeriod,
    locationId: selectedLocationId,
    employeeId: activeTab === 'employee' ? selectedEmployee || undefined : undefined,
  });

  /*** Constants ***/
  const tabs = [
    { name: 'Global', value: 'global' as const },
    { name: 'Employee', value: 'employee' as const },
  ];

  const periodOptions = [
    { label: '1 week', value: '7d' as AnalyticsPeriod },
    { label: '3 months', value: '3m' as AnalyticsPeriod },
    { label: '1 year', value: '1y' as AnalyticsPeriod },
    { label: 'Custom range', value: 'custom' as const },
  ];

  // Get employees from the selected location
  const employees = useMemo(() => {
    if (!selectedLocationId || !locationsWithData?.locationData) {
      return [];
    }
    const locationData = locationsWithData.locationData[selectedLocationId];
    return locationData?.employees?.map((emp) => ({
      id: emp._id,
      name: emp.name,
    })) || [];
  }, [selectedLocationId, locationsWithData]);

  // Set default employee when switching to employee tab or when location changes
  useEffect(() => {
    if (activeTab === 'employee' && employees.length > 0) {
      // If no employee selected or selected employee not in current location's employees
      const isEmployeeInList = employees.some((emp) => emp.id === selectedEmployee);
      if (!selectedEmployee || !isEmployeeInList) {
        setSelectedEmployee(employees[0].id);
      }
    }
  }, [activeTab, employees, selectedEmployee]);

  // Format date range display
  const getDateRangeDisplay = () => {
    if (selectedPeriod === 'custom' && fromDate && toDate) {
      const from = format(new Date(fromDate), 'dd MMM yyyy');
      const to = format(new Date(toDate), 'dd MMM yyyy');
      return `${from} - ${to}`;
    }

    // Map period values to display labels
    const periodLabels: Record<AnalyticsPeriod, string> = {
      '7d': '1 week',
      '3m': '3 months',
      '1y': '1 year',
    };

    return selectedPeriod === 'custom' ? '3 months' : periodLabels[selectedPeriod] || '3 months';
  };

  // Get selected employee name
  const getSelectedEmployeeName = () => {
    if (employees.length === 0) {
      return 'No employees available';
    }
    const employee = employees.find((emp) => emp.id === selectedEmployee);
    return employee?.name || 'Select employee';
  };

  // Transform API data for charts
  const chartData = useMemo(() => {
    if (!analyticsData?.revenue?.series || analyticsData.revenue.series.length === 0) {
      return {
        labels: [''],
        datasets: [{ data: [0], strokeWidth: 2 }],
      };
    }
    return {
      labels: analyticsData.revenue.series.map((item) => item.label),
      datasets: [
        {
          data: analyticsData.revenue.series.map((item) => item.value),
          strokeWidth: 2,
        },
      ],
    };
  }, [analyticsData?.revenue?.series]);

  const appointmentsChartData = useMemo(() => {
    if (!analyticsData?.appointments?.series || analyticsData.appointments.series.length === 0) {
      return {
        labels: [''],
        datasets: [{ data: [0], strokeWidth: 2 }],
      };
    }
    return {
      labels: analyticsData.appointments.series.map((item) => item.label),
      datasets: [
        {
          data: analyticsData.appointments.series.map((item) => item.value),
          strokeWidth: 2,
        },
      ],
    };
  }, [analyticsData?.appointments?.series]);

  const serviceDistributionData = useMemo(() => {
    return analyticsData?.services || [];
  }, [analyticsData?.services]);

  /*** Animations ***/
  const tabWidth = useMemo(() => screenWidth / tabs.length, [screenWidth]);
  const activeIndex = useMemo(() => tabs.findIndex((tab) => tab.value === activeTab), [activeTab]);
  const underlinePosition = useSharedValue(0);

  const animatedUnderlineStyle = useAnimatedStyle(() => {
    return {
      width: tabWidth,
      transform: [{ translateX: underlinePosition.value }],
    };
  });

  useEffect(() => {
    const newPosition = activeIndex * tabWidth;
    underlinePosition.value = withSpring(newPosition, {
      damping: 15,
      stiffness: 150,
    });
  }, [activeIndex, tabWidth]);

  const chartConfig = {
    backgroundColor: 'transparent',
    backgroundGradientFrom: theme.colors.white.DEFAULT,
    backgroundGradientTo: theme.colors.white.DEFAULT,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(31, 31, 31, ${opacity})`, // Black line
    strokeWidth: 2,
    propsForBackgroundLines: {
      strokeDasharray: '',
      stroke: theme.colors.border,
      strokeWidth: 0.5,
    },
    propsForDots: {
      r: '0',
    },
    fillShadowGradient: theme.colors.white.DEFAULT,
    fillShadowGradientOpacity: 0,
    labelColor: (opacity = 1) => `rgba(115, 115, 115, ${opacity * 0.6})`, // Light grey for labels
    propsForLabels: {
      fontSize: 10,
    },
  };

  /*** Handlers ***/
  const handleLocationChange = (locationId: string) => {
    setSelectedLocationId(locationId);
    // Reset selected employee when location changes
    setSelectedEmployee(null);
  };

  const handlePeriodSelect = (period: string) => {
    if (period === 'custom') {
      setPeriodDropdownVisible(false);
      setDateRangePickerVisible(true);
      setSelectedPeriod('custom');
    } else {
      setSelectedPeriod(period as AnalyticsPeriod);
      setPeriodDropdownVisible(false);
    }
  };

  const handleDateRangeSelect = (from: string, to: string) => {
    setFromDate(from);
    setToDate(to);
    // Note: Custom date range is not supported by the API yet,
    // so we'll keep using the last selected period
  };

  /*** Render Functions ***/
  const renderGlobalTab = () => (
    <ScrollView
      style={styles.tabContent}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}>
      {/* Time Period Selector */}
      <TouchableOpacity
        style={styles.timePeriodSelector}
        onPress={() => setPeriodDropdownVisible(true)}
        activeOpacity={0.7}>
        <Text
          size={theme.typography.fontSizes.md}
          weight="regular"
          color={theme.colors.darkText[100]}>
          {getDateRangeDisplay()}
        </Text>
        <ChevronDownIcon color={theme.colors.darkText[100]} width={20} height={20} />
      </TouchableOpacity>

      {/* Revenue Card */}
      <View style={styles.metricCard}>
        <View style={styles.metricHeader}>
          <Text
            size={theme.typography.fontSizes.lg}
            weight="semiBold"
            color={theme.colors.darkText[100]}>
            Revenue ($)
          </Text>
          <View style={styles.metricValueContainer}>
            <Text
              size={theme.typography.fontSizes['2xl']}
              weight="bold"
              color={theme.colors.darkText[100]}>
              2,400
            </Text>
            <Text
              size={theme.typography.fontSizes.sm}
              weight="medium"
              color={theme.colors.green[100]}
              style={{ marginLeft: theme.spacing.sm }}>
              (+20%)
            </Text>
          </View>
        </View>
        <LineChart
          data={chartData}
          width={screenWidth}
          height={200}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
          withInnerLines={true}
          withOuterLines={false}
          withVerticalLabels={true}
          withHorizontalLabels={true}
          withDots={false}
          segments={4}
          yAxisSuffix=""
          yAxisInterval={1}
          formatYLabel={(value) => {
            const num = parseFloat(value);
            if (num >= 1000) {
              return `${(num / 1000).toFixed(0)}k`;
            }
            return value;
          }}
        />
      </View>

      {/* Appointments Card */}
      <View style={styles.metricCard}>
        <View style={styles.metricHeader}>
          <Text
            size={theme.typography.fontSizes.lg}
            weight="semiBold"
            color={theme.colors.darkText[100]}>
            Appointments
          </Text>
          <View style={styles.metricValueContainer}>
            <Text
              size={theme.typography.fontSizes['2xl']}
              weight="bold"
              color={theme.colors.darkText[100]}>
              67
            </Text>
            <Text
              size={theme.typography.fontSizes.sm}
              weight="medium"
              color={theme.colors.green[100]}
              style={{ marginLeft: theme.spacing.sm }}>
              (+20%)
            </Text>
          </View>
        </View>
        <LineChart
          data={appointmentsChartData}
          width={screenWidth}
          height={200}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
          withInnerLines={true}
          withOuterLines={false}
          withVerticalLabels={true}
          withHorizontalLabels={true}
          withDots={false}
          segments={4}
          yAxisSuffix=""
          yAxisInterval={1}
        />
      </View>

      {/* Service Distribution Card */}
      <View style={styles.metricCard}>
        <View style={styles.metricHeader}>
          <Text
            size={theme.typography.fontSizes.lg}
            weight="semiBold"
            color={theme.colors.darkText[100]}>
            Service Distribution
          </Text>
        </View>
        {isLoadingAnalytics ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.darkText[100]} />
          </View>
        ) : serviceDistributionData.length > 0 ? (
          <View style={styles.serviceList}>
            {serviceDistributionData.map((service, index) => (
              <View key={service.serviceId || index} style={styles.serviceItem}>
                <View style={styles.serviceInfo}>
                  <Text
                    size={theme.typography.fontSizes.md}
                    weight="semiBold"
                    color={theme.colors.darkText[100]}>
                    {service.name}
                  </Text>
                  <Text
                    size={theme.typography.fontSizes.sm}
                    weight="regular"
                    color={theme.colors.lightText}>
                    {service.appointments} appointment{service.appointments !== 1 ? 's' : ''}
                  </Text>
                </View>
                <Text
                  size={theme.typography.fontSizes.lg}
                  weight="bold"
                  color={theme.colors.darkText[100]}>
                  ${service.revenue.toLocaleString()}
                </Text>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text
              size={theme.typography.fontSizes.md}
              weight="regular"
              color={theme.colors.lightText}>
              No service data available
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );

  const renderEmployeeTab = () => (
    <ScrollView
      style={styles.tabContent}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}>
      {/* Employee Selector */}
      <TouchableOpacity
        style={styles.timePeriodSelector}
        onPress={() => setEmployeeDropdownVisible(true)}
        activeOpacity={0.7}>
        <Text
          size={theme.typography.fontSizes.md}
          weight="regular"
          color={theme.colors.darkText[100]}>
          {getSelectedEmployeeName()}
        </Text>
        <ChevronDownIcon color={theme.colors.darkText[100]} width={20} height={20} />
      </TouchableOpacity>

      {/* Time Period Selector */}
      <TouchableOpacity
        style={styles.timePeriodSelector}
        onPress={() => setPeriodDropdownVisible(true)}
        activeOpacity={0.7}>
        <Text
          size={theme.typography.fontSizes.md}
          weight="regular"
          color={theme.colors.darkText[100]}>
          {getDateRangeDisplay()}
        </Text>
        <ChevronDownIcon color={theme.colors.darkText[100]} width={20} height={20} />
      </TouchableOpacity>

      {/* Revenue Card */}
      <View style={styles.metricCard}>
        <View style={styles.metricHeader}>
          <Text
            size={theme.typography.fontSizes.lg}
            weight="semiBold"
            color={theme.colors.darkText[100]}>
            Revenue ($)
          </Text>
          <View style={styles.metricValueContainer}>
            {isLoadingAnalytics ? (
              <ActivityIndicator size="small" color={theme.colors.darkText[100]} />
            ) : (
              <>
                <Text
                  size={theme.typography.fontSizes['2xl']}
                  weight="bold"
                  color={theme.colors.darkText[100]}>
                  {analyticsData?.revenue?.total?.toLocaleString() || '0'}
                </Text>
              </>
            )}
          </View>
        </View>
        {isLoadingAnalytics ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.darkText[100]} />
          </View>
        ) : (
          <LineChart
            data={chartData}
            width={screenWidth}
            height={200}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
            withInnerLines={true}
            withOuterLines={false}
            withVerticalLabels={true}
            withHorizontalLabels={true}
            withDots={false}
            segments={4}
            yAxisSuffix=""
            yAxisInterval={1}
            formatYLabel={(value) => {
              const num = parseFloat(value);
              if (num >= 1000) {
                return `${(num / 1000).toFixed(0)}k`;
              }
              return value;
            }}
          />
        )}
      </View>

      {/* Appointments Card */}
      <View style={styles.metricCard}>
        <View style={styles.metricHeader}>
          <Text
            size={theme.typography.fontSizes.lg}
            weight="semiBold"
            color={theme.colors.darkText[100]}>
            Appointments
          </Text>
          <View style={styles.metricValueContainer}>
            {isLoadingAnalytics ? (
              <ActivityIndicator size="small" color={theme.colors.darkText[100]} />
            ) : (
              <Text
                size={theme.typography.fontSizes['2xl']}
                weight="bold"
                color={theme.colors.darkText[100]}>
                {analyticsData?.appointments?.total || '0'}
              </Text>
            )}
          </View>
        </View>
        {isLoadingAnalytics ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.darkText[100]} />
          </View>
        ) : (
          <LineChart
            data={appointmentsChartData}
            width={screenWidth}
            height={200}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
            withInnerLines={true}
            withOuterLines={false}
            withVerticalLabels={true}
            withHorizontalLabels={true}
            withDots={false}
            segments={4}
            yAxisSuffix=""
            yAxisInterval={1}
          />
        )}
      </View>
    </ScrollView>
  );

  return (
    <GestureHandlerRootView style={styles.container}>
      <DashboardHeader
        selectedLocationId={selectedLocationId || locations[0]?.id}
        onLocationChange={handleLocationChange}
      />

      <View style={styles.content}>
        {/* Custom Tab Header */}
        <View style={styles.tabHeader}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.value}
              style={[styles.tabButton, { width: tabWidth }]}
              onPress={() => setActiveTab(tab.value)}
              activeOpacity={0.7}>
              <Text
                size={theme.typography.fontSizes.md}
                weight="semiBold"
                color={
                  activeTab === tab.value ? theme.colors.darkText[100] : theme.colors.lightText
                }>
                {tab.name}
              </Text>
            </TouchableOpacity>
          ))}
          <Animated.View style={[styles.underline, animatedUnderlineStyle]} />
        </View>

        {/* Tab Content */}
        {activeTab === 'global' ? renderGlobalTab() : renderEmployeeTab()}
      </View>

      {/* Period Dropdown Modal */}
      <Modal
        visible={periodDropdownVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setPeriodDropdownVisible(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setPeriodDropdownVisible(false)}>
          <View style={styles.dropdownContainer}>
            {periodOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.dropdownItem,
                  selectedPeriod === option.value && styles.selectedDropdownItem,
                ]}
                onPress={() => handlePeriodSelect(option.value)}
                activeOpacity={0.7}>
                <Text
                  size={theme.typography.fontSizes.md}
                  weight={selectedPeriod === option.value ? 'semiBold' : 'regular'}
                  color={theme.colors.darkText[100]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>

      {/* Employee Dropdown Modal */}
      <Modal
        visible={employeeDropdownVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setEmployeeDropdownVisible(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setEmployeeDropdownVisible(false)}>
          <View style={styles.dropdownContainer}>
            {employees.length > 0 ? (
              employees.map((employee) => (
                <TouchableOpacity
                  key={employee.id}
                  style={[
                    styles.dropdownItem,
                    selectedEmployee === employee.id && styles.selectedDropdownItem,
                  ]}
                  onPress={() => {
                    setSelectedEmployee(employee.id);
                    setEmployeeDropdownVisible(false);
                  }}
                  activeOpacity={0.7}>
                  <Text
                    size={theme.typography.fontSizes.md}
                    weight={selectedEmployee === employee.id ? 'semiBold' : 'regular'}
                    color={theme.colors.darkText[100]}>
                    {employee.name}
                  </Text>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.dropdownItem}>
                <Text
                  size={theme.typography.fontSizes.md}
                  weight="regular"
                  color={theme.colors.lightText}
                  style={{ textAlign: 'center' }}>
                  No employees available for this location
                </Text>
              </View>
            )}
          </View>
        </Pressable>
      </Modal>

      {/* Date Range Picker (for Custom Range) */}
      <DateRangePicker
        isVisible={dateRangePickerVisible}
        onClose={() => setDateRangePickerVisible(false)}
        onSelect={handleDateRangeSelect}
        initialFromDate={fromDate || undefined}
        initialToDate={toDate || undefined}
      />
    </GestureHandlerRootView>
  );
};

export default Analytics;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white.DEFAULT,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
  },
  tabHeader: {
    flexDirection: 'row',
    position: 'relative',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    marginBottom: theme.spacing.lg,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
  },
  underline: {
    bottom: 0,
    height: 3,
    position: 'absolute',
    borderRadius: theme.radii.xs,
    backgroundColor: theme.colors.darkText[100],
  },
  tabContent: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: theme.spacing['3xl'],
  },
  timePeriodSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.white.DEFAULT,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.lg,
  },
  metricCard: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.white.DEFAULT,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.soft,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  metricValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chart: {
    marginVertical: theme.spacing.sm,
    borderRadius: theme.radii.sm,
    marginLeft: -theme.spacing.md,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  dropdownContainer: {
    backgroundColor: theme.colors.white.DEFAULT,
    borderRadius: theme.radii.md,
    width: '100%',
    maxWidth: 400,
    paddingVertical: theme.spacing.sm,
    ...theme.shadows.soft,
    shadowRadius: 8,
    shadowOpacity: 0.2,
    elevation: 8,
  },
  dropdownItem: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.radii.sm,
  },
  selectedDropdownItem: {
    backgroundColor: theme.colors.primaryGreen[10],
  },
  loadingContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceList: {
    marginTop: theme.spacing.sm,
  },
  serviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  serviceInfo: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  emptyState: {
    paddingVertical: theme.spacing['2xl'],
    alignItems: 'center',
    justifyContent: 'center',
  },
});
