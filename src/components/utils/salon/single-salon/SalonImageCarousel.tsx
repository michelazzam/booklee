import { View, Image, StyleSheet } from 'react-native';
import { theme } from '~/src/constants/theme';

interface SalonImageCarouselProps {
  images: string[];
}

export default function SalonImageCarousel({ images }: SalonImageCarouselProps) {
  return (
    <View style={styles.container}>
      <Image source={{ uri: images[0] }} style={styles.image} resizeMode="cover" />

      {/* Carousel dots */}
      <View style={styles.dotsContainer}>
        {images.map((_, index) => (
          <View key={index} style={[styles.dot, index === 0 && styles.activeDot]} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
    height: 300,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  dotsContainer: {
    position: 'absolute',
    bottom: theme.spacing.lg,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing.xs,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: theme.radii.full,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  activeDot: {
    backgroundColor: theme.colors.white.DEFAULT,
  },
});
