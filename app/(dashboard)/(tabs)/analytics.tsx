import { useState, useMemo } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  Modal,
  Pressable,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { theme } from '~/src/constants/theme';
import DashboardHeader from '~/src/components/DashboardHeader';
import { Text } from '~/src/components/base';
import ChevronDownIcon from '~/src/assets/icons/ChevronDownIcon';
import { UserServices } from '~/src/services';
import { useEffect } from 'react';
import { DateRangePicker } from '~/src/components/analytics';
import { format } from 'date-fns';

const Analytics = () => {
  /*** State ***/
  const [selectedLocationId, setSelectedLocationId] = useState<string>();
  const [activeTab, setActiveTab] = useState<'global' | 'employee'>('global');
  const [selectedPeriod, setSelectedPeriod] = useState('4-months');
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [fromDate, setFromDate] = useState<string | null>(null);
  const [toDate, setToDate] = useState<string | null>(null);
  const [periodDropdownVisible, setPeriodDropdownVisible] = useState(false);
  const [employeeDropdownVisible, setEmployeeDropdownVisible] = useState(false);
  const [dateRangePickerVisible, setDateRangePickerVisible] = useState(false);

  /*** Hooks ***/
  const { data: locations = [] } = UserServices.useGetUserLocations();
  const { width: screenWidth } = useWindowDimensions();

  /*** Constants ***/
  const tabs = [
    { name: 'Global', value: 'global' as const },
    { name: 'Employee', value: 'employee' as const },
  ];

  const periodOptions = [
    { label: '1 week', value: '1-week' },
    { label: '1 month', value: '1-month' },
    { label: '4 months', value: '4-months' },
    { label: '12 months', value: '12-months' },
    { label: 'Custom range', value: 'custom' },
  ];

  // Sample employees - replace with real API data
  const employees = [
    { id: '1', name: 'Samir Abi Frem' },
    { id: '2', name: 'John Doe' },
    { id: '3', name: 'Jane Smith' },
    { id: '4', name: 'Maria Garcia' },
  ];

  // Set default employee if not selected
  useEffect(() => {
    if (!selectedEmployee && employees.length > 0) {
      setSelectedEmployee(employees[0].id);
    }
  }, [selectedEmployee, employees]);

  // Format date range display
  const getDateRangeDisplay = () => {
    if (selectedPeriod === 'custom' && fromDate && toDate) {
      const from = format(new Date(fromDate), 'dd MMM yyyy');
      const to = format(new Date(toDate), 'dd MMM yyyy');
      return `${from} - ${to}`;
    }

    // Map period values to display labels
    const periodLabels: Record<string, string> = {
      '1-week': '1 week',
      '1-month': '1 month',
      '4-months': '4 months',
      '12-months': '12 months',
    };

    return periodLabels[selectedPeriod] || '4 months';
  };

  // Get selected employee name
  const getSelectedEmployeeName = () => {
    const employee = employees.find((emp) => emp.id === selectedEmployee);
    return employee?.name || 'Select employee';
  };

  // Sample data for charts - replace with real API data
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        data: [1000, 2500, 1000, 2500, 4000],
        strokeWidth: 2,
      },
    ],
  };

  const appointmentsChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        data: [30, 55, 25, 50, 70],
        strokeWidth: 2,
      },
    ],
  };

  const serviceDistributionChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        data: [30, 55, 25, 50, 70],
        strokeWidth: 2,
      },
    ],
  };

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
  };

  const handlePeriodSelect = (period: string) => {
    if (period === 'custom') {
      setPeriodDropdownVisible(false);
      setDateRangePickerVisible(true);
    } else {
      setSelectedPeriod(period);
      setPeriodDropdownVisible(false);
      // Here you would typically refetch the analytics data with the new period
    }
  };

  const handleDateRangeSelect = (from: string, to: string) => {
    setFromDate(from);
    setToDate(to);
    setSelectedPeriod('custom');
    // Here you would typically refetch the analytics data with the new date range
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
          data={serviceDistributionChartData}
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
            {employees.map((employee) => (
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
            ))}
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
});
