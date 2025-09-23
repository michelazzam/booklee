import Animated, { SlideOutUp } from 'react-native-reanimated';
import { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Image } from 'expo-image';

import { IMAGES } from '~/src/constants/images';
import { theme } from '~/src/constants/theme';

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
      <Image
        transition={100}
        contentFit="cover"
        style={styles.image}
        cachePolicy="memory-disk"
        source={imageUri ? { uri: imageUri } : IMAGES.placeholder.preview}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    zIndex: 1000,
    alignItems: 'center',
    justifyContent: 'center',
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.lightText,
  },
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});

export default LocationSplashImage;
