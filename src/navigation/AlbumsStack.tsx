import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {} from '@react-navigation/stack'

import SavedAlbumsScreen from '../screens/SavedAlbumsScreen';
import AlbumScreen from '../screens/AlbumScreen';

export type AlbumsStackParamList = {
  SavedAlbums: undefined;
  Album: {albumId: string};
};

const Stack = createNativeStackNavigator<AlbumsStackParamList>();

const AlbumsStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="SavedAlbums"
      component={SavedAlbumsScreen}
      options={{title: 'My Albums'}}
    />
    <Stack.Screen
      name="Album"
      component={AlbumScreen}
      options={{title: 'View Album'}}
    />
  </Stack.Navigator>
);

export default AlbumsStack;
