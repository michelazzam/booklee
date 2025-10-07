import { View, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { StarIcon } from '~/src/assets/icons';
import { theme } from '~/src/constants';

import AnimatedProgressBar from './AnimatedProgressBar';
import { Text } from '../../base';

type RatingData = {
  stars: number;
  count: number;
  percentage: number;
};
export type StarContainerData = {
  name: string;
  location: string;
  totalReviews: number;
  averageRating: number;
  ratingData: RatingData[];
};
type StarContainerProps = {
  data: StarContainerData;
  containerStyle?: StyleProp<ViewStyle>;
};

const StarContainer = ({ data, containerStyle }: StarContainerProps) => {
  const { averageRating, totalReviews, ratingData, name, location } = data;

  return (
    <View style={[styles.ratingContainer, containerStyle]}>
      <View style={{ gap: theme.spacing.xs }}>
        <Text size={theme.typography.fontSizes.lg} weight="bold">
          {name}
        </Text>

        <Text size={theme.typography.fontSizes.sm} color={theme.colors.darkText[100]}>
          {location}
        </Text>
      </View>

      <View style={styles.ratingOverviewContainer}>
        <View style={styles.ratingSummaryContainer}>
          <View style={styles.ratingStarsContainer}>
            <StarIcon width={40} height={40} />

            <Text size={theme.typography.fontSizes['3xl']} weight={'bold'}>
              {averageRating}
            </Text>
          </View>

          <Text size={theme.typography.fontSizes.sm} color={theme.colors.lightText}>
            ({totalReviews} reviews)
          </Text>
        </View>

        <View style={styles.progressBarsContainer}>
          {ratingData.map((rating, index) => (
            <View key={rating.stars} style={styles.progressBarContainer}>
              <AnimatedProgressBar percentage={rating.percentage} delay={index * 150} />

              <Text size={theme.typography.fontSizes.xs} style={styles.countLabel}>
                {rating.count}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

export default StarContainer;

const styles = StyleSheet.create({
  ratingContainer: {
    borderWidth: 1,
    gap: theme.spacing.xl,
    padding: theme.spacing.lg,
    borderRadius: theme.radii.md,
    marginBottom: theme.spacing.lg,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.white.DEFAULT,
  },
  ratingOverviewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xl,
  },
  ratingSummaryContainer: {
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  ratingStarsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  progressBarsContainer: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  countLabel: {
    minWidth: 20,
    textAlign: 'right',
  },
});
