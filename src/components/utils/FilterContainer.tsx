import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

import { theme } from '~/src/constants/theme';
import { Text } from '../base';

export type FilterType = {
  slug: string;
  label: string;
};
type FilterContainerProps = {
  filters: FilterType[];
  selectedFilter: string;
  setSelectedFilter: (filter: string) => void;
};

const FilterContainer = ({ filters, selectedFilter, setSelectedFilter }: FilterContainerProps) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.filterContainer}>
      {filters.map((filter) => {
        const isSelected = selectedFilter === filter.slug;

        return (
          <TouchableOpacity
            key={filter.slug}
            activeOpacity={0.7}
            onPress={() => setSelectedFilter(filter.slug)}
            style={[
              styles.tagContainer,
              isSelected && {
                backgroundColor: theme.colors.primaryBlue[100],
                borderColor: theme.colors.primaryBlue[100],
              },
            ]}>
            <Text color={isSelected ? theme.colors.white.DEFAULT : theme.colors.darkText[100]}>
              {filter.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

export default FilterContainer;

const styles = StyleSheet.create({
  filterContainer: {
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
  },
  tagContainer: {
    borderWidth: 1,
    borderRadius: theme.radii.full,
    borderColor: theme.colors.border,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.white.DEFAULT,
  },
});
