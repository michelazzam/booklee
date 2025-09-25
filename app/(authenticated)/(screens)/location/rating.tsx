import { View, StyleSheet, TouchableOpacity } from 'react-native';

import { theme } from '~/src/constants';

import { HeaderNavigation, Icon, Text } from '~/src/components/base';
import { AnimatedProgressBar } from '~/src/components/utils';
import { StarIcon } from '~/src/assets/icons';

const totalReviews = 23;
const averageRating = 4.0;
const ratingData = [
  { stars: 5, count: 15, percentage: 65 },
  { stars: 4, count: 5, percentage: 22 },
  { stars: 3, count: 2, percentage: 9 },
  { stars: 2, count: 1, percentage: 4 },
  { stars: 1, count: 0, percentage: 0 },
];

const LocationRatingPage = () => {
  return (
    <View style={styles.container}>
      <HeaderNavigation title="RATING" />

      <View style={styles.ratingContainer}>
        <View style={{ gap: theme.spacing.xs }}>
          <Text size={theme.typography.fontSizes.lg} weight="bold">
            Harmony Haven Spa
          </Text>

          <Text size={theme.typography.fontSizes.sm} color={theme.colors.darkText[100]}>
            Kasslik
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

        <TouchableOpacity style={styles.buttonContainer} activeOpacity={0.8}>
          <Icon name="pencil-outline" size={20} color={theme.colors.darkText[100]} />

          <Text size={theme.typography.fontSizes.lg}>Write A Review</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LocationRatingPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
  },
  ratingContainer: {
    borderWidth: 1,
    gap: theme.spacing.xl,
    padding: theme.spacing.lg,
    borderRadius: theme.radii.md,
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
  buttonContainer: {
    borderWidth: 2,
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.md,
    justifyContent: 'center',
    borderRadius: theme.radii.sm,
    borderColor: theme.colors.border,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
  },
});
