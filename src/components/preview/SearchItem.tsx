import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'expo-image';

import { type SearchItemType } from '~/src/services';

import { theme } from '../../constants/theme';

import { Text, Icon } from '../base';

type SearchItemProps = {
  data: SearchItemType;
  onPress?: () => void;
};

const SearchItem = ({ data, onPress }: SearchItemProps) => {
  /***** Constants *****/
  const { name, city, logo, rating = 4.5, price = '$50', photos } = data;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      {photos[0] || logo ? (
        <Image source={{ uri: photos[0] || logo }} style={styles.image} contentFit="cover" />
      ) : (
        <View style={styles.image} />
      )}

      <View style={styles.content}>
        <View style={styles.header}>
          <Text weight="medium" style={{ width: '80%' }} color={theme.colors.darkText[100]}>
            {name}
          </Text>

          <Text color={theme.colors.primaryBlue[100]} weight="semiBold">
            {price} $
          </Text>
        </View>

        <View style={styles.footer}>
          <View style={styles.ratingContainer}>
            <Icon name="star" size={12} color={theme.colors.primaryGreen[100]} />

            <Text color={theme.colors.darkText[100]} weight="medium">
              {rating.toFixed(1)}
            </Text>
          </View>

          <View style={styles.ratingContainer}>
            <Icon name="map-marker" size={12} color={theme.colors.lightText} />

            <Text weight="regular" numberOfLines={1} color={theme.colors.lightText}>
              {city}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default SearchItem;

const styles = StyleSheet.create({
  container: {
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.radii.sm,
    paddingHorizontal: theme.spacing.sm,
    backgroundColor: theme.colors.white.DEFAULT,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: theme.radii.sm,
    marginRight: theme.spacing.sm,
    backgroundColor: theme.colors.grey[100],
  },
  content: {
    flex: 1,
    gap: theme.spacing.xs,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footer: {
    gap: 12,
    alignItems: 'center',
    flexDirection: 'row',
  },
  ratingContainer: {
    gap: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
