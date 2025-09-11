import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '../../../constants/theme';
import Svg, { Path } from 'react-native-svg';

interface SalonCardProps {
  id?: string;
  image: string;
  name: string;
  city: string;
  rating: number;
  tag: string;
  onPress?: () => void;
  onFavoritePress?: () => void;
  isFavorite?: boolean;
}

const HeartIcon = ({
  color = '#1F1F1F',
  width = 20,
  height = 20,
}: {
  color: string;
  width?: number;
  height?: number;
}) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
      fill={color}
    />
  </Svg>
);

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

export default function SalonCard({
  id: _id,
  image,
  name,
  city,
  rating,
  tag,
  onPress,
  onFavoritePress,
  isFavorite = false,
}: SalonCardProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: image }} style={styles.image} resizeMode="cover" />
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={onFavoritePress}
          activeOpacity={0.7}>
          <HeartIcon color={isFavorite ? '#ED818A' : '#FFFFFF'} width={20} height={20} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.topContainer}>
          <Text style={styles.name} numberOfLines={1}>
            {name}
          </Text>
          <View style={styles.ratingContainer}>
            <StarIcon color="#FFD700" width={16} height={16} />
            <Text style={styles.rating}>{rating}</Text>
          </View>
        </View>
        <Text style={styles.city} numberOfLines={1}>
          {city}
        </Text>

        <View style={styles.tagContainer}>
          <Text style={styles.tag}>{tag}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white.DEFAULT,
    borderRadius: theme.radii.md,
    marginHorizontal: theme.spacing.sm,
    marginVertical: theme.spacing.sm,
    ...theme.shadows.soft,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 150,
    borderRadius: theme.radii.md,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  favoriteButton: {
    position: 'absolute',
    top: theme.spacing.sm,
    right: theme.spacing.sm,
    width: 32,
    height: 32,
    borderRadius: theme.radii.full,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: theme.spacing.md,
  },
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    ...theme.typography.textVariants.bodyPrimaryBold,
    color: theme.colors.darkText[100],
    marginBottom: theme.spacing.xs,
  },
  city: {
    ...theme.typography.textVariants.bodySecondaryRegular,
    color: theme.colors.lightText,
    marginBottom: theme.spacing.sm,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  rating: {
    ...theme.typography.textVariants.bodySecondaryBold,
    color: theme.colors.darkText[100],
    marginLeft: theme.spacing.xs,
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
  },
});
