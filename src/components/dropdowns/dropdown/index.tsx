import { View, StyleSheet, TouchableOpacity, type ViewStyle } from 'react-native';
import { useMemo, useState, useEffect } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  Extrapolate,
  withTiming,
} from 'react-native-reanimated';

import { theme } from '~/src/constants';

import { Text, Icon } from '~/src/components/base';
import DropdownItem from './item';

export type DropDownItem<T = any> = {
  label: string;
  value: T;
};

type DropDownProps = {
  disabled?: boolean;
  placeholder?: string;
  items: DropDownItem[];
  selectedValue?: any;
  width?: ViewStyle['width'];
  containerHeight?: ViewStyle['height'];
  onSelect: (item: DropDownItem) => void;
};

const AnimatedIcon = Animated.createAnimatedComponent(Icon);
const DropDown = ({
  items,
  width,
  onSelect,
  selectedValue,
  disabled = false,
  containerHeight = 36,
  placeholder = 'Select an option',
}: DropDownProps) => {
  /***** States *****/
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<DropDownItem | null>(null);

  /***** Effects *****/
  useEffect(() => {
    if (selectedValue !== undefined && selectedValue !== null) {
      const found = items.find((item) => {
        if (typeof item.value === 'object' && item.value !== null) {
          if (typeof selectedValue === 'object' && selectedValue !== null) {
            return JSON.stringify(item.value) === JSON.stringify(selectedValue);
          }
          return false;
        }
        return item.value === selectedValue;
      });

      setSelectedItem(found || null);
    }
  }, [selectedValue, items]);

  /***** Memoization *****/
  const placeHolderColor = useMemo(
    () => (selectedItem ? theme.colors.darkText[100] : theme.colors.darkText[50]),
    [selectedItem]
  );

  /***** Animation *****/
  const height = useSharedValue(0);
  const rotation = useSharedValue(0);
  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      height: height.value,
      opacity: interpolate(height.value, [0, 50], [0, 1], Extrapolate.CLAMP),
    };
  });
  const animatedIconStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  const toggleDropdown = () => {
    if (disabled) return;

    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);

    height.value = withTiming(newIsOpen ? items.length * 50 + 16 : 0, {
      duration: 300,
    });

    rotation.value = withTiming(newIsOpen ? 180 : 0, {
      duration: 300,
    });
  };
  const handleItemSelect = (item: DropDownItem) => {
    setSelectedItem(item);
    onSelect(item);
    toggleDropdown();
  };

  return (
    <View style={[styles.container, { width: width }]}>
      <TouchableOpacity
        activeOpacity={0.7}
        disabled={disabled}
        onPress={toggleDropdown}
        style={[styles.trigger, disabled && styles.disabled, { height: containerHeight }]}>
        <Text color={placeHolderColor} size={theme.typography.fontSizes.xs}>
          {selectedItem?.label || placeholder}
        </Text>

        <AnimatedIcon
          size={20}
          name="chevron-down"
          style={animatedIconStyle}
          color={disabled ? theme.colors.darkText[25] : theme.colors.darkText[50]}
        />
      </TouchableOpacity>

      <Animated.View style={[styles.dropdown, animatedContainerStyle]}>
        {items.map((item, index) => (
          <View key={index}>
            <DropdownItem
              item={item}
              handleItemSelect={handleItemSelect}
              selectedValue={selectedValue ?? ''}
            />

            {index !== items.length - 1 && <View style={styles.divider} />}
          </View>
        ))}
      </Animated.View>
    </View>
  );
};

export default DropDown;

const styles = StyleSheet.create({
  container: {
    zIndex: 1000,
    minWidth: 160,
    position: 'relative',
  },
  trigger: {
    flex: 1,
    borderWidth: 1,
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: theme.radii.md,
    justifyContent: 'space-between',
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.white.DEFAULT,
  },
  disabled: {
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.lightText,
  },
  dropdown: {
    top: '75%',
    zIndex: 1001,
    width: '100%',
    borderWidth: 1,
    borderTopWidth: 0,
    overflow: 'hidden',
    position: 'absolute',
    borderColor: theme.colors.border,
    borderBottomLeftRadius: theme.radii.md,
    borderBottomRightRadius: theme.radii.md,
    backgroundColor: theme.colors.white.DEFAULT,
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: theme.colors.border,
  },
});
