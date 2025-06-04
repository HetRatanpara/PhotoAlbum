import React from 'react';
import {
  View,
  Button,
  PermissionsAndroid,
  Platform,
  Alert,
  StyleSheet,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import {saveMultipleImagesToGallery} from '../utils/FileUtils';

type Props = {
  onImagesSelected: (uris: string[]) => void;
};

const requestPermissions = async () => {
  if (Platform.OS === 'android') {
    if (Platform.Version >= 33) {
      const result = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
        PermissionsAndroid.PERMISSIONS.CAMERA,
      ]);
      return Object.values(result).every(
        p => p === PermissionsAndroid.RESULTS.GRANTED,
      );
    } else {
      const result = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.CAMERA,
      ]);
      return Object.values(result).every(
        p => p === PermissionsAndroid.RESULTS.GRANTED,
      );
    }
  }
  return true;
};

const ImagePickerButton = ({onImagesSelected}: Props) => {
  const pickMultipleImages = async () => {
    const permission = await requestPermissions();
    if (!permission) return Alert.alert('Permission Denied');

    try {
      const images = await ImagePicker.openPicker({
        multiple: true,
        cropping: false, // cropping doesn't work with multiple
      });

      const paths = images.map(img => img.path);
      const savedUris = await saveMultipleImagesToGallery(paths);
      onImagesSelected(savedUris);
    } catch (error) {
      console.warn('Image pick error', error);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Pick Multiple Images" onPress={pickMultipleImages} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
});

export default ImagePickerButton;
