import React, {useCallback, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../navigation/AppNavigator';
import {
  loadAllAlbums,
  AlbumMetadata,
  deleteAlbumById,
} from '../utils/AlbumStorage';

type SavedAlbumsScreenNavProp = StackNavigationProp<
  RootStackParamList,
  'SavedAlbums'
>;

interface Props {
  navigation: SavedAlbumsScreenNavProp;
}

const SavedAlbumsScreen: React.FC<Props> = ({navigation}) => {
  const [albums, setAlbums] = useState<AlbumMetadata[]>([]);

  const loadAlbums = async () => {
    const all = await loadAllAlbums();
    setAlbums(all);
  };

  useFocusEffect(
    useCallback(() => {
      loadAlbums();
    }, []),
  );

  const handleAlbumPress = (albumId: string) => {
    navigation.navigate('Album', {albumId});
  };

  const handleDelete = (albumId: string) => {
    Alert.alert('Delete Album', 'Are you sure you want to delete this album?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteAlbumById(albumId);
          loadAlbums();
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Saved Albums</Text>
      <FlatList
        data={albums}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View style={styles.albumCard}>
            <TouchableOpacity
              style={styles.albumInfo}
              onPress={() => handleAlbumPress(item.id)}>
              <Text style={styles.albumName}>{item.name}</Text>
              <Text style={styles.albumMeta}>
                Photos per page: {item.photosPerPage}
              </Text>
              <Text style={styles.albumMeta}>Photos: {item.images.length}</Text>
            </TouchableOpacity>
            <View style={styles.actions}>
              <TouchableOpacity
                onPress={() => handleDelete(item.id)}
                style={styles.deleteButton}>
                <Text style={styles.actionText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No albums created yet.</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  albumCard: {
    backgroundColor: '#f4f4f4',
    borderRadius: 8,
    marginBottom: 10,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  albumInfo: {
    flex: 1,
  },
  albumName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  albumMeta: {
    fontSize: 14,
    color: '#555',
  },
  actions: {
    flexDirection: 'column',
    marginLeft: 10,
  },
  editButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    marginBottom: 6,
  },
  deleteButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#f44336',
    borderRadius: 5,
  },
  actionText: {
    color: 'white',
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#888',
  },
});

export default SavedAlbumsScreen;
