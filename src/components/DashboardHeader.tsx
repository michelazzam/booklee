import { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Modal, FlatList, Pressable } from 'react-native';

import { useAppSafeAreaInsets } from '~/src/hooks';
import { theme } from '~/src/constants/theme';

import { Text } from '~/src/components/base';
import ChevronDownIcon from '~/src/assets/icons/ChevronDownIcon';

interface DashboardHeaderProps {
  branches?: string[];
  selectedBranch?: string;
  onBranchChange?: (branch: string) => void;
}

const DashboardHeader = ({
  branches = ['All', 'Antelias', 'Naccache', 'Achrafieh', 'Monot'],
  selectedBranch = 'Naccache',
  onBranchChange,
}: DashboardHeaderProps) => {
  /*** Constants ***/
  const { top } = useAppSafeAreaInsets();

  /*** State ***/
  const [dropdownVisible, setDropdownVisible] = useState(false);

  /*** Handlers ***/
  const handleBranchSelect = (branch: string) => {
    onBranchChange?.(branch);
    setDropdownVisible(false);
  };

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
              {selectedBranch}
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
              data={branches}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.dropdownItem,
                    item === selectedBranch && styles.dropdownItemSelected,
                  ]}
                  onPress={() => handleBranchSelect(item)}
                  activeOpacity={0.7}>
                  <Text
                    size={theme.typography.fontSizes.md}
                    weight={item === selectedBranch ? 'semiBold' : 'regular'}
                    color={theme.colors.white.DEFAULT}>
                    {item}
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
