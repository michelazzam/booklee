import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { formatDate } from 'date-fns';
import { useMemo } from 'react';

import { type UserAppointment } from '~/src/services';

import { CheckCircleIcon, AppLogo, StarIcon } from '~/src/assets/icons';
import { theme } from '~/src/constants';

import { Text } from '~/src/components/base';
import { Image } from 'expo-image';

type PastBookingsProps = {
  data: UserAppointment;
  onBookAgain: () => void;
};

const PastBookings = ({ data, onBookAgain }: PastBookingsProps) => {
  /*** Constants ***/
  const { status, startAt, totalPrice, location, totalServices } = data;

  const statusConfig = useMemo(() => {
    switch (status) {
      case 'confirmed':
        return {
          color: theme.colors.primaryGreen[100],
          backgroundColor: theme.colors.primaryGreen[10],
        };
      case 'cancelled':
        return {
          color: theme.colors.red[100],
          backgroundColor: theme.colors.red[10],
        };
      case 'completed':
        return {
          color: theme.colors.primaryBlue[100],
          backgroundColor: theme.colors.primaryBlue[10],
        };
      default:
        return {
          color: theme.colors.lightText,
          backgroundColor: theme.colors.lightText,
        };
    }
  }, [status]);

  return (
    <Animated.View style={styles.container} entering={FadeIn} exiting={FadeOut}>
      <View style={[styles.headerContainer, { backgroundColor: statusConfig.backgroundColor }]}>
        <CheckCircleIcon width={16} height={16} color={statusConfig.color} />

        <Text
          weight="semiBold"
          color={statusConfig.color}
          size={theme.typography.fontSizes.sm}
          style={{ textTransform: 'capitalize' }}>
          {status}
        </Text>
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.locationContainer}>
          {location.photos?.[0] ? (
            <Image source={{ uri: location.photos?.[0] }} style={styles.locationImage} />
          ) : (
            <View style={styles.locationImagePlaceholder}>
              <AppLogo width={24} height={24} />
            </View>
          )}

          <View style={styles.locationInfo}>
            <View style={styles.locationInfoHeader}>
              <Text
                size={theme.typography.fontSizes.sm}
                weight="semiBold"
                style={{ flexShrink: 1 }}>
                {location.name}
              </Text>

              <View style={styles.ratingContainer}>
                <StarIcon />

                <Text
                  weight="semiBold"
                  color={theme.colors.darkText[100]}
                  size={theme.typography.fontSizes.md}>
                  {location.rating}
                </Text>
              </View>
            </View>

            <View style={{ gap: theme.spacing.xs }}>
              <Text size={theme.typography.fontSizes.sm} color={theme.colors.lightText}>
                {formatDate(startAt, 'EEEE dd MMM')}
              </Text>

              <Text size={theme.typography.fontSizes.sm} color={theme.colors.lightText}>
                {totalServices} Services | Total: ${totalPrice}
              </Text>
            </View>

            <Text
              weight="bold"
              color={theme.colors.darkText[100]}
              size={theme.typography.fontSizes.sm}
              style={{ textDecorationLine: 'underline' }}
              onPress={() => {}}>
              Details
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.buttonContainer} onPress={onBookAgain} activeOpacity={0.8}>
          <Text size={theme.typography.fontSizes.sm} weight="semiBold">
            Book Again
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

export default PastBookings;

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    overflow: 'hidden',
    borderRadius: theme.radii.md,
    borderColor: theme.colors.border,
  },
  headerContainer: {
    height: 30,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    justifyContent: 'center',
  },
  contentContainer: {
    gap: theme.spacing.md,
    padding: theme.spacing.md,
  },
  locationContainer: {
    borderWidth: 1,
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.md,
    padding: theme.spacing.md,
    borderRadius: theme.radii.md,
    borderColor: theme.colors.border,
  },
  locationImage: {
    width: 100,
    height: 100,
  },
  locationImagePlaceholder: {
    flex: 1,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radii.md,
    backgroundColor: theme.colors.lightText + '70',
  },
  locationInfo: {
    flex: 1,
    gap: theme.spacing.sm,
    justifyContent: 'space-between',
  },
  locationInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  buttonContainer: {
    height: 60,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.md,
    borderRadius: theme.radii.md,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.white.DEFAULT,
  },
});
