import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import AlbumScreen from '../screens/AlbumScreen';

export type HomeStackParamList = {
  Home: undefined;
  Album: {albumId: string};
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

const HomeStack = () => (
  <Stack.Navigator>
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
);

export default HomeStack;
