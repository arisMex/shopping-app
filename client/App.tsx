import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import CodeBarScanner from './src/screens/CodeBarScanner'; 

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="CodeBarScanner" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="CodeBarScanner" component={CodeBarScanner} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
