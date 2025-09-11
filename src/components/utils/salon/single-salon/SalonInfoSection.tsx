import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../../../constants/theme';
import { Store } from '../../../../mock';
import Svg, { Path } from 'react-native-svg';

interface SalonInfoSectionProps {
  salon: Store;
}

const StarIcon = ({
  color = '#FFD700',
  width = 16,
  height = 16,
}: {
  color: string;
  width?: number;
  height?: number;
}) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
      fill={color}
    />
  </Svg>
);

export default function SalonInfoSection({ salon }: SalonInfoSectionProps) {
  return (
    <View style={styles.container}>
      {/* Salon Name */}
      <Text style={styles.name}>{salon.name}</Text>

      {/* Rating and Opening Hours */}
      <View style={styles.ratingContainer}>
        <View style={styles.ratingLeft}>
          <Text style={styles.rating}>{salon.rating}</Text>
          <StarIcon color="#FFD700" width={16} height={16} />
        </View>
        <Text style={styles.openingHours}>{salon.openingHours}</Text>
      </View>

      {/* Provider */}
      <Text style={styles.provider}>{salon.provider}</Text>

      {/* Tag */}
      <View style={styles.tagContainer}>
        <Text style={styles.tag}>{salon.tag}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.lg,
  },
  name: {
    ...theme.typography.textVariants.headline,
    color: theme.colors.darkText[100],
    marginBottom: theme.spacing.sm,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  ratingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  rating: {
    ...theme.typography.textVariants.bodySecondaryBold,
    color: theme.colors.darkText[100],
  },
  openingHours: {
    ...theme.typography.textVariants.bodySecondaryRegular,
    color: theme.colors.lightText,
  },
  provider: {
    ...theme.typography.textVariants.bodySecondaryRegular,
    color: theme.colors.lightText,
    marginBottom: theme.spacing.sm,
  },
  tagContainer: {
    backgroundColor: theme.colors.primaryBlue[50],
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radii.xs,
    alignSelf: 'flex-start',
  },
  tag: {
    ...theme.typography.textVariants.bodyTertiaryRegular,
    color: theme.colors.darkText[100],
    fontSize: 10,
  },
});
