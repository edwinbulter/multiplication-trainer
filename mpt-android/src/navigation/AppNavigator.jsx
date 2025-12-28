import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from '../components/LoginScreen';
import TableSelection from '../components/TableSelection';
import PracticeScreen from '../components/PracticeScreen';
import ScoreBoard from '../components/ScoreBoard';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#14b8a6',
          },
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Login" 
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="TableSelection" 
          component={TableSelection}
          options={{ title: 'Selecteer Tafel' }}
        />
        <Stack.Screen 
          name="Practice" 
          component={PracticeScreen}
          options={{ title: 'Oefenen' }}
        />
        <Stack.Screen 
          name="ScoreBoard" 
          component={ScoreBoard}
          options={{ title: 'Scorebord' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
