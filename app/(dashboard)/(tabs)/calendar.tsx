import { View, FlatList, StyleSheet } from 'react-native';
import { useCallback, useState } from 'react';

import { useAppSafeAreaInsets } from '~/src/hooks';
import { theme } from '~/src/constants/theme';

import { DropDown, type DropDownItem } from '~/src/components/dropdowns';
import { CustomCalendar } from '~/src/components/calendars';
import { DashboardHeader } from '~/src/components/utils';
import { Text } from '~/src/components/base';

const TIME_SLOTS = Array.from({ length: 96 }, (_, index) => {
  const hour = Math.floor(index / 4);
  const minute = (index % 4) * 15;
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
});
const dropdownOptions: DropDownItem[] = [{ value: '1', label: 'All Employees' }];

const Calendar = () => {
  /*** Constants ***/
  const { bottom } = useAppSafeAreaInsets();

  /*** State ***/
  const [selectedOption, setSelectedOption] = useState<DropDownItem>(dropdownOptions[0]);

  const RenderHeaderItem = useCallback(() => {
    return (
      <View style={{ gap: theme.spacing.md }}>
        <DropDown
          containerHeight={64}
          items={dropdownOptions}
          onSelect={setSelectedOption}
          selectedValue={selectedOption.value}
        />

        <CustomCalendar onDayPress={() => {}} />
      </View>
    );
  }, [selectedOption]);
  const RenderItem = useCallback(({ item }: { item: string }) => {
    return (
      <View style={styles.dayRow}>
        <Text>{item}</Text>
      </View>
    );
  }, []);

  return (
    <View style={styles.container}>
      <DashboardHeader />

      <FlatList
        data={TIME_SLOTS}
        renderItem={RenderItem}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={RenderHeaderItem}
        ListHeaderComponentStyle={styles.headerContainer}
        contentContainerStyle={[styles.contentContainer, { paddingBottom: bottom }]}
      />
    </View>
  );
};

export default Calendar;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: theme.spacing.md,
  },
  contentContainer: {
    flexGrow: 1,
    gap: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
  },
  headerContainer: {
    zIndex: 1,
    marginBottom: theme.spacing.xl,
  },
  dayRow: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    borderBottomColor: theme.colors.border,
  },
});
