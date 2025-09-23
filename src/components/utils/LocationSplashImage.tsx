import Animated, { SlideOutUp } from 'react-native-reanimated';
import { StyleSheet, View } from 'react-native';
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
      }, 1600);

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
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    zIndex: 1000,
    alignItems: 'center',
    justifyContent: 'center',
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.primaryBlue[100],
  },
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default LocationSplashImage;
