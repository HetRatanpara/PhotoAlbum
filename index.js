/**
 * @format
 */

// import {AppRegistry} from 'react-native';
// import App from './App';
// import {name as appName} from './app.json';

// AppRegistry.registerComponent(appName, () => App);

//---------
// index.js
// index.js  (or index.tsx)
import 'react-native-gesture-handler'; // ← must be first if you use gesture-handler
import {enableScreens} from 'react-native-screens';
enableScreens(); // ← tell React Native to use native-backed screens

import React from 'react';
import {AppRegistry} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import App from './App';
import {name as appName} from './app.json';

const Root = () => (
  <GestureHandlerRootView style={{flex: 1}}>
    <App />
  </GestureHandlerRootView>
);

AppRegistry.registerComponent(appName, () => Root);
