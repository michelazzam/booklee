import { View, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { useMemo } from 'react';

import { LocationRatingResType } from '~/src/services';

import { StarIcon } from '~/src/assets/icons';
import { theme } from '~/src/constants';

import AnimatedProgressBar from './AnimatedProgressBar';
import { Text } from '../../base';

type StarContainerProps = {
  data: LocationRatingResType;
  containerStyle?: StyleProp<ViewStyle>;
};

const StarContainer = ({ data, containerStyle }: StarContainerProps) => {
  /*** Constants ***/
  const { reviews = [], locations = [] } = data || {};

  /*** Memoization ***/
  const ratingData = useMemo(() => {
    const ratingCounts: Record<number, number> = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    };

    reviews.forEach((review) => {
      const rating = Math.round(review.rating);
      if (rating >= 1 && rating <= 5) {
        ratingCounts[rating]++;
      }
    });

    const totalReviews = reviews.length || 1;
    return [5, 4, 3, 2, 1].map((stars) => ({
      stars,
      count: ratingCounts[stars],
      percentage: (ratingCounts[stars] / totalReviews) * 100,
    }));
  }, [reviews]);

  return (
    <View style={[styles.ratingContainer, containerStyle]}>
      <View style={{ gap: theme.spacing.xs }}>
        <Text size={theme.typography.fontSizes.lg} weight="bold">
          {locations[0].name}
        </Text>

        <Text size={theme.typography.fontSizes.sm} color={theme.colors.darkText[100]}>
          {locations[0].city}
        </Text>
      </View>

      <View style={styles.ratingOverviewContainer}>
        <View style={styles.ratingSummaryContainer}>
          <View style={styles.ratingStarsContainer}>
            <StarIcon width={40} height={40} />

            <Text size={theme.typography.fontSizes['3xl']} weight={'bold'}>
              {locations[0].rating}
            </Text>
          </View>

          <Text size={theme.typography.fontSizes.sm} color={theme.colors.lightText}>
            ({locations[0].totalReviews} reviews)
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
