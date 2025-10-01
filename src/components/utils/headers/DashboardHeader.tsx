import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useState, useCallback, useMemo } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  Extrapolate,
  withTiming,
} from 'react-native-reanimated';

import { ChevronDownIcon } from '~/src/assets/icons';
import { useAppSafeAreaInsets } from '~/src/hooks';
import { theme } from '~/src/constants/theme';

import { UserServices, type UserLocationItemType } from '~/src/services';

import { Text } from '~/src/components/base';

const ITEM_HEIGHT = 48;

type DashboardHeaderProps = {
  selectedLocationId?: string;
  onLocationChange?: (locationId: string) => void;
};

const DashboardHeader = ({ selectedLocationId, onLocationChange }: DashboardHeaderProps) => {
  /*** Constants ***/
  const { top } = useAppSafeAreaInsets();

  /*** State ***/
  const [, setIsDropdownOpen] = useState(false);

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

  /*** Hooks ***/
  const { data: locations } = UserServices.useGetUserLocations();

  /*** Memoization ***/
  const maxHeight = useMemo(() => (locations?.length || 0) * ITEM_HEIGHT, [locations]);
  const selectedLocation = useMemo(
    () => locations?.find((loc) => loc.id === selectedLocationId) || locations?.[0],
    [locations, selectedLocationId]
  );

  const handleDropDownPress = useCallback(() => {
    if (!locations?.length) return;

    setIsDropdownOpen((prevState) => {
      const willOpen = !prevState;

      height.value = withTiming(willOpen ? maxHeight : 0, { duration: 250 });
      rotation.value = withTiming(willOpen ? 180 : 0, { duration: 250 });

      return willOpen;
    });
  }, [locations, height, rotation, maxHeight]);
  const handleLocationSelect = useCallback(
    (location: UserLocationItemType) => {
      onLocationChange?.(location.id);
      setIsDropdownOpen(false);
      height.value = withTiming(0, { duration: 250 });
      rotation.value = withTiming(0, { duration: 250 });
    },
    [onLocationChange, height, rotation]
  );

  return (
    <View style={[styles.container, { paddingTop: top + theme.spacing.md }]}>
      <TouchableOpacity
        style={styles.branchSelector}
        onPress={handleDropDownPress}
        activeOpacity={0.8}>
        <View>
          <Text
            size={theme.typography.fontSizes.xs}
            weight="regular"
            color={theme.colors.white.DEFAULT}
            style={{ opacity: 0.9 }}>
            Branch
          </Text>
          <Text
            size={theme.typography.fontSizes.xl}
            weight="bold"
            color={theme.colors.white.DEFAULT}>
            {selectedLocation?.name}
          </Text>
        </View>
        <Animated.View style={animatedIconStyle}>
          <ChevronDownIcon color={theme.colors.white.DEFAULT} width={24} height={24} />
        </Animated.View>
      </TouchableOpacity>

      <Animated.View style={[animatedContainerStyle, styles.dropdownContainer]}>
        {locations?.map((location) => (
          <TouchableOpacity
            key={location.id}
            style={[
              styles.dropdownItem,
              location.id === selectedLocation?.id && styles.dropdownItemSelected,
            ]}
            onPress={() => handleLocationSelect(location)}
            activeOpacity={0.8}>
            <Text
              size={theme.typography.fontSizes.md}
              weight={location.id === selectedLocation?.id ? 'semiBold' : 'regular'}
              color={theme.colors.white.DEFAULT}>
              {location.name}
            </Text>
          </TouchableOpacity>
        ))}
      </Animated.View>
    </View>
  );
};

export default DashboardHeader;

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    gap: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.primaryGreen[100],
  },
  branchSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownContainer: {
    overflow: 'hidden',
    borderRadius: theme.radii.md,
    backgroundColor: theme.colors.primaryGreen[100],

    ...theme.shadows.soft,
  },
  dropdownItem: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  dropdownItemSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
});
