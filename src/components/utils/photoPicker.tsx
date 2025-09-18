import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useState, useEffect } from 'react';
import { Image } from 'expo-image';
import { TouchableOpacity, StyleSheet, ViewStyle, StyleProp, View, Alert } from 'react-native';

import Icon from '../base/icon';

export type ImageType = {
  uri: string;
  name: string;
  type: string;
};
type PhotoPickerProps = {
  error?: string;
  initialImage?: ImageType;
  style?: StyleProp<ViewStyle>;
  onSelect: (image: ImageType) => void;
};

const MAX_IMAGE_SIZE = 4096 * 1024; // 4096KB in bytes

const PhotoPicker = ({ style, error, onSelect, initialImage }: PhotoPickerProps) => {
  /*** States ***/
  const [image, setImage] = useState<ImageType | null>(null);

  useEffect(() => {
    if (initialImage) {
      setImage(initialImage);
    }
  }, [initialImage]);

  const getFileSize = async (uri: string): Promise<number> => {
    const response = await fetch(uri);
    const blob = await response.blob();
    return blob.size;
  };
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const fileSize = await getFileSize(result.assets[0].uri);

      if (fileSize > MAX_IMAGE_SIZE) {
        Alert.alert('Image too large', 'Please select an image smaller than 4MB');
        return;
      }

      const blobObject = {
        uri: result.assets[0].uri,
        type: result.assets[0].type || 'image/jpeg',
        name: result.assets[0].fileName || 'photo.jpg',
      };

      setImage(blobObject);
      onSelect(blobObject);
    }
  };

  return (
    <TouchableOpacity
      onPress={pickImage}
      activeOpacity={0.8}
      style={[styles.container, style, { borderColor: error ? 'red' : '#E2E8F0' }]}>
      {image?.uri ? (
        <Image
          transition={100}
          contentFit="cover"
          style={styles.image}
          cachePolicy="memory-disk"
          source={{ uri: image.uri }}
        />
      ) : (
        <MaterialIcons size={42} color="black" name="person" />
      )}

      <View style={styles.icon}>
        <Icon size={18} color="white" name="camera" />
      </View>
    </TouchableOpacity>
  );
};

export default PhotoPicker;

const styles = StyleSheet.create({
  container: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
  },
  icon: {
    right: 0,
    bottom: 0,
    width: 32,
    height: 32,
    borderRadius: 17,
    alignItems: 'center',
    position: 'absolute',
    justifyContent: 'center',
    backgroundColor: 'black',
  },
});
