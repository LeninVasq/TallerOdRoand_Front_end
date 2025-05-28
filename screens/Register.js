import React, { useEffect, useState } from 'react';
import {
  Text,
  Image,
  View,
  StyleSheet,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';



import { API_BASE_URL } from '../url';

const { width } = Dimensions.get('window');
const isLargeScreen = width > 600;
const isMobile = Platform.OS === 'ios' || Platform.OS === 'android';
import AwesomeAlert from 'react-native-awesome-alerts';
import Swal from 'sweetalert2';

export default function Register() {
  const [showAlert, setShowAlert] = useState(false);
  const navigation = useNavigation();

  const [textIsmobil, settextIsmobil] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    last_name: '',
    phone: '',
    email: '',
    password: '',
    id_user_type: 1, 
    status: 1,
  });

  

  const handleChange = (key, value) => {
    setFormData({
      ...formData,
      [key]: value,
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validaciones del lado del cliente
    if (!formData.email || !formData.password || !formData.name || !formData.last_name || !formData.phone) {
       
      if (isMobile) {

        settextIsmobil('Por favor, completa todos los campos');
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
        return;
      }else{
        Swal.fire({
          icon: 'warning',
          title: 'Completa todos los campos',
          text: 'Completa todos los campos requeridos',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
        });
        
      }
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/sign_up_user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: formData.name,
            last_name: formData.last_name,
            phone: formData.phone,
            id_user_type: formData.id_user_type,
            status: formData.status,
          email: formData.email,
          password: formData.password,
        }),
      });
    
      if (!response.ok) {
        if (isMobile) {
          settextIsmobil('Credenciales incorrectas');
          setShowAlert(true);
          setTimeout(() => setShowAlert(false), 3000);
          
        }else{
          Swal.fire({
            icon: 'error',
            title: 'Error al iniciar sesión',
            text: 'Credenciales incorrectas',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
          });
        }
        return;
      }
    
      const result = await response.json();

      setShowAlert(false);
      

      let message ="";
      let icon = "success";
      let error = false;
      let title = "Registro exitoso";
      if (result.error_messague === "The email is already in use") {
        message = "El correo ya esta en uso";
        error = true;
        icon = "error";
        title = "Error al registrarse";
      }
      else  if (result.error_messague === "The phone is already in use") {
         message = "El telefono ya esta en uso";
         error = true;
         icon = "error";
         title = "Error al registrarse";

      }
      else {
        message =  "Registro exitoso, por favor inicia sesión";
      }

      console.log(result);
          
         
          if (!isMobile) {
            Swal.fire({
              icon: icon,
              title: title,
              text: message,
              toast: true,  
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000,  
            });
          }
          if (error === false) {
            
              navigation.navigate('Login');
          }
      
      
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error al registrarse',
        text: error.message,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
      });
    }
    
    
   
  };

    return (
      
      
      
          <ImageBackground
            source={{ uri: 'https://img.freepik.com/foto-gratis/creacion-bicicletas-taller_23-2148866628.jpg' }}
            style={styles.padre}
          >
      
      
            {isMobile ? (
              
              <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoiding}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : -130} // para que movilice la tarjeta 
              >
                <AwesomeAlert
        show={showAlert}
        title="¡Alerta!"
        message={textIsmobil}
        closeOnTouchOutside={true}
        showCancelButton={false}
        showConfirmButton={true}
        confirmText="Aceptar"
        confirmButtonColor="#007AFF"
        onConfirmPressed={() => setShowAlert(false)}
      />
                <View style={styles.container}>
                  <View style={styles.tarjeta}>
                    <View style={styles.iconContainer}>
                      <Text style={styles.textLogin} >Regitrate</Text>
                    </View>
      
                    <View style={styles.cajaTexto}>
                    <Icon name="person" size={25} color="#000"  />
      
                      <TextInput
                        placeholder="Ingrese su nombre"
                        style={{ paddingHorizontal: 15, width:'100%' }}
                        keyboardType="default"
                        autoCapitalize="words"
                        onChangeText={(text) => handleChange('name', text)}
                        value={formData.name}
                        underlineColorAndroid="transparent"
                      />
                    </View>

                    <View style={styles.cajaTexto}>
                    <Icon name="person" size={25} color="#000"  />
      
                      <TextInput
                        placeholder="Ingrese su apellido"
                        style={{ paddingHorizontal: 15, width:'100%' }}
                        keyboardType="default"
                        autoCapitalize="words"
                        onChangeText={(text) => handleChange('last_name', text)}
                        value={formData.last_name}
                        underlineColorAndroid="transparent"
                      />


                      
                    </View>
                    <View style={styles.cajaTexto}>
                    <Icon name="phone" size={25} color="#000"  />
      
                      <TextInput
                        placeholder="Ingrese su numero de telefono"
                        style={{ paddingHorizontal: 15, width:'100%' }}
                        keyboardType="phone-pad"
                        autoCapitalize="none"
                        onChangeText={(text) => handleChange('phone', text)}
                        value={formData.phone}
                        underlineColorAndroid="transparent"
                      />
                    </View>
                    <View style={styles.cajaTexto}>
                    <Icon name="email" size={25} color="#000"  />
      
                      <TextInput
                        placeholder="Ingrese su correo"
                        style={{ paddingHorizontal: 15, width:'100%' }}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        onChangeText={(text) => handleChange('email', text)}
                        value={formData.email}
                        underlineColorAndroid="transparent"
                      />
                    </View>
      
                    <View style={styles.cajaTexto}>
                    <Icon name="lock" size={25} color="#000"  />
                      <TextInput
                        placeholder="Ingrese su contraseña"
                        style={{ paddingHorizontal: 15, width:'100%' }}
                        secureTextEntry={true}
                        onChangeText={(text) => handleChange('password', text)}
                        value={formData.password}
                        underlineColorAndroid="transparent"
                      />
                      
                    </View>
      
                    <TouchableOpacity style={styles.boton} onPress={handleSubmit}>
                      <Text style={styles.textoBoton}>Registrate</Text>
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.linkText}>¿Ya estas registrado? Iniciar session</Text>
            </TouchableOpacity>
                </View>
              </KeyboardAvoidingView>
            ) : (
              
              <View style={styles.container}>
                
                <View style={styles.tarjeta}>
                  <View style={styles.iconContainer}>
                  <Text style={styles.textLogin} >Registrate</Text>
                  </View>


                  <Text style={styles.text} >Nombre</Text>
                  <View style={styles.cajaTextoWeb}>
                  <Icon name="person" size={25} color="#000"  />
      
      <TextInput
        placeholder="Ingrese su nombre"
        style={styles.input}
        keyboardType="default"
        autoCapitalize="words"
        onChangeText={(text) => handleChange('name', text)}
        value={formData.name}
        underlineColorAndroid="transparent"
      />
                  </View>
                  <Text style={styles.text} >Apellido</Text>
                  <View style={styles.cajaTextoWeb}>
                  <Icon name="person" size={25} color="#000"  />
      
                      <TextInput
                        placeholder="Ingrese su apellido"
                        style={styles.input}
                        keyboardType="default"
                        autoCapitalize="words"
                        onChangeText={(text) => handleChange('last_name', text)}
                        value={formData.last_name}
                        underlineColorAndroid="transparent"
                      />
                  </View> 
                  <Text style={styles.text} >Telefono</Text>
                  <View style={styles.cajaTextoWeb}>
                  <Icon name="phone" size={25} color="#000"  />
      
                      <TextInput
                        placeholder="Ingrese su numero de telefono"
                        keyboardType="phone-pad"
                        autoCapitalize="none"
                        style={styles.input}
                        onChangeText={(text) => handleChange('phone', text)}
                        value={formData.phone}
                        underlineColorAndroid="transparent"
                      />
                  </View>
      
                  <Text style={styles.text} >Correo Electronico</Text>
                  <View style={styles.cajaTextoWeb}>
                  <Icon name="email" size={25} color="#000"  />
      
                    <TextInput
                      placeholder="Ingrese su correo"
                      keyboardType="email-address"
                      style={styles.input}
                      value={formData.email}
                      onChangeText={(text) => handleChange('email', text)}
      
                    />
                  </View>
      
                  <Text style={styles.text} >Contraseña</Text>
                  <View style={styles.cajaTextoWeb}>
                    <Icon name="lock" size={25} color="#000"  />
                    <TextInput
                      placeholder="Ingrese su contraseña"
                      secureTextEntry={true}   
                      style={styles.input}
                      value={formData.password}
                      onChangeText={(text) => handleChange('password', text)}
      
                    />
                  </View>
      
                  <TouchableOpacity style={styles.boton} onPress={handleSubmit}>
        <Text style={styles.textoBoton}>Regitrate</Text>
      </TouchableOpacity>
      
      
                </View>
      
      
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.linkText}>¿Ya estas registrado? Iniciar session</Text>
            </TouchableOpacity>
              </View>
            )}
          </ImageBackground>
    )
  
}


