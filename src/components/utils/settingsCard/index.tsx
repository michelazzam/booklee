import { View, StyleSheet } from 'react-native';

import { theme } from '~/src/constants/theme';

import CardRow, { type CardRowDataType } from './cardRow';
import { Text } from '../../base';

export type SettingsCardProps = {
  title?: string;
  data: CardRowDataType[];
};
const SettingsCard = ({ title, data }: SettingsCardProps) => {
  /*** Constants ***/

  return (
    <View style={styles.container}>
      {title && (
        <Text weight="bold" size={theme.typography.fontSizes.md} style={styles.titleStyle}>
          {title}
        </Text>
      )}

      {data.map((item, index) => (
        <CardRow key={index} data={item} />
      ))}
    </View>
  );
};

export default SettingsCard;
export type { CardRowDataType };

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.md,
    padding: theme.spacing.lg,
    borderRadius: theme.radii.lg,
    marginHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.white.DEFAULT,
    ...theme.shadows.soft,
  },
  titleStyle: {
    borderBottomWidth: 1,
    paddingBottom: theme.spacing.md,
    borderBottomColor: theme.colors.border,
  },
});
