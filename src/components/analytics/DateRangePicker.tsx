import { useState, useRef, useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Pressable } from 'react-native';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { Calendar } from 'react-native-calendars';
import { theme } from '~/src/constants/theme';
import { Text, Icon } from '~/src/components/base';
import { format } from 'date-fns';
import ChevronRightIcon from '~/src/assets/icons/ChevronRightIcon';
import XIcon from '~/src/assets/icons/XIcon';

type ViewMode = 'day' | 'month' | 'year';
type SelectionMode = 'from' | 'to';

interface DateRangePickerProps {
  isVisible: boolean;
  onClose: () => void;
  onSelect: (fromDate: string, toDate: string) => void;
  initialFromDate?: string;
  initialToDate?: string;
}

const DateRangePicker = ({
  isVisible,
  onClose,
  onSelect,
  initialFromDate,
  initialToDate,
}: DateRangePickerProps) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['90%'], []);

  const [viewMode, setViewMode] = useState<ViewMode>('day');
  const [selectionMode, setSelectionMode] = useState<SelectionMode>('from');
  const [fromDate, setFromDate] = useState<Date | null>(
    initialFromDate ? new Date(initialFromDate) : null
  );
  const [toDate, setToDate] = useState<Date | null>(initialToDate ? new Date(initialToDate) : null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  // Month names
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  // Generate years array (2020-2025)
  const years = Array.from({ length: 6 }, (_, i) => 2020 + i);

  // Format date for display
  const formatDateDisplay = (date: Date | null) => {
    if (!date) return '';
    return format(date, 'dd MMM yyyy').toUpperCase();
  };

  // Handle opening bottom sheet
  useMemo(() => {
    if (isVisible) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [isVisible]);

  // Handle year selection
  const handleYearSelect = (year: number) => {
    setCurrentYear(year);
    setViewMode('month');
  };

  // Handle month selection
  const handleMonthSelect = (monthIndex: number) => {
    setCurrentMonth(monthIndex);
    setViewMode('day');
  };

  // Handle day selection
  const handleDaySelect = (day: any) => {
    if (day && day.dateString) {
      const selectedDate = new Date(day.dateString);

      if (selectionMode === 'from') {
        setFromDate(selectedDate);
        setSelectionMode('to');
      } else {
        setToDate(selectedDate);
      }
    }
  };

  // Handle select button
  const handleSelectPress = () => {
    if (fromDate && toDate) {
      onSelect(format(fromDate, 'yyyy-MM-dd'), format(toDate, 'yyyy-MM-dd'));
      onClose();
    }
  };

  // Get marked dates for calendar
  const getMarkedDates = () => {
    const marked: any = {};

    if (fromDate) {
      const fromString = format(fromDate, 'yyyy-MM-dd');
      marked[fromString] = {
        selected: true,
        selectedColor: theme.colors.primaryGreen[100],
        selectedTextColor: theme.colors.white.DEFAULT,
      };
    }

    if (toDate) {
      const toString = format(toDate, 'yyyy-MM-dd');
      marked[toString] = {
        selected: true,
        selectedColor: theme.colors.primaryGreen[100],
        selectedTextColor: theme.colors.white.DEFAULT,
      };
    }

    return marked;
  };

  // Render backdrop
  const renderBackdrop = (props: any) => (
    <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.5} />
  );

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      onClose={onClose}
      backdropComponent={renderBackdrop}
      handleIndicatorStyle={styles.handleIndicator}>
      <BottomSheetView style={styles.contentContainer}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerBar} />
          <View style={styles.titleRow}>
            <Text size={theme.typography.fontSizes.lg} weight="semiBold">
              CHOOSE RANGE
            </Text>
            <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
              <XIcon width={24} height={24} color={theme.colors.darkText[100]} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollContent}>
          {/* From Input */}
          <View style={styles.inputSection}>
            <Text
              size={theme.typography.fontSizes.sm}
              weight="medium"
              color={theme.colors.darkText[100]}
              style={styles.label}>
              From
            </Text>
            <Pressable
              style={[styles.dateInput, selectionMode === 'from' && styles.activeInput]}
              onPress={() => {
                setSelectionMode('from');
                setViewMode('day');
              }}>
              <Text
                size={theme.typography.fontSizes.md}
                color={fromDate ? theme.colors.darkText[100] : theme.colors.lightText}>
                {formatDateDisplay(fromDate) || 'Select date'}
              </Text>
              <Icon name="calendar-blank-outline" size={20} color={theme.colors.darkText[100]} />
            </Pressable>
          </View>

          {/* To Input */}
          <View style={styles.inputSection}>
            <Text
              size={theme.typography.fontSizes.sm}
              weight="medium"
              color={theme.colors.darkText[100]}
              style={styles.label}>
              To
            </Text>
            <Pressable
              style={[styles.dateInput, selectionMode === 'to' && styles.activeInput]}
              onPress={() => {
                setSelectionMode('to');
                setViewMode('day');
              }}>
              <Text
                size={theme.typography.fontSizes.md}
                color={toDate ? theme.colors.darkText[100] : theme.colors.lightText}>
                {formatDateDisplay(toDate) || 'Select date'}
              </Text>
              <Icon name="calendar-blank-outline" size={20} color={theme.colors.darkText[100]} />
            </Pressable>
          </View>

          {/* Calendar Section */}
          <View style={styles.calendarSection}>
            {/* Month/Year Header */}
            <View style={styles.calendarHeader}>
              <TouchableOpacity
                onPress={() => {
                  if (viewMode === 'day') {
                    if (currentMonth === 0) {
                      setCurrentMonth(11);
                      setCurrentYear(currentYear - 1);
                    } else {
                      setCurrentMonth(currentMonth - 1);
                    }
                  }
                }}
                disabled={viewMode !== 'day'}
                style={{ transform: [{ rotate: '180deg' }] }}>
                <ChevronRightIcon
                  width={24}
                  height={24}
                  color={viewMode === 'day' ? theme.colors.darkText[100] : theme.colors.lightText}
                />
              </TouchableOpacity>

              <View style={styles.headerButtons}>
                <TouchableOpacity onPress={() => setViewMode('month')} style={styles.headerButton}>
                  <Text size={theme.typography.fontSizes.lg} weight="semiBold">
                    {months[currentMonth]}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setViewMode('year')} style={styles.headerButton}>
                  <Text size={theme.typography.fontSizes.lg} weight="semiBold">
                    {currentYear}
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={() => {
                  if (viewMode === 'day') {
                    if (currentMonth === 11) {
                      setCurrentMonth(0);
                      setCurrentYear(currentYear + 1);
                    } else {
                      setCurrentMonth(currentMonth + 1);
                    }
                  }
                }}
                disabled={viewMode !== 'day'}>
                <ChevronRightIcon
                  width={24}
                  height={24}
                  color={viewMode === 'day' ? theme.colors.darkText[100] : theme.colors.lightText}
                />
              </TouchableOpacity>
            </View>

            {/* Calendar Views */}
            {viewMode === 'day' && (
              <Calendar
                current={`${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-01`}
                onDayPress={handleDaySelect}
                markedDates={getMarkedDates()}
                hideArrows={true}
                hideDayNames={false}
                renderHeader={() => null}
                theme={{
                  backgroundColor: 'transparent',
                  calendarBackground: 'transparent',
                  textSectionTitleColor: theme.colors.darkText[50],
                  selectedDayBackgroundColor: theme.colors.primaryGreen[100],
                  selectedDayTextColor: theme.colors.white.DEFAULT,
                  todayTextColor: theme.colors.primaryGreen[100],
                  dayTextColor: theme.colors.darkText[100],
                  textDisabledColor: theme.colors.grey[100],
                  textDayFontFamily: 'Montserrat-Regular',
                  textMonthFontFamily: 'Montserrat-Medium',
                  textDayHeaderFontFamily: 'Montserrat-Regular',
                  textDayFontSize: theme.typography.fontSizes.md,
                  textMonthFontSize: 0,
                  textDayHeaderFontSize: theme.typography.fontSizes.sm,
                }}
                firstDay={1}
              />
            )}

            {viewMode === 'year' && (
              <View style={styles.gridContainer}>
                {years.map((year) => (
                  <TouchableOpacity
                    key={year}
                    style={[styles.gridItem, currentYear === year && styles.selectedGridItem]}
                    onPress={() => handleYearSelect(year)}
                    activeOpacity={0.7}>
                    <Text
                      size={theme.typography.fontSizes.md}
                      weight={currentYear === year ? 'semiBold' : 'regular'}
                      color={theme.colors.darkText[100]}>
                      {year}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {viewMode === 'month' && (
              <View style={styles.gridContainer}>
                {months.map((month, index) => (
                  <TouchableOpacity
                    key={month}
                    style={[styles.gridItem, currentMonth === index && styles.selectedGridItem]}
                    onPress={() => handleMonthSelect(index)}
                    activeOpacity={0.7}>
                    <Text
                      size={theme.typography.fontSizes.md}
                      weight={currentMonth === index ? 'semiBold' : 'regular'}
                      color={theme.colors.darkText[100]}>
                      {month}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </ScrollView>

        {/* Select Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.selectButton, (!fromDate || !toDate) && styles.selectButtonDisabled]}
            onPress={handleSelectPress}
            disabled={!fromDate || !toDate}
            activeOpacity={0.8}>
            <Text
              size={theme.typography.fontSizes.md}
              weight="semiBold"
              color={theme.colors.white.DEFAULT}>
              Select
            </Text>
          </TouchableOpacity>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
};

export default DateRangePicker;

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    backgroundColor: theme.colors.white.DEFAULT,
  },
  handleIndicator: {
    backgroundColor: theme.colors.darkText[100],
    width: 40,
    height: 4,
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerBar: {
    width: 60,
    height: 4,
    backgroundColor: theme.colors.darkText[100],
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: theme.spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  scrollContent: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
  },
  inputSection: {
    marginTop: theme.spacing.lg,
  },
  label: {
    marginBottom: theme.spacing.sm,
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.md,
    backgroundColor: theme.colors.white.DEFAULT,
  },
  activeInput: {
    borderColor: theme.colors.primaryGreen[100],
    borderWidth: 2,
  },
  calendarSection: {
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  headerButton: {
    paddingHorizontal: theme.spacing.sm,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.lg,
  },
  gridItem: {
    width: '30%',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedGridItem: {
    borderColor: theme.colors.darkText[100],
    borderWidth: 2,
    backgroundColor: theme.colors.white.DEFAULT,
  },
  footer: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  selectButton: {
    backgroundColor: theme.colors.darkText[100],
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.radii.md,
    alignItems: 'center',
  },
  selectButtonDisabled: {
    backgroundColor: theme.colors.grey[100],
    opacity: 0.5,
  },
});
