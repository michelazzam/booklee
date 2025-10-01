import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useCallback, useState, useMemo } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  Extrapolate,
  interpolate,
  withTiming,
} from 'react-native-reanimated';

import { ChevronDownIcon } from '~/src/assets/icons';
import { theme } from '~/src/constants/theme';

import { Text } from '~/src/components/base';

export type DropdownOption = {
  id: string;
  label: string;
};
type DropdownProps = {
  options: DropdownOption[];
  selectedOption: DropdownOption;
  onSelect: (option: DropdownOption) => void;
};

const ITEM_HEIGHT = 48;
const Dropdown = ({ options, selectedOption, onSelect }: DropdownProps) => {
  /*** State ***/
  const [, setIsDropdownOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(selectedOption);

  /*** Animations ***/
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

  /*** Memoization ***/
  const maxHeight = useMemo(() => options.length * ITEM_HEIGHT, []);

  const handleDropDownPress = useCallback(() => {
    if (!options.length) return;

    setIsDropdownOpen((prevState) => {
      const willOpen = !prevState;

      height.value = withTiming(willOpen ? maxHeight : 0, { duration: 250 });
      rotation.value = withTiming(willOpen ? 180 : 0, { duration: 250 });

      return willOpen;
    });
  }, [options, height, maxHeight, rotation]);
  const handleOptionSelect = useCallback(
    (option: (typeof options)[0]) => {
      setSelectedFilter(option);
      setIsDropdownOpen(false);
      height.value = withTiming(0, { duration: 250 });
      rotation.value = withTiming(0, { duration: 250 });
      onSelect(option);
    },
    [height, rotation, setSelectedFilter, onSelect]
  );

  return (
    <View style={styles.dropdownWrapper}>
      <TouchableOpacity activeOpacity={0.8} onPress={handleDropDownPress} style={styles.headerItem}>
        <Text
          size={theme.typography.fontSizes.md}
          weight="semiBold"
          color={theme.colors.darkText[100]}>
          {selectedFilter.label}
        </Text>

        <Animated.View style={animatedIconStyle}>
          <ChevronDownIcon color={theme.colors.darkText[100]} width={24} height={24} />
        </Animated.View>
      </TouchableOpacity>

      <Animated.View style={[animatedContainerStyle, styles.dropdownContainer]}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.id}
            activeOpacity={0.8}
            onPress={() => handleOptionSelect(option)}
            style={[
              styles.dropdownItem,
              option.id === selectedFilter.id && styles.dropdownItemSelected,
            ]}>
            <Text
              size={theme.typography.fontSizes.md}
              weight={option.id === selectedFilter.id ? 'semiBold' : 'regular'}
              color={
                option.id === selectedFilter.id
                  ? theme.colors.white.DEFAULT
                  : theme.colors.darkText[100]
              }>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </Animated.View>
    </View>
  );
};

export default Dropdown;

const styles = StyleSheet.create({
  dropdownWrapper: {
    position: 'relative',
    marginBottom: theme.spacing.md,
  },
  headerItem: {
    borderWidth: 1,
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: theme.radii.md,
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderColor: theme.colors.lightText,
    backgroundColor: theme.colors.white.DEFAULT,

    ...theme.shadows.soft,
  },
  chevron: {
    fontSize: 12,
    color: theme.colors.darkText[100],
  },
  dropdownContainer: {
    left: 0,
    right: 0,
    top: '100%',
    overflow: 'hidden',
    position: 'absolute',
    marginTop: theme.spacing.xs,
    borderRadius: theme.radii.md,
    backgroundColor: theme.colors.white.DEFAULT,

    ...theme.shadows.soft,
  },
  dropdownItem: {
    height: ITEM_HEIGHT,
    borderBottomWidth: 1,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.lg,
    borderBottomColor: theme.colors.lightText + '20',
  },
  dropdownItemSelected: {
    backgroundColor: theme.colors.primaryGreen[100],
  },
});
