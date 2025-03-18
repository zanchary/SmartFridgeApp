// src/App.js
import React from 'react';
import { StatusBar, LogBox } from 'react-native';
import AppNavigator from './navigation/AppNavigator';
import Colors from './constants/colors';
import { FoodProvider } from './context/FoodContext';

// 忽略特定警告（開發階段）
LogBox.ignoreLogs(['Reanimated 2']);

const App = () => {
  return (
    <FoodProvider>
      <StatusBar backgroundColor={Colors.white} barStyle="dark-content" />
      <AppNavigator />
    </FoodProvider>
  );
};

export default App;