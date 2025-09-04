import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '../../../constants/theme';
import Svg, { Path } from 'react-native-svg';

interface ExploreSalonCardProps {
  id: string;
  image: string;
  name: string;
  location: string;
  rating: number;
  tag: string;
  onPress?: () => void;
  onFavoritePress?: () => void;
  onMapPress?: () => void;
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

const MapIcon = ({
  color = '#1F1F1F',
  width = 16,
  height = 16,
}: {
  color: string;
  width?: number;
  height?: number;
}) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
      stroke={color}
      strokeWidth={2}
      fill="none"
    />
    <Path d="M12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" stroke={color} strokeWidth={2} fill="none" />
  </Svg>
);

export default function ExploreSalonCard({
  id,
  image,
  name,
  location,
  rating,
  tag,
  onPress,
  onFavoritePress,
  onMapPress,
  isFavorite = false,
}: ExploreSalonCardProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: image }} style={styles.image} resizeMode="cover" />

        {/* Map Button */}
        <TouchableOpacity style={styles.mapButton} onPress={onMapPress} activeOpacity={0.7}>
          <MapIcon color="#FFFFFF" width={16} height={16} />
          <Text style={styles.mapText}>Map</Text>
        </TouchableOpacity>

        {/* Favorite Button */}
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={onFavoritePress}
          activeOpacity={0.7}>
          <HeartIcon color={isFavorite ? '#ED818A' : '#FFFFFF'} width={20} height={20} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.nameRatingContainer}>
          <Text style={styles.name} numberOfLines={1}>
            {name}
          </Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>{rating}</Text>
            <StarIcon color="#FFD700" width={16} height={16} />
          </View>
        </View>

        <Text style={styles.location} numberOfLines={1}>
          {location}
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
    backgroundColor: theme.colors.white.DEFAULT,
    borderRadius: theme.radii.lg,
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.soft,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
    borderTopLeftRadius: theme.radii.lg,
    borderTopRightRadius: theme.radii.lg,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  mapButton: {
    position: 'absolute',
    top: theme.spacing.md,
    left: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radii.full,
    gap: theme.spacing.xs,
  },
  mapText: {
    ...theme.typography.textVariants.bodyTertiaryRegular,
    color: theme.colors.white.DEFAULT,
    fontSize: 10,
  },
  favoriteButton: {
    position: 'absolute',
    top: theme.spacing.md,
    right: theme.spacing.md,
    width: 32,
    height: 32,
    borderRadius: theme.radii.full,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: theme.spacing.lg,
  },
  name: {
    ...theme.typography.textVariants.bodyPrimaryBold,
    color: theme.colors.darkText[100],
    fontSize: 16,
    marginBottom: theme.spacing.sm,
  },
  nameRatingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  location: {
    ...theme.typography.textVariants.bodySecondaryRegular,
    color: theme.colors.lightText,
    flex: 1,
    marginBottom: theme.spacing.sm,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  rating: {
    ...theme.typography.textVariants.bodySecondaryBold,
    color: theme.colors.darkText[100],
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
