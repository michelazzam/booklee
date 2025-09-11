import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'expo-image';

import { theme } from '../../constants/theme';
import { type Store } from '~/src/mock';

import { Text, Icon } from '../base';

type StoreCardProps = {
  data: Store;
  onPress?: () => void;
};

const StoreCard = ({ data, onPress }: StoreCardProps) => {
  /*** Constants ***/
  const { tag = '', name = '', city = '', image = '', rating = 0 } = data;

  const handleFavoritePress = () => {
    console.log('favorite');
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: image }} style={styles.image} contentFit="cover" />

        <View style={styles.favoriteButton}>
          <Icon name="heart-outline" size={28} color="#FFFFFF" onPress={handleFavoritePress} />
        </View>
      </View>

      <View style={styles.infoContainer}>
        <View>
          <View style={styles.topContainer}>
            <Text size={theme.typography.fontSizes.sm} numberOfLines={1}>
              {name}
            </Text>

            <View style={styles.ratingContainer}>
              <Icon name="star" size={18} color="#FFD700" />

              <Text size={theme.typography.fontSizes.sm}>{rating}</Text>
            </View>
          </View>

          <Text size={theme.typography.fontSizes.xs} numberOfLines={1}>
            {city}
          </Text>
        </View>

        <View style={styles.tagContainer}>
          <Text size={theme.typography.fontSizes.xs}>{tag}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default StoreCard;

const styles = StyleSheet.create({
  container: {
    height: 300,
    minWidth: 250,
    ...theme.shadows.soft,
    borderRadius: theme.radii.md,
    backgroundColor: theme.colors.white.DEFAULT,
  },
  imageContainer: {
    height: 200,
    width: '100%',
    overflow: 'hidden',
    borderRadius: theme.radii.md,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  favoriteButton: {
    width: 42,
    height: 42,
    position: 'absolute',
    alignItems: 'center',
    top: theme.spacing.sm,
    right: theme.spacing.sm,
    justifyContent: 'center',
    borderRadius: theme.radii.full,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  infoContainer: {
    flex: 1,
    gap: theme.spacing.xs,
    padding: theme.spacing.md,
    justifyContent: 'space-between',
  },
  topContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagContainer: {
    height: 20,
    alignSelf: 'flex-start',
    justifyContent: 'center',
    borderRadius: theme.radii.xs,
    paddingHorizontal: theme.spacing.sm,
    backgroundColor: theme.colors.primaryBlue[50],
  },
});
