import { View, FlatList, StyleSheet } from 'react-native';
import { useCallback, useState } from 'react';

import { useAppSafeAreaInsets } from '~/src/hooks';
import { theme } from '~/src/constants/theme';

import { DropDown, type DropDownItem } from '~/src/components/dropdowns';
import { CustomCalendar } from '~/src/components/calendars';
import { DashboardHeader } from '~/src/components/utils';
import { Text } from '~/src/components/base';

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

  return (
    <View style={{ gap: theme.spacing.md }}>
      <DashboardHeader />

      <FlatList
        data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={RenderHeaderItem}
        ListHeaderComponentStyle={{ zIndex: 1 }}
        renderItem={({ item }) => <Text>{item}</Text>}
        contentContainerStyle={[styles.container, { paddingBottom: bottom }]}
      />
    </View>
  );
};

export default Calendar;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    gap: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
  },
});
