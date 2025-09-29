import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { View, StyleSheet, Keyboard } from 'react-native';
import { Image } from 'expo-image';

import { LocationServices, UserServices } from '~/src/services';

import { theme } from '~/src/constants/theme';

import type { ModalWrapperRef } from './ModalWrapper';
import { Icon, Text } from '~/src/components/base';
import { StarIcon } from '~/src/assets/icons';
import ModalWrapper from './ModalWrapper';
import { Input } from '../textInputs';
import { Button } from '../buttons';

type RatingModalProps = {
  storeId: string;
};

export type RatingModalRef = {
  present: () => void;
  dismiss: () => void;
};

const RatingModal = forwardRef<RatingModalRef, RatingModalProps>((props, ref) => {
  /*** Refs ***/
  const review = useRef('');
  const modalRef = useRef<ModalWrapperRef>(null);

  /*** States ***/
  const [error, setError] = useState('');
  const [selectedRating, setSelectedRating] = useState(0);

  /*** Constants ***/
  const { data: userData } = UserServices.useGetMe();
  const { data: locationData } = LocationServices.useGetLocationById(props.storeId);
  const { mutate: submitRating, isPending: isSubmitting } =
    LocationServices.useSubmitLocationRating();

  useImperativeHandle(ref, () => ({
    present: () => {
      modalRef.current?.present();
    },
    dismiss: () => {
      modalRef.current?.dismiss();
    },
  }));

  const onChangeText = (text: string) => {
    setError('');
    review.current = text;
  };
  const handleSubmit = () => {
    Keyboard.dismiss();
    setError('');

    if (!selectedRating || !review.current) {
      setError('Please select a rating and write a review');
      return;
    }

    submitRating(
      {
        rating: selectedRating,
        message: review.current,
        appointmentId: props.storeId,
        userId: userData?.user.id || '',
      },
      {
        onSuccess: () => {
          setError('');
          review.current = '';
          setSelectedRating(0);

          modalRef.current?.dismiss();
        },
      }
    );
  };

  return (
    <ModalWrapper
      ref={modalRef}
      snapPoints={['90%']}
      contentContainerStyle={{ gap: theme.spacing.xl }}
      trailingIcon={<Icon name="close" size={24} color={theme.colors.darkText['100']} />}>
      <Text
        size={theme.typography.fontSizes.lg}
        weight="medium"
        style={{ textAlign: 'center' }}
        color={theme.colors.lightText}>
        Share your feedback with us
      </Text>

      <View style={styles.container}>
        <View style={styles.storeContainer}>
          <View style={styles.imageContainer}>
            {false ? (
              <Image source={{ uri: 'https://via.placeholder.com/150' }} />
            ) : (
              <Icon name="store" size={32} color={theme.colors.lightText} />
            )}
          </View>

          <View style={{ gap: theme.spacing.sm }}>
            <Text size={theme.typography.fontSizes.lg} weight="medium">
              {locationData?.name}
            </Text>

            <View style={styles.ratingContainer}>
              <StarIcon width={16} height={16} />

              <Text
                weight={'semiBold'}
                size={theme.typography.fontSizes.sm}
                color={theme.colors.darkText['100']}>
                {locationData?.rating}
              </Text>
            </View>

            <Text size={theme.typography.fontSizes.sm} color={theme.colors.lightText}>
              {locationData?.city}
            </Text>
          </View>
        </View>

        <View style={styles.starsContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Icon
              size={56}
              key={star}
              name="star"
              onPress={() => setSelectedRating(star)}
              color={
                star <= selectedRating ? theme.colors.primaryBlue['100'] : theme.colors.grey['100']
              }
            />
          ))}
        </View>

        <Input multiline onChangeText={onChangeText} placeholder="Write your review" />

        <Button title="Submit" onPress={handleSubmit} error={error} isLoading={isSubmitting} />
      </View>
    </ModalWrapper>
  );
});

RatingModal.displayName = 'RatingModal';
export default RatingModal;

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.xl,
    padding: theme.spacing.xl,
  },
  imageContainer: {
    width: 100,
    height: 100,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radii.md,
    backgroundColor: theme.colors.lightText + '10',
  },
  storeContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.lg,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  starsContainer: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  starButton: {
    padding: theme.spacing.xs,
  },
  ratingText: {
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
