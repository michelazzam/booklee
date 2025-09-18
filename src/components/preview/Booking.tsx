import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useCallback, useRef } from 'react';
import { Image } from 'expo-image';

import { theme } from '~/src/constants';

import { BookingIcon, ClockIcon, StarIcon } from '~/src/assets/icons';
import { ModifyBookingModal, type ModalWrapperRef } from '../modals';
import { Icon, Text } from '~/src/components/base';

type BookingProps = {
  data: any;
  onCancel: () => void;
  onChangeDateTime: () => void;
};

const Booking = ({ data, onChangeDateTime, onCancel }: BookingProps) => {
  /***** Refs *****/
  const modifyBookingModalRef = useRef<ModalWrapperRef>(null);

  /***** Constants *****/
  const {
    rating = 4.0,
    city = 'Beirut',
    totalPrice = '10',
    name = 'Luxe Locks',
    date = 'Thursday 23 August',
    time = '12:00 PM - 1hr 30min',
    image = 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400&h=300&fit=crop',
    services = [
      {
        id: '1',
        servicePrice: '10',
        clientName: 'John Doe',
        serviceName: 'Blow-dry',
        serviceDuration: '45 min',
      },
      {
        id: '2',
        servicePrice: '15',
        clientName: 'Jane Doe',
        serviceName: 'Hairstyle',
        serviceDuration: '45 min',
      },
    ],
  } = data;

  const RenderService = useCallback(({ service }: { service: any }) => {
    const { serviceName, clientName, servicePrice, serviceDuration } = service;

    return (
      <View style={styles.paymentDetailsItem}>
        <View>
          <Text size={theme.typography.fontSizes.md}>{serviceName}</Text>

          <Text size={theme.typography.fontSizes.xs}>{clientName}</Text>
        </View>

        <View style={{ alignItems: 'flex-end' }}>
          <Text size={theme.typography.fontSizes.xs}>Starting {servicePrice} $</Text>

          <Text size={theme.typography.fontSizes.xs}>{serviceDuration}</Text>
        </View>
      </View>
    );
  }, []);

  return (
    <>
      <View style={styles.container}>
        <View style={[styles.headerContainer, styles.borderStyle]}>
          <Image
            source={image}
            priority="high"
            transition={100}
            contentFit="cover"
            cachePolicy="memory-disk"
            style={styles.imageStyle}
          />

          <View style={styles.infoContainer}>
            <View style={{ gap: theme.spacing.md }}>
              <Text size={theme.typography.fontSizes.lg} weight={'bold'}>
                {name}
              </Text>

              <View style={styles.ratingContainer}>
                <StarIcon />

                <Text
                  size={theme.typography.fontSizes.xs}
                  weight={'bold'}
                  style={{ marginBottom: 4 }}>
                  {rating}
                </Text>
              </View>
            </View>

            <Text size={theme.typography.fontSizes.sm}>{city}</Text>
          </View>
        </View>

        <View style={[styles.bookingDetails, styles.borderStyle]}>
          <View style={styles.bookingDetailsItem}>
            <View style={styles.iconContainer}>
              <BookingIcon />
            </View>

            <Text size={theme.typography.fontSizes.sm}>{date}</Text>
          </View>

          <View style={styles.bookingDetailsItem}>
            <View style={styles.iconContainer}>
              <ClockIcon />
            </View>

            <Text size={theme.typography.fontSizes.sm}>{time}</Text>
          </View>
        </View>

        <View style={styles.paymentDetailsContainer}>
          {services.map((service: any) => (
            <RenderService key={service.id} service={service} />
          ))}

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
      </View>

      <ModifyBookingModal
        onCancel={onCancel}
        ref={modifyBookingModalRef}
        onChangeDateTime={onChangeDateTime}
      />
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
    gap: theme.spacing.xl,
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
