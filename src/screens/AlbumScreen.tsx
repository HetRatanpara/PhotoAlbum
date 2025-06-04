// src/screens/AlbumScreen.tsx
import React, {useEffect, useState} from 'react';
import {View, ActivityIndicator, StyleSheet, Text} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {RootStackParamList} from '../navigation/AppNavigator';
import {loadAlbum, AlbumMetadata} from '../utils/AlbumStorage';
import AlbumViewer from '../components/AlbumViewer';

type AlbumScreenRouteProp = RouteProp<RootStackParamList, 'Album'>;

interface AlbumScreenProps {
  route: AlbumScreenRouteProp;
}

const AlbumScreen: React.FC<AlbumScreenProps> = ({route}) => {
  const {albumId} = route.params;
  const [metadata, setMetadata] = useState<AlbumMetadata | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      try {
        const md = await loadAlbum(albumId);
        setMetadata(md);
      } catch (err) {
        console.warn('Failed to load album', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [albumId]);

  if (loading || !metadata) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.albumTitle}>{metadata.name}</Text>
      <AlbumViewer
        imageURIs={metadata.images}
        photosPerPage={metadata.photosPerPage}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  center: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  albumTitle: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginVertical: 10,
  },
});

export default AlbumScreen;
