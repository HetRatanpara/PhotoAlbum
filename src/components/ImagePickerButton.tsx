import React from 'react';
import {
  View,
  Button,
  PermissionsAndroid,
  Platform,
  Alert,
  StyleSheet,
} from 'react-native';
import ImagePicker, {ImageOrVideo} from 'react-native-image-crop-picker';
import {PHOTOS_SELECTION} from '../constants/layout';

type Props = {
  onImagesPicked: (paths: string[]) => void;
};

/**
 * Request runtime permissions on Android for reading images.
 * - If Android 13+: request READ_MEDIA_IMAGES
 * - Else: request READ_EXTERNAL_STORAGE & WRITE_EXTERNAL_STORAGE
 */
async function requestPermissions(): Promise<boolean> {
  if (Platform.OS === 'android') {
    if (Platform.Version >= 33) {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
      ]);
      return (
        granted['android.permission.READ_MEDIA_IMAGES'] ===
        PermissionsAndroid.RESULTS.GRANTED
      );
    } else {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      ]);
      return Object.values(granted).every(
        status => status === PermissionsAndroid.RESULTS.GRANTED,
      );
    }
  }
  return true;
}

const ImagePickerButton: React.FC<Props> = ({onImagesPicked}) => {
  const pickMultiple = async () => {
    const ok = await requestPermissions();
    if (!ok) {
      Alert.alert('Permission Denied', 'Cannot access photos.');
      return;
    }

    try {
      const images: ImageOrVideo[] = await ImagePicker.openPicker({
        multiple: true,
        mediaType: 'photo',
        maxFiles: PHOTOS_SELECTION,
      });

      const paths = images.map(img => img.path);
      onImagesPicked(paths);
    } catch (err) {
      console.warn('Image pick cancelled or failed', err);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Select Photos from Gallery" onPress={pickMultiple} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    alignSelf: 'center',
  },
});

export default ImagePickerButton;
