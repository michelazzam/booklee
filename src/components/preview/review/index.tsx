import { View, StyleSheet } from 'react-native';

import { StarIcon } from '~/src/assets/icons';
import { theme } from '~/src/constants';

import { Text } from '~/src/components/base';

type ReviewProps = {
  data: any;
};

const Review = ({ data }: ReviewProps) => {
  /***** Constants *****/
  const { name, rating, review } = data;

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text size={theme.typography.fontSizes.sm} weight="bold">
          {name}
        </Text>

        <View style={styles.ratingContainer}>
          <StarIcon />

          <Text size={theme.typography.fontSizes.xs} weight="bold">
            {rating}
          </Text>
        </View>
      </View>

      <Text size={theme.typography.fontSizes.sm} color={theme.colors.lightText}>
        {review}
      </Text>
    </View>
  );
};

export default Review;

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    gap: theme.spacing.sm,
    padding: theme.spacing.md,
    borderRadius: theme.radii.md,
    borderColor: theme.colors.border,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
});
