import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { format } from 'date-fns';

import { type SearchHistoryType } from '~/src/services';

import { BuildingIcon } from '~/src/assets/icons';
import { theme } from '~/src/constants/theme';

import { Icon, Text } from '../base';

type SearchHistoryProps = {
  onPress: () => void;
  data: SearchHistoryType;
};
const SearchHistory = ({ data, onPress }: SearchHistoryProps) => {
  /*** Constants ***/
  const { query, at } = data;

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <BuildingIcon />
        </View>

        <View>
          <Text
            weight="semiBold"
            numberOfLines={1}
            size={theme.typography.fontSizes.md}
            style={{ textTransform: 'capitalize' }}>
            {query}
          </Text>

          {at && (
            <Text color={theme.colors.lightText} weight="regular">
              {format(at, 'MMM d, yyyy')}
            </Text>
          )}
        </View>
      </View>

      <Icon name="magnify" size={24} color={theme.colors.lightText} />
    </TouchableOpacity>
  );
};

export default SearchHistory;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    justifyContent: 'space-between',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  iconContainer: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ scale: 1.5 }],
  },
});
