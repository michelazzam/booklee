import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useMemo, useState } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  Extrapolate,
  withTiming,
} from 'react-native-reanimated';

import { theme } from '~/src/constants';

import { Text, Icon, type WeightVariantType } from '~/src/components/base';

type DropDownItem = {
  label: string;
  value: string;
};

type DropDownProps = {
  disabled?: boolean;
  placeholder?: string;
  items: DropDownItem[];
  selectedValue?: string;
  onSelect: (item: DropDownItem) => void;
};

const AnimatedIcon = Animated.createAnimatedComponent(Icon);
const DropDown = ({
  items,
  onSelect,
  selectedValue,
  disabled = false,
  placeholder = 'Select an option',
}: DropDownProps) => {
  /***** States *****/
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<DropDownItem | null>(null);

  /***** Memoization *****/
  const placeHolderColor = useMemo(
    () => (selectedItem ? theme.colors.darkText[100] : theme.colors.darkText[50]),
    [selectedItem]
  );
  const optionConfig = useMemo(
    () => ({
      weight: selectedValue ? 'semiBold' : 'regular',
      backgroundColor: selectedValue ? theme.colors.green[10] : theme.colors.white.DEFAULT,
      color: selectedValue ? theme.colors.green[100] : theme.colors.darkText[100],
    }),
    [selectedValue]
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
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.7}
        disabled={disabled}
        onPress={toggleDropdown}
        style={[styles.trigger, disabled && styles.disabled]}>
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
        {items.map((item) => (
          <TouchableOpacity
            key={item.value}
            activeOpacity={0.7}
            onPress={() => handleItemSelect(item)}
            style={[styles.item, { backgroundColor: optionConfig.backgroundColor }]}>
            <Text
              color={optionConfig.color}
              size={theme.typography.fontSizes.md}
              weight={optionConfig.weight as WeightVariantType}>
              {item.label}
            </Text>

            {selectedValue === item.value && (
              <Icon name="check-circle" size={16} color={theme.colors.green[100]} />
            )}
          </TouchableOpacity>
        ))}
      </Animated.View>
    </View>
  );
};

export default DropDown;

const styles = StyleSheet.create({
  container: {
    zIndex: 1000,
    position: 'relative',
  },
  trigger: {
    width: 140,
    minHeight: 36,
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
    borderWidth: 1,
    borderTopWidth: 0,
    overflow: 'hidden',
    position: 'absolute',
    borderColor: theme.colors.border,
    borderBottomLeftRadius: theme.radii.md,
    borderBottomRightRadius: theme.radii.md,
    backgroundColor: theme.colors.white.DEFAULT,
  },
  item: {
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    borderBottomColor: theme.colors.border,
  },
});
