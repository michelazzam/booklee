import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, type RelativePathString } from 'expo-router';
import { Image } from 'expo-image';
import { useMemo } from 'react';
import Animated, {
  SlideOutDown,
  SlideOutRight,
  FadeInLeft,
  FadeInUp,
  FadeOut,
  FadeIn,
} from 'react-native-reanimated';

import { theme } from '../../constants/theme';
import { FavoritesServices, Location } from '~/src/services';

import { Text, Icon } from '../base';

type LocationCardProps = {
  data: Location;
  delay?: number;
  duration?: number;
  animatedStyle?: 'slideUp' | 'slideLeft' | 'none';
  onPress?: () => void;
  showMapButton?: boolean;
};
//TODO: This needs fixing
const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);
const LocationCard = ({
  data,
  onPress,
  delay = 0,
  duration = 300,
  animatedStyle = 'none',
  showMapButton = true,
}: LocationCardProps) => {
  /***** Constants *****/
  const { _id, name = '', city = 'Unknown', logo, rating: locationRating, category } = data;
  const image =
    logo || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop';
  const rating = typeof locationRating === 'number' ? locationRating : 4.5;
  const tag = category?.title ?? '';

  /***** Hooks *****/
  const router = useRouter();
  const { data: favorites } = FavoritesServices.useGetFavorites();
  const { toggleFavorite } = FavoritesServices.useToggleFavorite();

  /***** Computed values *****/
  const isFavorite = favorites?.some((fav) => fav._id === _id) || false;

  /***** Memoization *****/
  const getEnteringAnimation = useMemo(() => {
    switch (animatedStyle) {
      case 'slideUp':
        return FadeInUp.delay(delay)
          .duration(duration)
          .springify()
          .damping(15)
          .stiffness(100)
          .mass(1);
      case 'slideLeft':
        return FadeInLeft.duration(duration)
          .delay(delay)
          .springify()
          .damping(15)
          .stiffness(100)
          .mass(1);
      default:
        return FadeIn.duration(duration)
          .delay(delay)
          .springify()
          .damping(15)
          .stiffness(100)
          .mass(1);
    }
  }, [animatedStyle, delay, duration]);
  const getExitingAnimation = useMemo(() => {
    switch (animatedStyle) {
      case 'slideUp':
        return SlideOutDown.duration(duration).delay(delay);
      case 'slideLeft':
        return SlideOutRight.duration(duration).delay(delay);
      case 'none':
      default:
        return FadeOut.duration(duration).delay(delay);
    }
  }, [animatedStyle, delay, duration]);

  const handleFavoritePress = async () => {
    try {
      await toggleFavorite(_id);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  return (
    <AnimatedTouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={styles.container}
      entering={getEnteringAnimation}
      exiting={getExitingAnimation}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: image }} style={styles.image} contentFit="cover" />

        <View style={styles.favoriteButton}>
          <Icon
            size={28}
            onPress={handleFavoritePress}
            color={isFavorite ? '#FF6B6B' : '#FFFFFF'}
            name={isFavorite ? 'heart' : 'heart-outline'}
          />
        </View>

        {showMapButton && (
          <View style={styles.mapButton}>
            <Icon
              size={28}
              name="map-marker"
              color={'#FFFFFF'}
              onPress={() =>
                router.push(`/(authenticated)/(screens)/map?focusId=${_id}` as RelativePathString)
              }
            />
          </View>
        )}
      </View>

      <View style={styles.infoContainer}>
        <View>
          <View style={styles.topContainer}>
            <Text size={theme.typography.fontSizes.sm} numberOfLines={1}>
              {name}
            </Text>

            <View style={styles.ratingContainer}>
              <Icon name="star" size={18} color="#FFD700" />

              <Text size={theme.typography.fontSizes.sm}>{rating}</Text>
            </View>
          </View>

          <Text size={theme.typography.fontSizes.xs} numberOfLines={1}>
            {city}
          </Text>
        </View>
        {tag && (
          <View style={styles.tagContainer}>
            <Text size={theme.typography.fontSizes.xs}>{tag}</Text>
          </View>
        )}
      </View>
    </AnimatedTouchableOpacity>
  );
};

export default LocationCard;

const styles = StyleSheet.create({
  container: {
    height: 300,
    minWidth: 230,

    ...theme.shadows.soft,
    borderRadius: theme.radii.md,
    backgroundColor: theme.colors.white.DEFAULT,
  },
  imageContainer: {
    height: 200,
    width: '100%',
    overflow: 'hidden',
    borderRadius: theme.radii.md,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  favoriteButton: {
    width: 42,
    height: 42,
    position: 'absolute',
    alignItems: 'center',
    top: theme.spacing.sm,
    right: theme.spacing.sm,
    justifyContent: 'center',
    borderRadius: theme.radii.full,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  mapButton: {
    width: 42,
    height: 42,
    position: 'absolute',
    alignItems: 'center',
    top: theme.spacing.sm,
    left: theme.spacing.sm,
    justifyContent: 'center',
    borderRadius: theme.radii.full,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  infoContainer: {
    flex: 1,
    gap: theme.spacing.xs,
    padding: theme.spacing.md,
    justifyContent: 'space-between',
  },
  topContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagContainer: {
    height: 20,
    alignSelf: 'flex-start',
    justifyContent: 'center',
    borderRadius: theme.radii.xs,
    paddingHorizontal: theme.spacing.sm,
    backgroundColor: theme.colors.primaryBlue[50],
  },
});
