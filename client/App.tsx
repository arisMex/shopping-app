import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import CodeBarScanner from './src/screens/CodeBarScanner'; 
import History from './src/screens/History'
import Checkout from './src/screens/CheckoutScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Checkout" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Scan" component={CodeBarScanner} />
        <Stack.Screen name="History" component={History} />
        <Stack.Screen name="Checkout" component={Checkout} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


//API_URL=http://172.26.4.210:8000 STRIPE_PK=pk_test_51Q8KlBRtCkB3lU21FQ3wA4RHShA0NAKpjbn65Lmei7SbpGNQMhHnF1CGTEAMoaeWdb4wtOH6OiLEUx95CqJJtjZr00xwchlNoX npx expo start -c