import { ScrollView } from 'react-native';

import { theme } from '~/src/constants/theme';

import FilterItem from './FilterItem';

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
      contentContainerStyle={{ gap: theme.spacing.sm }}>
      {filters.map((filter) => {
        const isSelected = selectedFilter === filter.slug;

        return (
          <FilterItem
            key={filter.slug}
            filter={filter}
            isSelected={isSelected}
            onPress={() => setSelectedFilter(filter.slug)}
          />
        );
      })}
    </ScrollView>
  );
};

export default FilterContainer;
