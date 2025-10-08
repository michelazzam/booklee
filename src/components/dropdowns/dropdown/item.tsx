import { TouchableOpacity, StyleSheet } from 'react-native';
import { useMemo } from 'react';

import { theme } from '~/src/constants';

import { Icon, Text } from '../../base';

export type DropDownItemType = {
  label: string;
  value: any;
};

type DropdownItemProps = {
  selectedValue: any;
  item: DropDownItemType;
  handleItemSelect: (item: DropDownItemType) => void;
};

const DropdownItem = ({ item, handleItemSelect, selectedValue }: DropdownItemProps) => {
  /***** Memoization *****/
  const isSelected = useMemo(() => {
    if (typeof item.value === 'object' && item.value !== null) {
      if (typeof selectedValue === 'object' && selectedValue !== null) {
        return JSON.stringify(item.value) === JSON.stringify(selectedValue);
      }
      return false;
    }
    return selectedValue === item.value;
  }, [item.value, selectedValue]);

  return (
    <TouchableOpacity
      key={typeof item.value === 'object' ? JSON.stringify(item.value) : item.value}
      activeOpacity={0.7}
      onPress={() => handleItemSelect(item)}
      style={[styles.item, { backgroundColor: theme.colors.white.DEFAULT }]}>
      <Text color={theme.colors.darkText[100]} size={theme.typography.fontSizes.md}>
        {item.label}
      </Text>

      {isSelected && <Icon name="check-circle" size={16} color={theme.colors.green[100]} />}
    </TouchableOpacity>
  );
};

export default DropdownItem;

const styles = StyleSheet.create({
  item: {
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
  },
});
