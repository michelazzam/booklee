import { View, StyleSheet, TextInput } from 'react-native';
import { Image } from 'expo-image';

import { theme } from '~/src/constants/theme';
import { Text, Icon } from '../base';
import type { BookingData, DetailedLocationType } from '~/src/services';
import { AccountIcon, BookingIcon, ClockIcon, StarIcon } from '~/src/assets/icons';

type ConfirmationStepProps = {
  bookingData: BookingData;
  location?: DetailedLocationType;
  onNotesChange: (notes: string) => void;
};

const ConfirmationStep = ({ bookingData, location, onNotesChange }: ConfirmationStepProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const totalPrice = bookingData.selectedServices.reduce((sum, service) => sum + service.price, 0);

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (remainingMinutes === 0) {
      return `${hours}h`;
    }
    return `${hours}h ${remainingMinutes}min`;
  };

  return (
    <View style={styles.container}>
      {/* Location Card */}
      <View style={[styles.card, styles.locationCard]}>
        <View style={styles.locationHeader}>
          <View style={styles.locationImage}>
            {location?.photos?.[0] ? (
              <Image
                contentFit="cover"
                style={styles.logoImg}
                source={{ uri: location.photos?.[0] }}
              />
            ) : (
              <Icon name="store" size={24} color={theme.colors.primaryBlue['100']} />
            )}
          </View>

          <View style={styles.locationInfo}>
            <Text size={theme.typography.fontSizes.lg} weight="bold">
              {location?.name || bookingData.locationName}
            </Text>
            <View style={styles.ratingRow}>
              <StarIcon width={16} height={16} />
              <Text size={theme.typography.fontSizes.sm} weight="medium">
                {location?.rating ?? '-'}
              </Text>
            </View>
            <Text size={theme.typography.fontSizes.sm} color={theme.colors.darkText['50']}>
              {location?.city || location?.address}
            </Text>
          </View>
        </View>
      </View>

      {/* Bookings Summary */}
      <View style={styles.card}>
        {bookingData.selectedServices.map((service) => {
          const booking = bookingData.serviceBookings[service.id];
          if (!booking?.selectedDate || !booking?.selectedTime) return null;
          return (
            <View key={service.id} style={styles.appointmentItem}>
              <Text size={theme.typography.fontSizes.md} weight="medium">
                {service.name}
              </Text>
              <View style={styles.dateTimeContainer}>
                <View style={styles.dateTimeItem}>
                  <BookingIcon />
                  <Text size={theme.typography.fontSizes.sm}>
                    {formatDate(booking.selectedDate)}
                  </Text>
                </View>
                <View style={styles.dateTimeItem}>
                  <ClockIcon />
                  <Text size={theme.typography.fontSizes.sm}>
                    {formatTime(booking.selectedTime)} ({formatDuration(service.duration)})
                  </Text>
                </View>
                {booking.selectedEmployee && (
                  <View style={styles.dateTimeItem}>
                    <AccountIcon />
                    <Text size={theme.typography.fontSizes.sm}>
                      {booking.selectedEmployee.name}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          );
        })}
      </View>

      {/* Services Summary */}
      <View style={[styles.card, styles.servicesCard]}>
        {bookingData.selectedServices.map((service) => {
          const booking = bookingData.serviceBookings[service.id];
          return (
            <View key={service.id} style={styles.serviceItem}>
              <View style={styles.serviceInfo}>
                <Text size={theme.typography.fontSizes.md} weight="medium">
                  {service.name}
                </Text>
                <Text size={theme.typography.fontSizes.sm} color={theme.colors.darkText['50']}>
                  {booking?.selectedEmployee?.name || 'Any Professional'}
                </Text>
              </View>
              <View style={styles.servicePrice}>
                <Text size={theme.typography.fontSizes.md} weight="medium">
                  {service.priceType === 'starting' ? `Starting ` : ''}
                  {service.price}$
                </Text>
                <Text size={theme.typography.fontSizes.sm} color={theme.colors.darkText['50']}>
                  {formatDuration(service.duration)}
                </Text>
              </View>
            </View>
          );
        })}

        <View style={styles.dashedDivider} />

        <View style={styles.totalContainer}>
          <Text size={theme.typography.fontSizes.lg} weight="bold">
            Total minimum
          </Text>
          <Text size={theme.typography.fontSizes.lg} weight="bold">
            {totalPrice}$
          </Text>
        </View>
      </View>

      {/* Notes */}
      <View style={styles.card}>
        <Text size={theme.typography.fontSizes.md} weight="medium">
          Special Requests (Optional)
        </Text>
        <TextInput
          style={styles.notesInput}
          placeholder="Add any special requests or notes..."
          placeholderTextColor={theme.colors.darkText['50']}
          value={bookingData.notes || ''}
          onChangeText={onNotesChange}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />
      </View>
    </View>
  );
};

export default ConfirmationStep;

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.lg,
  },
  card: {
    gap: theme.spacing.md,
    padding: theme.spacing.lg,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.white.DEFAULT,
  },
  locationCard: {
    paddingVertical: theme.spacing.md,
  },
  locationHeader: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    alignItems: 'center',
  },
  locationImage: {
    width: 75,
    height: 75,
    borderRadius: theme.radii.md,
    backgroundColor: theme.colors.primaryBlue['10'],
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  logoImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  locationInfo: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },

  appointmentItem: {
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    gap: theme.spacing.sm,
  },
  dateTimeContainer: {
    gap: theme.spacing.sm,
  },
  dateTimeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  infoCard: {
    backgroundColor: theme.colors.primaryBlue['10'],
    borderColor: theme.colors.primaryBlue['10'],
  },
  servicesCard: {
    backgroundColor: theme.colors.grey['10'],
    borderColor: theme.colors.border,
  },
  serviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: theme.spacing.md,
  },
  serviceInfo: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  servicePrice: {
    alignItems: 'flex-end',
    gap: theme.spacing.xs,
  },
  dashedDivider: {
    height: 1,
    borderWidth: 0.5,
    borderStyle: 'dashed',
    marginVertical: theme.spacing.md,
    borderColor: theme.colors.darkText['100'],
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notesInput: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.md,
    padding: theme.spacing.md,
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.darkText['100'],
    minHeight: 80,
    backgroundColor: theme.colors.white.DEFAULT,
  },
});
