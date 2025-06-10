import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Button,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {
  DEFAULT_ALBUM_NAME,
  PHOTOS_PER_PAGE_OPTIONS,
  DEFAULT_PHOTO_PER_PAGE,
} from '../constants/layout';
import ImagePickerButton from '../components/ImagePickerButton';
import PhotoGrid from '../components/PhotoGrid';
import {saveNewAlbum, AlbumMetadata} from '../utils/AlbumStorage';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../navigation/AppNavigator';
import {useFocusEffect} from '@react-navigation/native';

type HomeScreenNavProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface HomeScreenProps {
  navigation: HomeScreenNavProp;
}

const HomeScreen: React.FC<HomeScreenProps> = ({navigation}) => {
  const [selectedPaths, setSelectedPaths] = useState<string[]>([]);
  const [photosPerPage, setPhotosPerPage] = useState<number>(4);
  const [albumName, setAlbumName] = useState<string>(DEFAULT_ALBUM_NAME);
  const [saving, setSaving] = useState<boolean>(false);

  useFocusEffect(
    useCallback(() => {
      setSelectedPaths([]);
      setAlbumName(DEFAULT_ALBUM_NAME);
      setPhotosPerPage(DEFAULT_PHOTO_PER_PAGE);
    }, []),
  );

  const onSaveAlbum = async () => {
    if (selectedPaths.length === 0) {
      Alert.alert('No Photos Selected', 'Please select at least one photo.');
      return;
    }
    if (albumName.trim().length === 0) {
      Alert.alert('Invalid Name', 'Please enter an album name.');
      return;
    }

    setSaving(true);
    try {
      const metadata: AlbumMetadata = await saveNewAlbum(
        selectedPaths,
        photosPerPage,
        albumName,
      );
      setSaving(false);
      navigation.navigate('Album', {albumId: metadata.id});
    } catch (err) {
      console.warn('Error saving album', err);
      setSaving(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Album Name</Text>
      <TextInput
        style={styles.input}
        value={albumName}
        onChangeText={setAlbumName}
        placeholder="Enter album name"
      />
      <Text style={styles.label}>Photos Per Page</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={photosPerPage}
          onValueChange={val => setPhotosPerPage(val)}>
          {PHOTOS_PER_PAGE_OPTIONS.map(opt => (
            <Picker.Item key={opt} label={`${opt}`} value={opt} />
          ))}
        </Picker>
      </View>
      <Text style={styles.label}>Select Photos</Text>
      <ImagePickerButton onImagesPicked={setSelectedPaths} />
      {selectedPaths.length > 0 && (
        <>
          <Text style={{marginVertical: 10, fontWeight: '600'}}>
            Preview ({selectedPaths.length} selected)
          </Text>
          <PhotoGrid
            uris={selectedPaths.map(p => 'file://' + p)}
            numColumns={3}
          />
        </>
      )}
      <View style={{marginVertical: 20}}>
        {saving ? (
          <ActivityIndicator size="large" />
        ) : (
          <Button title="Save Album" onPress={onSaveAlbum} />
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  label: {
    fontSize: 16,
    marginTop: 10,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginTop: 5,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginTop: 5,
    overflow: 'hidden',
  },
});

export default HomeScreen;
