import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import ChatBot from './src/pages/ChatBot'
import Map from './src/pages/Map'

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='ChatBot'>
        <Stack.Screen name='ChatBot' component={ChatBot} options={{ headerShown: false }} />
        <Stack.Screen name='Map' component={Map} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
