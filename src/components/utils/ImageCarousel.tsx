import { View, Image, StyleSheet, FlatList, useWindowDimensions } from 'react-native';
import { useState, useRef, useCallback } from 'react';

import { theme } from '~/src/constants/theme';

type ImageCarouselProps = {
  images: string[];
};

const ImageCarousel = ({ images }: ImageCarouselProps) => {
  /***** Refs *****/
  const flatListRef = useRef<FlatList>(null);

  /***** States *****/
  const [currentIndex, setCurrentIndex] = useState(0);

  /***** Constants *****/
  const { width: screenWidth } = useWindowDimensions();

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const renderImage = useCallback(
    ({ item }: { item: string }) => (
      <Image resizeMode="cover" source={{ uri: item }} style={{ width: screenWidth }} />
    ),
    [screenWidth]
  );

  return (
    <View style={styles.container}>
      <FlatList
        horizontal
        data={images}
        pagingEnabled
        ref={flatListRef}
        renderItem={renderImage}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, index) => index.toString()}
        onViewableItemsChanged={onViewableItemsChanged}
      />

      <View style={styles.gradientOverlay} pointerEvents="none" />

      <View style={styles.dotsContainer}>
        {images.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor:
                  index === currentIndex ? theme.colors.white.DEFAULT : 'rgba(255, 255, 255, 0.5)',
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

export default ImageCarousel;

const styles = StyleSheet.create({
  container: {
    height: 450,
    width: '100%',
  },
  gradientOverlay: {
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    height: '100%',
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  dotsContainer: {
    left: 0,
    right: 0,
    zIndex: 1,
    flexDirection: 'row',
    position: 'absolute',
    gap: theme.spacing.xs,
    justifyContent: 'center',
    bottom: theme.spacing.lg,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: theme.radii.full,
  },
});
