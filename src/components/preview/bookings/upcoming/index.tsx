import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useCallback, useRef } from 'react';
import { formatDate } from 'date-fns';
import { Image } from 'expo-image';

import { type AppointmentItem, type UserAppointment } from '~/src/services';

import { AppLogo, BookingIcon, ClockIcon, StarIcon } from '~/src/assets/icons';
import { theme } from '~/src/constants';

import type { ModifyBookingModalRef } from '../../../modals/ModifyBookingModal';
import type { RescheduleModalRef } from '../../../modals/ReschedulingModal';
import ModifyBookingModal from '../../../modals/ModifyBookingModal';
import RescheduleModal from '../../../modals/ReschedulingModal';
import { Icon, Text } from '~/src/components/base';

type BookingProps = {
  data: UserAppointment;
};

const Booking = ({ data }: BookingProps) => {
  /***** Refs *****/
  const rescheduleModalRef = useRef<RescheduleModalRef>(null);
  const modifyBookingModalRef = useRef<ModifyBookingModalRef>(null);

  /***** Constants *****/
  const { items, startAt, location, totalPrice, totalDurationMinutes } = data;

  const RenderService = useCallback(({ service }: { service: AppointmentItem }) => {
    const { serviceName, price, employeeName, durationMinutes } = service;

    return (
      <View style={styles.paymentDetailsItem}>
        <View style={{ gap: theme.spacing.xs }}>
          <Text size={theme.typography.fontSizes.md}>{serviceName}</Text>

          <Text size={theme.typography.fontSizes.xs} style={{ textTransform: 'capitalize' }}>
            {employeeName}
          </Text>
        </View>

        <View style={{ alignItems: 'flex-end' }}>
          <Text size={theme.typography.fontSizes.xs}>Starting {price} $</Text>

          <Text size={theme.typography.fontSizes.xs}>{durationMinutes}</Text>
        </View>
      </View>
    );
  }, []);

  return (
    <>
      <Animated.View style={styles.container} entering={FadeIn} exiting={FadeOut}>
        <View style={[styles.headerContainer, styles.borderStyle]}>
          {location.photos?.[0] ? (
            <Image
              contentFit="cover"
              style={styles.imageStyle}
              source={{ uri: location.photos?.[0] }}
            />
          ) : (
            <View style={styles.imageStylePlaceholder}>
              <AppLogo width={24} height={24} />
            </View>
          )}

          <View style={styles.infoContainer}>
            <View style={{ gap: theme.spacing.md }}>
              <Text size={theme.typography.fontSizes.lg} weight={'bold'}>
                {location.name}
              </Text>

              <View style={styles.ratingContainer}>
                <StarIcon />

                <Text
                  weight={'bold'}
                  style={{ marginBottom: 4 }}
                  size={theme.typography.fontSizes.xs}>
                  {location.rating}
                </Text>
              </View>
            </View>

            <Text size={theme.typography.fontSizes.sm}>{location.city}</Text>
          </View>
        </View>

        <View style={[styles.bookingDetails, styles.borderStyle]}>
          <View style={styles.bookingDetailsItem}>
            <View style={styles.iconContainer}>
              <BookingIcon />
            </View>

            <Text size={theme.typography.fontSizes.sm}>{formatDate(startAt, 'EEEE dd MMM')}</Text>
          </View>

          <View style={styles.bookingDetailsItem}>
            <View style={styles.iconContainer}>
              <ClockIcon />
            </View>

            <Text size={theme.typography.fontSizes.sm}>
              {formatDate(startAt, 'HH:mm')} - {totalDurationMinutes} min
            </Text>
          </View>
        </View>

        <View style={styles.paymentDetailsContainer}>
          <View style={{ gap: theme.spacing.xl }}>
            {items.map((service, index) => (
              <RenderService key={index} service={service} />
            ))}
          </View>

          <View style={styles.dashedLine} />

          <View style={styles.totalPriceContainer}>
            <Text size={theme.typography.fontSizes.md} weight={'bold'}>
              Total minimum
            </Text>

            <Text size={theme.typography.fontSizes.md}>{totalPrice} $</Text>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.modifyButton}
          onPress={() => modifyBookingModalRef.current?.present()}>
          <Icon name="pencil-outline" size={20} color={theme.colors.darkText[100]} />

          <Text size={theme.typography.fontSizes.md}>Modify</Text>
        </TouchableOpacity>
      </Animated.View>

      <ModifyBookingModal
        appointmentId={data.id}
        ref={modifyBookingModalRef}
        onReschedule={() => rescheduleModalRef.current?.present()}
      />

      <RescheduleModal ref={rescheduleModalRef} appointment={data} />
    </>
  );
};

export default Booking;

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    gap: theme.spacing.md,
    padding: theme.spacing.md,
    borderRadius: theme.radii.md,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.white.DEFAULT,
  },
  borderStyle: {
    borderWidth: 1,
    borderRadius: theme.radii.md,
    borderColor: theme.colors.border,
  },
  headerContainer: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    padding: theme.spacing.md,
    borderRadius: theme.radii.md,
    justifyContent: 'space-between',
  },
  imageStyle: {
    width: 100,
    height: 100,
    borderRadius: theme.radii.md,
  },
  imageStylePlaceholder: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radii.md,
    backgroundColor: theme.colors.lightText + '70',
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.xs,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bookingDetails: {
    gap: theme.spacing.md,
    padding: theme.spacing.md,
    borderRadius: theme.radii.md,
  },
  bookingDetailsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  iconContainer: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentDetailsContainer: {
    gap: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: '#EBEAEA',
    borderRadius: theme.radii.md,
  },
  paymentDetailsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dashedLine: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: theme.colors.grey[100],
  },
  totalPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modifyButton: {
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    justifyContent: 'center',
    padding: theme.spacing.md,
    borderRadius: theme.radii.md,
    borderColor: theme.colors.border,
  },
});