const styles = StyleSheet.create({
  linkText: {
    color: 'white',
    marginTop: 15,
    textDecorationLine: 'none',
    fontSize: 14,
  },
  padre: {
    flex: 1,
    resizeMode: 'cover',
    paddingHorizontal: isLargeScreen ? 50 : 20,
    overflow: 'hidden',
  },
  keyboardAvoiding: {
    flex: 1,
  },
  input: {
    paddingHorizontal: 15,
  borderWidth: 0,  
  width: '100%',      
  backgroundColor: 'transparent', 
  outlineStyle: 'none'
  },
  container: {
    flex: 1,
    justifyContent: 'center',  
    alignItems: 'center',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: isLargeScreen ? 40 : 20,
    paddingRight: isLargeScreen ? 40 : 20,
    marginBottom: isLargeScreen ? 40 : 20,
    width: '100%',
  },
  textLogin: {
   color: 'black',
   alignItems: 'center',
   justifyContent: 'center',
  fontSize: isLargeScreen ? 24 : 30,
  fontWeight: 'bold',
  fontFamily: 'sans-serif-medium', 
  letterSpacing: 1, 
  textAlign: 'center',
  },
  tarjeta: {
    backgroundColor: 'white',
    borderRadius: 30,
    width: isLargeScreen ? 400 : '90%',
    padding: isLargeScreen ? 30 : 20,
   
    elevation: 5,
  },
  cajaTexto: {
    borderWidth: 1,
    borderColor: '#000',
    backgroundColor: '#cccccc40',
    borderRadius: 20,
    padding: isLargeScreen ? 15 : 5,
    marginTop: isLargeScreen ? 20 : 10,
    flexDirection: 'row',       
    alignItems: 'center',
  },
  text: {
    fontSize: isLargeScreen ? 18 : 14,
    marginBottom: isLargeScreen ? 10 : 5,
    color: 'black',
    textAlign: 'left',
  },
  cajaTextoWeb: {
    borderWidth: 1,
    borderColor: '#000',
    backgroundColor: '#cccccc40',
    borderRadius: 10,
    padding: isLargeScreen ? 15 : 5,
  
    flexDirection: 'row',       
    alignItems: 'center',       
    
  },  
  boton: {
    backgroundColor: '#000',
    padding: isLargeScreen ? 15 : 10,
    borderRadius: 10,
    marginTop: isLargeScreen ? 30 : 20,
  },
  textoBoton: {
    color: 'white',
    textAlign: 'center',
    fontSize: isLargeScreen ? 18 : 14,
  },
});