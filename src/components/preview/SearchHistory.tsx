import { TouchableOpacity, StyleSheet, View } from 'react-native';

import { type SearchHistoryType } from '~/src/services';

import { BuildingIcon } from '~/src/assets/icons';
import { theme } from '~/src/constants/theme';

import { Text } from '../base';

type SearchHistoryProps = {
  onPress: () => void;
  data: SearchHistoryType;
};
const SearchHistory = ({ data, onPress }: SearchHistoryProps) => {
  /*** Constants ***/
  const { query } = data;

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <BuildingIcon />
        </View>

        <View>
          <Text
            numberOfLines={1}
            size={theme.typography.fontSizes.sm}
            style={{ textTransform: 'capitalize' }}>
            {query}
          </Text>
        </View>
      </View>
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
