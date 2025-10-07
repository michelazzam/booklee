import { forwardRef, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { format } from 'date-fns';

import { type UserAppointment } from '~/src/services';

import { StarIcon, CheckCircleIcon } from '~/src/assets/icons';
import { useAppSafeAreaInsets } from '~/src/hooks';
import { theme } from '~/src/constants/theme';

import ModalWrapper, { type ModalWrapperRef } from './ModalWrapper';
import { Text, Icon } from '~/src/components/base';

type BookingDetailsModalProps = {
  appointment?: UserAppointment | null;
};

export type BookingDetailsModalRef = {
  dismiss: () => void;
  present: (appointment: UserAppointment) => void;
};

const BookingDetailsModal = forwardRef<BookingDetailsModalRef, BookingDetailsModalProps>(
  (_, ref) => {
    /*** Refs ***/
    const modalRef = useRef<ModalWrapperRef>(null);

    /*** States ***/
    const [currentAppointment, setCurrentAppointment] = useState<UserAppointment | null>(null);

    /*** Constants ***/
    const { bottom } = useAppSafeAreaInsets();
    const {
      notes,
      items,
      status,
      startAt,
      location,
      totalPrice,
      clientName,
      totalServices,
      totalDurationMinutes,
    } = currentAppointment || {};

    useImperativeHandle(ref, () => ({
      present: (appointment: UserAppointment) => {
        setCurrentAppointment(appointment);
        modalRef.current?.present();
      },
      dismiss: () => {
        modalRef.current?.dismiss();
      },
    }));

    /*** Memoization ***/
    const statusConfig = useMemo(
      () => ({
        confirmed: {
          color: theme.colors.primaryGreen[100],
          backgroundColor: theme.colors.primaryGreen[10],
          label: 'Confirmed',
        },
        cancelled: {
          color: theme.colors.red[100],
          backgroundColor: theme.colors.red[10],
          label: 'Cancelled',
        },
        completed: {
          color: theme.colors.primaryBlue[100],
          backgroundColor: theme.colors.primaryBlue[10],
          label: 'Completed',
        },
        pending: {
          color: theme.colors.orange[100],
          backgroundColor: theme.colors.orange[10],
          label: 'Pending',
        },
      }),
      []
    );
    const formattedTime = useMemo(() => {
      if (!startAt) return '';
      return format(new Date(startAt), 'h:mm a');
    }, [startAt]);
    const formattedDate = useMemo(() => {
      if (!startAt) return '';

      return format(new Date(startAt), 'EEEE, MMMM dd, yyyy');
    }, [startAt]);
    const formatDuration = useMemo(() => {
      if (!totalDurationMinutes) return '';

      const hours = Math.floor(totalDurationMinutes / 60);
      const mins = totalDurationMinutes % 60;
      if (hours > 0) {
        return `${hours}h ${mins}m`;
      }

      return `${mins}m`;
    }, [totalDurationMinutes]);

    return (
      <ModalWrapper
        ref={modalRef}
        title="Booking Details"
        snapPoints={['70%', '90%']}
        trailingIcon={<Icon size={24} name="close" onPress={() => modalRef.current?.dismiss()} />}
        contentContainerStyle={[styles.contentContainer, { paddingBottom: bottom }]}>
        <View style={styles.container}>
          {/* Status Badge */}
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: statusConfig[status || 'pending'].backgroundColor },
            ]}>
            <CheckCircleIcon
              width={16}
              height={16}
              color={statusConfig[status || 'pending'].color}
            />
            <Text
              weight="semiBold"
              size={theme.typography.fontSizes.sm}
              style={{ textTransform: 'capitalize' }}
              color={statusConfig[status || 'pending'].color}>
              {statusConfig[status || 'pending'].label}
            </Text>
          </View>

          {/* Location Info */}
          <View style={styles.locationSection}>
            <View style={styles.locationHeader}>
              <Text size={theme.typography.fontSizes.lg} weight="bold">
                {location?.name}
              </Text>
              <View style={styles.ratingContainer}>
                <StarIcon width={18} height={18} />
                <Text
                  weight="semiBold"
                  color={theme.colors.darkText[100]}
                  size={theme.typography.fontSizes.sm}>
                  {location?.rating}
                </Text>
              </View>
            </View>

            <Text size={theme.typography.fontSizes.sm} color={theme.colors.lightText}>
              {location?.city}
            </Text>

            {location?.photos?.[0] && (
              <Image source={{ uri: location.photos[0] }} style={styles.locationImage} />
            )}
          </View>

          {/* Appointment Details */}
          <View style={styles.detailsSection}>
            <Text size={theme.typography.fontSizes.lg} weight="bold" style={styles.sectionTitle}>
              Appointment Details
            </Text>

            <View style={styles.detailRow}>
              <Text size={theme.typography.fontSizes.sm} color={theme.colors.lightText}>
                Client Name
              </Text>
              <Text size={theme.typography.fontSizes.sm} weight="semiBold">
                {clientName}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text size={theme.typography.fontSizes.sm} color={theme.colors.lightText}>
                Date & Time
              </Text>
              <View style={styles.dateTimeContainer}>
                <Text size={theme.typography.fontSizes.sm} weight="semiBold">
                  {formattedDate}
                </Text>
                <Text size={theme.typography.fontSizes.sm} weight="semiBold">
                  {formattedTime}
                </Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <Text size={theme.typography.fontSizes.sm} color={theme.colors.lightText}>
                Duration
              </Text>
              <Text size={theme.typography.fontSizes.sm} weight="semiBold">
                {formatDuration}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text size={theme.typography.fontSizes.sm} color={theme.colors.lightText}>
                Total Services
              </Text>
              <Text size={theme.typography.fontSizes.sm} weight="semiBold">
                {totalServices}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text size={theme.typography.fontSizes.sm} color={theme.colors.lightText}>
                Total Price
              </Text>
              <Text size={theme.typography.fontSizes.sm} weight="semiBold">
                ${totalPrice}
              </Text>
            </View>
          </View>

          {/* Services */}
          <View style={styles.servicesSection}>
            <Text size={theme.typography.fontSizes.lg} weight="bold" style={styles.sectionTitle}>
              Services
            </Text>

            {items?.map((item, index) => (
              <View key={index} style={styles.serviceItem}>
                <View style={styles.serviceInfo}>
                  <Text size={theme.typography.fontSizes.sm} weight="semiBold">
                    {item.serviceName}
                  </Text>
                  {item.employeeName && (
                    <Text size={theme.typography.fontSizes.xs} color={theme.colors.lightText}>
                      with {item.employeeName}
                    </Text>
                  )}
                </View>
                <View style={styles.serviceDetails}>
                  <Text size={theme.typography.fontSizes.xs} color={theme.colors.lightText}>
                    {formatDuration}
                  </Text>
                  <Text size={theme.typography.fontSizes.sm} weight="semiBold">
                    ${item.price}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* Notes */}
          {notes && (
            <View style={styles.notesSection}>
              <Text size={theme.typography.fontSizes.lg} weight="bold" style={styles.sectionTitle}>
                Notes
              </Text>
              <Text size={theme.typography.fontSizes.sm} color={theme.colors.lightText}>
                {notes}
              </Text>
            </View>
          )}
        </View>
      </ModalWrapper>
    );
  }
);

BookingDetailsModal.displayName = 'BookingDetailsModal';

export default BookingDetailsModal;

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: theme.spacing.lg,
  },
  container: {
    gap: theme.spacing.lg,
  },
  statusBadge: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    borderRadius: theme.radii.md,
  },
  locationSection: {
    gap: theme.spacing.sm,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  locationImage: {
    width: '100%',
    height: 120,
    borderRadius: theme.radii.md,
  },
  detailsSection: {
    gap: theme.spacing.md,
  },
  sectionTitle: {
    marginBottom: theme.spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.xs,
  },
  dateTimeContainer: {
    alignItems: 'flex-end',
    gap: theme.spacing.xs,
  },
  servicesSection: {
    gap: theme.spacing.md,
  },
  serviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.border + '20',
    borderRadius: theme.radii.sm,
  },
  serviceInfo: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  serviceDetails: {
    alignItems: 'flex-end',
    gap: theme.spacing.xs,
  },
  notesSection: {
    gap: theme.spacing.sm,
  },
});
