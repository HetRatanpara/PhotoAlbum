import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import RNFS from 'react-native-fs';
import {useNavigation} from '@react-navigation/native';
import type {AlbumsStackParamList} from '../navigation/AlbumsStack';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

interface AlbumEntry {
  id: string;
  name: string;
}

const SavedAlbumsScreen = () => {
  const [albums, setAlbums] = useState<AlbumEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigation =
    useNavigation<NativeStackNavigationProp<AlbumsStackParamList>>();

  useEffect(() => {
    const loadAlbums = async () => {
      try {
        const albumsRoot = RNFS.DocumentDirectoryPath + '/Albums';
        const exists = await RNFS.exists(albumsRoot);
        if (!exists) {
          // If no Albums folder yet, just show empty list
          setAlbums([]);
          setLoading(false);
          return;
        }

        // Read all subfolders under Albums/
        const dirItems = await RNFS.readDir(albumsRoot);
        // dirItems contains objects with { name, path, isFile(), isDirectory() }

        const entries: AlbumEntry[] = [];
        for (const item of dirItems) {
          if (item.isDirectory()) {
            const albumId = item.name;
            const metaPath = `${item.path}/album.json`;
            const metaExists = await RNFS.exists(metaPath);
            if (metaExists) {
              const content = await RNFS.readFile(metaPath, 'utf8');
              const parsed = JSON.parse(content);
              // Expect parsed to have a `name` field
              entries.push({id: albumId, name: parsed.name});
            }
          }
        }

        setAlbums(entries);
      } catch (err) {
        console.warn('Error loading saved albums', err);
        Alert.alert('Error', 'Failed to load saved albums.');
      } finally {
        setLoading(false);
      }
    };

    loadAlbums();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (albums.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>No albums found.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={albums}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.listContainer}
      renderItem={({item}) => (
        <TouchableOpacity
          style={styles.albumItem}
          onPress={() =>
            navigation.navigate('Album', {
              albumId: item.id,
            })
          }>
          <Text style={styles.albumName}>{item.name}</Text>
        </TouchableOpacity>
      )}
    />
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {fontSize: 18, color: '#666'},
  listContainer: {padding: 15},
  albumItem: {
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#f8f8f8',
    marginBottom: 10,
    elevation: 1,
  },
  albumName: {fontSize: 16, fontWeight: '500'},
});

export default SavedAlbumsScreen;
