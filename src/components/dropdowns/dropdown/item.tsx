import { TouchableOpacity, StyleSheet } from 'react-native';

import { theme } from '~/src/constants';

import { Icon, Text } from '../../base';

export type DropDownItemType = {
  label: string;
  value: string;
};

type DropdownItemProps = {
  selectedValue: string;
  item: DropDownItemType;
  handleItemSelect: (item: DropDownItemType) => void;
};

const DropdownItem = ({ item, handleItemSelect, selectedValue }: DropdownItemProps) => {
  return (
    <TouchableOpacity
      key={item.value}
      activeOpacity={0.7}
      onPress={() => handleItemSelect(item)}
      style={[styles.item, { backgroundColor: theme.colors.white.DEFAULT }]}>
      <Text color={theme.colors.darkText[100]} size={theme.typography.fontSizes.md}>
        {item.label}
      </Text>

      {selectedValue === item.value && (
        <Icon name="check-circle" size={16} color={theme.colors.green[100]} />
      )}
    </TouchableOpacity>
  );
};

export default DropdownItem;

const styles = StyleSheet.create({
  item: {
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
  },
});
