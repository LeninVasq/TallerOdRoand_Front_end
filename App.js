import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View,Image,Button } from 'react-native';
import icon from './assets/icon.png';

export default function App() {
  return (
    <View style={styles.container}>
      <Image
        source={icon}
        style={{ width: 100, height: 100 }}
      />
      <Text style={{color: 'white'}}>Hola!</Text>
      <StatusBar style="light" />
      <Button title="pulsa aqui" onPress={() => alert('Hola!')} />
    </View>
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
