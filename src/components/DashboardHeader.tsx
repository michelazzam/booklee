import { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Modal, FlatList, Pressable } from 'react-native';

import { useAppSafeAreaInsets } from '~/src/hooks';
import { theme } from '~/src/constants/theme';

import { Text } from '~/src/components/base';
import ChevronDownIcon from '~/src/assets/icons/ChevronDownIcon';
import { UserServices } from '~/src/services';
import type { UserLocationItemType } from '~/src/services';

interface DashboardHeaderProps {
  selectedLocationId?: string;
  onLocationChange?: (locationId: string) => void;
}

const DashboardHeader = ({ selectedLocationId, onLocationChange }: DashboardHeaderProps) => {
  /*** Constants ***/
  const { top } = useAppSafeAreaInsets();

  /*** State ***/
  const [dropdownVisible, setDropdownVisible] = useState(false);

  /*** Hooks ***/
  const { data: locations = [], isLoading } = UserServices.useGetUserLocations();

  /*** Computed Values ***/
  const selectedLocation = locations.find((loc) => loc.id === selectedLocationId) || locations[0];

  /*** Handlers ***/
  const handleLocationSelect = (location: UserLocationItemType) => {
    onLocationChange?.(location.id);
    setDropdownVisible(false);
  };

  if (isLoading || !selectedLocation) {
    return (
      <View style={[styles.container, { paddingTop: top + theme.spacing.md }]}>
        <View style={styles.branchSelector}>
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
              Loading...
            </Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <>
      <View style={[styles.container, { paddingTop: top + theme.spacing.md }]}>
        <TouchableOpacity
          style={styles.branchSelector}
          onPress={() => setDropdownVisible(!dropdownVisible)}
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
              {selectedLocation.name}
            </Text>
          </View>
          <ChevronDownIcon color={theme.colors.white.DEFAULT} width={24} height={24} />
        </TouchableOpacity>
      </View>

      {/* Branch Dropdown Modal */}
      <Modal
        visible={dropdownVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDropdownVisible(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setDropdownVisible(false)}>
          <View style={[styles.dropdownContainer, { top: top + 70 }]}>
            <FlatList
              data={locations}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.dropdownItem,
                    item.id === selectedLocation.id && styles.dropdownItemSelected,
                  ]}
                  onPress={() => handleLocationSelect(item)}
                  activeOpacity={0.7}>
                  <Text
                    size={theme.typography.fontSizes.md}
                    weight={item.id === selectedLocation.id ? 'semiBold' : 'regular'}
                    color={theme.colors.white.DEFAULT}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </>
  );
};

export default DashboardHeader;

const styles = StyleSheet.create({
  container: {
    paddingBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.primaryGreen[100],
  },
  branchSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  dropdownContainer: {
    position: 'absolute',
    left: theme.spacing.lg,
    right: theme.spacing.lg,
    backgroundColor: theme.colors.primaryGreen[100],
    borderRadius: theme.radii.md,
    paddingVertical: theme.spacing.sm,
    ...theme.shadows.soft,
  },
  dropdownItem: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
  },
  dropdownItemSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
});
