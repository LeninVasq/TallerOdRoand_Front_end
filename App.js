import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View,Image,Button } from 'react-native';
import icon from './assets/icon.png';
import 'react-native-gesture-handler';

import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Login from './screens/Login';
import Container from './screens/Container';
import Register from './screens/Register';



export default function App() {

  const Stack = createStackNavigator();
  
  const linking = {
    prefixes: ['http://localhost:8081', 'myapp://'], // cambia por tu URL real o esquema de app
    config: {
      screens: {
        Login: '',
        Container: 'Home',
        Register: 'Register',
      },
    },
  };

  function MyStack() {
    return (
      <Stack.Navigator>
        <Stack.Screen name="Login" options={{ headerShown: false }} component={Login} />
        <Stack.Screen name="Register" options={{ headerShown: false }} component={Register} />
        <Stack.Screen name="Container"  options={{ headerShown: false }} component={Container} />
      </Stack.Navigator>
    );
  } 


  return (
    <NavigationContainer linking={linking}> 
      <MyStack />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#077BFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
