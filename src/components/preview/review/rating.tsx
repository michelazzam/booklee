import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useState, useCallback } from 'react';
import { Image } from 'expo-image';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { type UserAppointmentType } from '~/src/services';

import { StarIcon } from '~/src/assets/icons';
import { theme } from '~/src/constants';

import { Icon, Text } from '~/src/components/base';
import { Input } from '../../textInputs';
import { Button } from '../../buttons';

export type RatingDataType = {
  rating: number;
  review: string;
  appointmentId?: string;
};
type RatingProps = {
  isSubmitting: boolean;
  data: UserAppointmentType;
  onSubmit: (ratingData: RatingDataType) => void;
};

const Rating = ({ data, onSubmit, isSubmitting }: RatingProps) => {
  /*** Constants ***/
  const { location } = data;

  /*** Animations ***/
  const isExpanded = useSharedValue(0);
  const chevronAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${isExpanded.value * 180}deg` }],
  }));
  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: isExpanded.value,
    maxHeight: isExpanded.value * 1000,
    transform: [{ translateY: (1 - isExpanded.value) * -10 }],
  }));

  /*** State ***/
  const [showReview, setShowReview] = useState(false);
  const [ratingData, setRatingData] = useState<RatingDataType>({
    rating: 0,
    review: '',
  });

  const toggleExpanded = useCallback(() => {
    setShowReview((prev) => !prev);

    setTimeout(() => {
      const targetValue = isExpanded.value === 0 ? 1 : 0;
      isExpanded.value = withSpring(targetValue);
    }, 100);
  }, [isExpanded]);
  const onChangeText = useCallback(
    (text: string) => {
      setRatingData({ ...ratingData, review: text });
    },
    [ratingData]
  );
  const handleSubmit = useCallback(() => {
    onSubmit({ ...ratingData, appointmentId: data.id });
    setRatingData({ rating: 0, review: '' });

    setTimeout(() => {
      toggleExpanded();
    }, 100);
  }, [ratingData, data.id, onSubmit, toggleExpanded]);

  const RenderStars = useCallback(() => {
    return Array.from({ length: 5 }, (_, index) => {
      const starNumber = index + 1;
      const isFilled = starNumber <= ratingData.rating;

      return (
        <TouchableOpacity
          key={starNumber}
          activeOpacity={0.7}
          onPress={() => setRatingData({ ...ratingData, rating: starNumber })}>
          <StarIcon
            width={42}
            height={42}
            color={isFilled ? theme.colors.darkText[100] : theme.colors.border}
          />
        </TouchableOpacity>
      );
    });
  }, [ratingData]);

  return (
    <View style={styles.ratingContainer}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={toggleExpanded}
        style={styles.ratingPreviewContainer}>
        <Image source={location.photos[0]} style={styles.image} />

        <View style={styles.ratingContentContainer}>
          <View style={styles.ratingHeaderContainer}>
            <Text size={theme.typography.fontSizes.sm} weight="semiBold">
              {location.name}
            </Text>

            <Animated.View style={chevronAnimatedStyle}>
              <Icon name="chevron-down" size={24} color={theme.colors.darkText['100']} />
            </Animated.View>
          </View>

          <View style={styles.ratingStarsContainer}>
            <StarIcon width={18} height={18} />

            <Text size={theme.typography.fontSizes.sm} weight="semiBold">
              {location.rating}
            </Text>
          </View>

          <Text size={theme.typography.fontSizes.sm} color={theme.colors.lightText}>
            {location.city}
          </Text>
        </View>
      </TouchableOpacity>

      {showReview && (
        <Animated.View style={[contentAnimatedStyle, styles.expandableContent]}>
          <View style={styles.ratingSectionContainer}>
            <View style={styles.starsContainer}>
              <RenderStars />
            </View>

            <Input
              multiline
              maxLength={200}
              onChangeText={onChangeText}
              placeholder="Write a review"
            />
          </View>

          <Button title="Submit" onPress={handleSubmit} isLoading={isSubmitting} />
        </Animated.View>
      )}
    </View>
  );
};

export default Rating;

const styles = StyleSheet.create({
  ratingContainer: {
    borderWidth: 1,
    gap: theme.spacing.lg,
    padding: theme.spacing.md,
    borderRadius: theme.radii.md,
    borderColor: theme.colors.border,
  },
  ratingPreviewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.lg,
  },
  image: {
    width: 68,
    height: 68,
    borderRadius: theme.radii.md,
  },
  ratingContentContainer: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  ratingHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ratingStarsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  expandableContent: {
    overflow: 'hidden',
    gap: theme.spacing.lg,
  },
  ratingSectionContainer: {
    gap: theme.spacing.sm,
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    justifyContent: 'center',
  },
});
