import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { ThemeProvider } from './src/contexts/ThemeContext';

import CodeBarScanner from './src/screens/CodeBarScanner';
import History from './src/screens/History';
import CartScreen from './src/screens/CartScreen'; 
import CheckoutScreen from './src/screens/CheckoutScreen';
import HomeScreen from './src/screens/HomeScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="HomeScreen" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="HomeScreen" component={HomeScreen} />
          <Stack.Screen name="Scan" component={CodeBarScanner} />
          <Stack.Screen name="History" component={History} />
          <Stack.Screen name="CartScreen" component={CartScreen} />
          <Stack.Screen name="CheckoutScreen" component={CheckoutScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}


