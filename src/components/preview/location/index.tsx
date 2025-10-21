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

import { StarIcon, AppLogo, HeartIcon, HeartIconFilled } from '~/src/assets/icons';
import { useHandleFavorites } from '~/src/hooks';
import { theme } from '~/src/constants/theme';

import { Text } from '../../base';

type LocationCardProps = {
  delay?: number;
  duration?: number;
  data: LocationType;
  onPress?: () => void;
  width?: ViewStyle['width'];
  animatedStyle?: 'slideUp' | 'slideLeft' | 'fadeIn';
};

const DEFAULT_PLACEHOLDER_COLORS = ['#7A79E9', '#ED818A', '#54BEEF'];
const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);
const LocationCard = ({
  data,
  onPress,
  delay = 0,
  width = '100%',
  duration = 200,
  animatedStyle = 'fadeIn',
}: LocationCardProps) => {
  /***** Constants *****/
  const { _id, city, tags, rating, photos, organization } = data;
  const { isInFavorites, handleToggleFavorites } = useHandleFavorites(_id);

  /***** Memoization *****/
  const randomColor = useMemo(() => {
    const hash = _id.split('').reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0);

    const randomIndex = Math.abs(hash) % DEFAULT_PLACEHOLDER_COLORS.length;

    return DEFAULT_PLACEHOLDER_COLORS[randomIndex];
  }, [_id]);
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
      case 'fadeIn':
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
      <View
        style={[
          styles.imageContainer,
          !photos?.[0] && {
            shadowColor: randomColor + '50',
            backgroundColor: randomColor + '50',
          },
        ]}>
        {photos?.[0] ? (
          <Image
            transition={100}
            contentFit="cover"
            style={styles.image}
            cachePolicy="memory-disk"
            source={{ uri: photos?.[0] }}
          />
        ) : (
          <View style={[styles.imagePlaceholder, { backgroundColor: randomColor + '80' }]}>
            <AppLogo />
          </View>
        )}

        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.favoriteButton}
          onPress={handleToggleFavorites}>
          {isInFavorites ? (
            <HeartIconFilled width={38} height={38} color={theme.colors.white.DEFAULT} />
          ) : (
            <HeartIcon width={38} height={38} />
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <View style={{ gap: theme.spacing.xs }}>
          <View style={styles.topContainer}>
            <Text weight="semiBold" style={{ flexShrink: 1 }} size={theme.typography.fontSizes.xs}>
              {organization}
            </Text>

            {!!rating && (
              <View style={styles.ratingContainer}>
                <StarIcon width={12} height={12} />

                <Text size={theme.typography.fontSizes.xs}>{rating.toFixed(1)}</Text>
              </View>
            )}
          </View>

          <Text
            numberOfLines={1}
            color={theme.colors.lightText}
            size={theme.typography.fontSizes.xs}>
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
    borderRadius: theme.radii.md,
    backgroundColor: theme.colors.white.DEFAULT,
  },
  imageContainer: {
    height: 200,
    width: '100%',
    overflow: 'hidden',
    borderRadius: theme.radii.md,

    // iOS Shadows
    shadowRadius: 1,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },

    // Android Shadows
    elevation: 4,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoriteButton: {
    width: 42,
    height: 42,
    position: 'absolute',
    alignItems: 'center',
    top: theme.spacing.md,
    right: theme.spacing.md,
    justifyContent: 'center',
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
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.md,
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
