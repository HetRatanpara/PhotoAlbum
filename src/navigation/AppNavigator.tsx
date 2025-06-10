import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import HomeScreen from '../screens/HomeScreen';
import AlbumScreen from '../screens/AlbumScreen';

// export type RootStackParamList = {
//   Home: undefined;
//   Album: {albumId: string};
// };

export type RootStackParamList = {
  Home: undefined;
  Album: {albumId: string};
  SavedAlbums: undefined;
  EditAlbum: {albumId: string};
};
const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{headerShown: true}}>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{title: 'Create Album'}}
      />
      <Stack.Screen
        name="Album"
        component={AlbumScreen}
        options={{title: 'Your Album'}}
      />
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;
