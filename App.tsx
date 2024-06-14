import React, { useEffect } from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { setupDatabase } from './src/services/database';
import { CreateScreen, DetailScreen, HomeScreen } from './src/screens';

const Stack = createStackNavigator();

const App = () => {
  useEffect(() => {
    
    setupDatabase();
  }, []);

  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Gerenciador de Tarefas" component={HomeScreen} />
          <Stack.Screen name="CreateTask" component={CreateScreen} />
          <Stack.Screen name="TaskDetail" component={DetailScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
};

export default App;
