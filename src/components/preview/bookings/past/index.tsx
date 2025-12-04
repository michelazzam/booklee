import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useCallback, useMemo, useRef } from 'react';
import { useRouter } from 'expo-router';
import { formatDate } from 'date-fns';
import { Image } from 'expo-image';

import { AuthServices, type UserAppointmentType } from '~/src/services';

import { CheckCircleIcon, AppLogo, StarIcon } from '~/src/assets/icons';
import { theme } from '~/src/constants';

import { BookingDetailsModal, type BookingDetailsModalRef } from '~/src/components/modals';
import { Text } from '~/src/components/base';

type PastBookingsProps = {
  data: UserAppointmentType;
  onBookAgain: () => void;
};

const PastBookings = ({ data, onBookAgain }: PastBookingsProps) => {
  /*** Refs ***/
  const bookingDetailsModalRef = useRef<BookingDetailsModalRef>(null);

  /*** Constants ***/
  const router = useRouter();
  const { data: userData } = AuthServices.useGetMe();
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
      case 'pending':
        return {
          color: theme.colors.orange[100],
          backgroundColor: theme.colors.orange[10],
        };
      default:
        return {
          color: theme.colors.lightText,
          backgroundColor: theme.colors.lightText,
        };
    }
  }, [status]);

  const handleBookAgain = useCallback(() => {
    if (!userData?.phone) {
      router.navigate('/(authenticated)/(screens)/settings/editPhone');
      return;
    }

    onBookAgain();
  }, [userData, router, onBookAgain]);

  return (
    <Animated.View style={styles.container} entering={FadeIn} exiting={FadeOut}>
      <View style={[styles.headerContainer, { backgroundColor: statusConfig.backgroundColor }]}>
        <CheckCircleIcon width={16} height={16} color={statusConfig.color} />

        <Text
          weight="semiBold"
          color={statusConfig.color}
          size={theme.typography.fontSizes.xs}
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
                weight="semiBold"
                style={{ flexShrink: 1 }}
                size={theme.typography.fontSizes.sm}>
                {location.name}
              </Text>

              <View style={styles.ratingContainer}>
                <StarIcon width={18} height={18} />

                <Text
                  weight="semiBold"
                  color={theme.colors.darkText[100]}
                  size={theme.typography.fontSizes.xs}>
                  {location.rating}
                </Text>
              </View>
            </View>

            <Text size={theme.typography.fontSizes.xs} color={theme.colors.lightText}>
              {formatDate(startAt, 'EEEE dd MMM')}
            </Text>

            <Text size={theme.typography.fontSizes.xs} color={theme.colors.lightText}>
              {totalServices} Services | Total: ${totalPrice}
            </Text>

            <Text
              weight="bold"
              color={theme.colors.darkText[100]}
              size={theme.typography.fontSizes.sm}
              style={{ textDecorationLine: 'underline' }}
              onPress={() => bookingDetailsModalRef.current?.present(data)}>
              Details
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={handleBookAgain}
          activeOpacity={0.8}>
          <Text size={theme.typography.fontSizes.sm} weight="semiBold">
            Book Again
          </Text>
        </TouchableOpacity>
      </View>

      <BookingDetailsModal ref={bookingDetailsModalRef} appointment={null} />
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
    width: 90,
    height: 90,
    borderRadius: theme.radii.md,
  },
  locationImagePlaceholder: {
    width: 90,
    height: 90,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radii.md,
    backgroundColor: theme.colors.lightText + '70',
  },
  locationInfo: {
    flex: 1,
    gap: theme.spacing.xs,
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
    height: 45,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.md,
    borderRadius: theme.radii.md,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.white.DEFAULT,
  },
});
