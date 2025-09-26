import Animated, { FadeIn, FadeOut, SlideOutUp } from 'react-native-reanimated';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useState, useEffect } from 'react';
import { Image } from 'expo-image';

import { theme } from '~/src/constants/theme';
import { AppLogo } from '~/src/assets/icons';

type LocationSplashImageProps = {
  imageUri: string;
  isLoading: boolean;
};

const LocationSplashImage = ({ imageUri, isLoading = true }: LocationSplashImageProps) => {
  /***** States ***/
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        setShowSplash(false);
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  if (!showSplash) {
    return null;
  }

  return (
    <Animated.View style={styles.container} exiting={SlideOutUp.duration(600)}>
      {imageUri ? (
        <Image
          transition={100}
          contentFit="cover"
          style={styles.image}
          cachePolicy="memory-disk"
          source={{ uri: imageUri }}
        />
      ) : (
        <View style={styles.imagePlaceholder}>
          <AppLogo />
        </View>
      )}

      <View style={styles.opacityOverlay} />

      {isLoading && (
        <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.white.DEFAULT} />
        </Animated.View>
      )}
    </Animated.View>
  );
};

export default LocationSplashImage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: 1000,
    gap: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.primaryBlue[100],
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  opacityOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    ...StyleSheet.absoluteFillObject,
  },
});
