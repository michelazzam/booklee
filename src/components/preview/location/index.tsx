import { View, TouchableOpacity, StyleSheet, type ViewStyle } from 'react-native';
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

import { type LocationType } from '~/src/services';

import { useHandleFavorites } from '~/src/hooks';
import { theme } from '../../../constants/theme';

import { Text, Icon } from '../../base';

type LocationCardProps = {
  delay?: number;
  duration?: number;
  data: LocationType;
  onPress?: () => void;
  width?: ViewStyle['width'];
  animatedStyle?: 'slideUp' | 'slideLeft' | 'none';
};

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);
const LocationCard = ({
  data,
  onPress,
  delay = 0,
  width = '100%',
  duration = 300,
  animatedStyle = 'none',
}: LocationCardProps) => {
  /***** Constants *****/
  const { _id, name, city, logo, tags, rating, photos } = data;
  const { isInFavorites, handleToggleFavorites, isLoading } = useHandleFavorites(_id);

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

  return (
    <AnimatedTouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      exiting={getExitingAnimation}
      entering={getEnteringAnimation}
      style={[styles.container, { width }]}>
      <View style={styles.imageContainer}>
        {logo || (photos && photos.length > 0) ? (
          <Image
            transition={100}
            contentFit="cover"
            style={styles.image}
            cachePolicy="memory-disk"
            source={{ uri: logo || photos?.[0] || '' }}
          />
        ) : (
          <View style={styles.image} />
        )}

        <View style={styles.favoriteButton}>
          <Icon
            size={28}
            color="#FFFFFF"
            loading={isLoading}
            onPress={handleToggleFavorites}
            name={isInFavorites ? 'heart' : 'heart-outline'}
          />
        </View>
      </View>

      <View style={styles.infoContainer}>
        <View style={{ gap: theme.spacing.xs }}>
          <View style={styles.topContainer}>
            <Text weight="medium" style={{ flexShrink: 1 }} size={theme.typography.fontSizes.md}>
              {name}
            </Text>

            {rating && (
              <View style={styles.ratingContainer}>
                <Icon name="star" size={18} color="#FFD700" />

                <Text size={theme.typography.fontSizes.sm}>{rating.toFixed(1)}</Text>
              </View>
            )}
          </View>

          <Text
            size={theme.typography.fontSizes.sm}
            numberOfLines={1}
            color={theme.colors.lightText}>
            {city}
          </Text>
        </View>

        {tags && tags.length > 0 && (
          <View style={styles.tagContainer}>
            {tags.map((tag) => (
              <View style={styles.tagItem} key={tag}>
                <Text size={theme.typography.fontSizes.xs}>{tag}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </AnimatedTouchableOpacity>
  );
};

export default LocationCard;

const styles = StyleSheet.create({
  container: {
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
    backgroundColor: theme.colors.lightText,
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
    gap: theme.spacing.md,
    padding: theme.spacing.md,
    justifyContent: 'space-between',
  },
  topContainer: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  tagItem: {
    height: 20,
    alignSelf: 'flex-start',
    justifyContent: 'center',
    borderRadius: theme.radii.xs,
    paddingHorizontal: theme.spacing.sm,
    backgroundColor: theme.colors.primaryBlue[50],
  },
});
