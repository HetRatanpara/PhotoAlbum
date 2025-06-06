import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from '@react-native-vector-icons/fontawesome';

import HomeStack from './src/navigation/HomeStack';
import AlbumsStack from './src/navigation/AlbumsStack';

type TabParamList = {
  HomeTab: undefined;
  AlbumsTab: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: 'gray',
        }}>
        <Tab.Screen
          name="HomeTab"
          component={HomeStack}
          options={{
            title: 'Home',
            tabBarIcon: ({color, size}) => (
              <Icon name="home" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="AlbumsTab"
          component={AlbumsStack}
          options={{
            title: 'Albums',
            tabBarIcon: ({color, size}) => (
              <Icon name="image" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
