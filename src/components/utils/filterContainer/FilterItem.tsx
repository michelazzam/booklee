import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '~/src/constants/theme';
import { Text } from '../../base';

import type { FilterType } from '../index';

type FilterItemProps = {
  filter: FilterType;
  isSelected: boolean;
  onPress: () => void;
};

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);
const FilterItem = ({ filter, isSelected, onPress }: FilterItemProps) => {
  /*** Animations ***/
  const animatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: withTiming(
        isSelected ? theme.colors.primaryBlue[100] : theme.colors.white.DEFAULT,
        { duration: 200 }
      ),
      borderColor: withTiming(isSelected ? theme.colors.primaryBlue[100] : theme.colors.border, {
        duration: 200,
      }),
    };
  });

  return (
    <AnimatedTouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[styles.tagContainer, animatedStyle]}>
      <Text color={isSelected ? theme.colors.white.DEFAULT : theme.colors.darkText[100]}>
        {filter.label}
      </Text>
    </AnimatedTouchableOpacity>
  );
};

export default FilterItem;

const styles = StyleSheet.create({
  tagContainer: {
    borderWidth: 1,
    borderRadius: theme.radii.full,
    borderColor: theme.colors.border,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.white.DEFAULT,
  },
});
