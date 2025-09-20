import { forwardRef, useImperativeHandle, useState, useRef, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

import { LocationServices } from '~/src/services';

import { useAppSafeAreaInsets } from '~/src/hooks';
import { theme } from '~/src/constants/theme';

import ModalWrapper, { type ModalWrapperRef } from './ModalWrapper';
import { Icon, Text } from '../base';
import { Button } from '../buttons';

export type LocationModalRef = {
  present: (id: string) => void;
  dismiss: () => void;
};

type LocationModalProps = {
  onDismiss?: () => void;
};

const LocationModal = forwardRef<LocationModalRef, LocationModalProps>(({ onDismiss }, ref) => {
  /*** States ***/
  const [locationId, setLocationId] = useState<string>('');

  /*** Refs ***/
  const modalRef = useRef<ModalWrapperRef>(null);

  /*** Constants ***/
  const router = useRouter();
  const { bottom } = useAppSafeAreaInsets();
  const { data: location, isLoading } = LocationServices.useGetLocationById(locationId);
  const { name, address, city, rating, teamSize, operatingHours, price, locationServices } =
    location || {};

  useImperativeHandle(ref, () => ({
    present: (id: string) => {
      setLocationId(id);
      modalRef.current?.present();
    },
    dismiss: () => {
      modalRef.current?.dismiss();
    },
  }));

  const handleNavigateToLocation = () => {
    modalRef.current?.dismiss();

    setTimeout(() => {
      router.navigate(`/(authenticated)/(screens)/location/${locationId}`);
    }, 300);
  };

  const RenderStars = useCallback(() => {
    if (!rating) return;

    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Icon key={i} name="star" size={16} color="#FFD700" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<Icon key={i} name="star-half" size={16} color="#FFD700" />);
      } else {
        stars.push(<Icon key={i} name="star-outline" size={16} color="#E0E0E0" />);
      }
    }
    return stars;
  }, [rating]);
  const RenderOperatingHours = useCallback(() => {
    if (!operatingHours) return null;

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const today = new Date().getDay();
    const todayName = days[today === 0 ? 6 : today - 1];

    return (
      <View style={{ gap: theme.spacing.md }}>
        <Text size={18} weight="semiBold" color={theme.colors.darkText[100]}>
          Operating Hours
        </Text>

        <View style={{ gap: theme.spacing.sm }}>
          {days.map((day) => {
            const dayData = operatingHours[day.toLowerCase()];
            const isToday = day === todayName;

            return (
              <View key={day} style={[styles.hourRow, isToday && styles.todayRow]}>
                <Text
                  size={14}
                  weight={isToday ? 'semiBold' : 'regular'}
                  color={isToday ? theme.colors.white.DEFAULT : theme.colors.darkText[100]}>
                  {day}
                </Text>

                <Text
                  size={14}
                  weight={isToday ? 'semiBold' : 'regular'}
                  color={isToday ? theme.colors.white.DEFAULT : theme.colors.lightText}>
                  {dayData?.closed ? 'Closed' : `${dayData?.open} - ${dayData?.close}`}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  }, [operatingHours]);

  if (isLoading) {
    return (
      <ModalWrapper ref={modalRef} snapPoints={['50%']} title="Loading..." onDismiss={onDismiss}>
        <View style={styles.loadingContainer}>
          <Text>Loading location details...</Text>
        </View>
      </ModalWrapper>
    );
  }

  return (
    <ModalWrapper
      ref={modalRef}
      snapPoints={['75%']}
      title={name}
      onDismiss={onDismiss}
      contentContainerStyle={[styles.container, { paddingBottom: bottom }]}>
      <View style={{ gap: theme.spacing.md }}>
        <View style={styles.infoContainer}>
          {rating && (
            <View style={styles.infoItem}>
              <View style={{ flexDirection: 'row' }}>
                <RenderStars />
              </View>

              <Text size={16} weight="semiBold" color={theme.colors.darkText[100]}>
                {rating.toFixed(1)}
              </Text>
            </View>
          )}

          <View style={styles.infoItem}>
            <Icon name="currency-usd" size={20} color={theme.colors.primaryBlue[100]} />

            <Text size={14} weight="medium" color={theme.colors.darkText[100]}>
              {price}
            </Text>
          </View>

          <View style={styles.infoItem}>
            <Icon name="account-group" size={20} color={theme.colors.primaryBlue[100]} />

            <Text size={14} weight="medium" color={theme.colors.darkText[100]}>
              {teamSize} people
            </Text>
          </View>
        </View>

        <View style={styles.infoItem}>
          <Icon name="map-marker" size={20} color={theme.colors.primaryBlue[100]} />

          <Text size={14} weight="medium" color={theme.colors.darkText[100]}>
            {city} - {address}
          </Text>
        </View>
      </View>

      {locationServices && locationServices.length > 0 && (
        <View style={{ gap: theme.spacing.md }}>
          <Text size={18} weight="semiBold" color={theme.colors.darkText[100]}>
            What we offer
          </Text>

          <View style={styles.servicesContainer}>
            {locationServices.slice(0, 3).map((service, index) => (
              <View key={index} style={styles.serviceCard}>
                <Icon name="check-circle" size={16} color={theme.colors.primaryBlue[100]} />

                <Text size={14} weight="medium" color={theme.colors.darkText[100]}>
                  {service?.service?.name}
                </Text>
              </View>
            ))}

            {locationServices.length > 3 && (
              <View style={styles.serviceCard}>
                <Text size={14} weight="medium" color={theme.colors.darkText[100]}>
                  + {locationServices.length - 3} more
                </Text>
              </View>
            )}
          </View>
        </View>
      )}

      <RenderOperatingHours />

      <Button title="See More" onPress={handleNavigateToLocation} variant="outline" />
    </ModalWrapper>
  );
});

LocationModal.displayName = 'LocationModal';
export default LocationModal;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 16,
    gap: theme.spacing.xl,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  hourRow: {
    height: 30,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.radii.xs,
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.sm,
  },
  todayRow: {
    borderWidth: 1,
    borderColor: theme.colors.primaryBlue[100],
    backgroundColor: theme.colors.primaryBlue[100],
  },
  actionsContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  serviceCard: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: theme.spacing.xs,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.white.DEFAULT,

    // IOS Shadows
    shadowRadius: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: {
      width: 0,
      height: 1,
    },

    // Android Shadows
    elevation: 1,
  },
  servicesContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    gap: theme.spacing.sm,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
});
