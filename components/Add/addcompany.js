import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  Image,
  Platform
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import { API_BASE_URL } from '../../url';
import Swal from 'sweetalert2';
import AwesomeAlert from 'react-native-awesome-alerts';



const Addcompany = ({ visible, onClose, onSave }) => {
  const [nombre, setNombre] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [correo, setCorreo] = useState('');
  const [nit, setNit] = useState('');
  const [descripcion, setDescripcion] = useState('');
const isMobile = Platform.OS === 'ios' || Platform.OS === 'android';

  

  const handleGuardar = async () => {


    
    if (!nombre.trim() || !descripcion.trim()) {
    if (!isMobile) {
                  Swal.fire({
                    icon: 'error',
                    title: 'Campo vacio',
                    text: 'Todos los campos son obligatorios',
                    toast: true,  
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,  
                    
                  });
      }
      else{
        <AwesomeAlert
  show='true'
  title="Error"
  message='Todos los campos son obligatorios'
  closeOnTouchOutside={true}
  showCancelButton={false}
  showConfirmButton={true}
  confirmText="Aceptar"
  confirmButtonColor="#007AFF"
  onConfirmPressed={() => setShowAlert(false)}
/>
      }
      return;
    }

    try {
      
        
      const response = await fetch(`${API_BASE_URL}/company`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
  Nombre_empresas: nombre,
  Direccion: direccion,
  Telefono: telefono,
  Correo: correo,
  NIT: nit,
  Descripcion: descripcion,
}),

      });

      if (!response.ok) throw new Error(`Error: ${response.error_message}`);

            const result = await response.json();

      console.log('Categoría guardada:', result);
      if(result.error_message === 'The spare parts category already exists'){
        if (!isMobile) {
                  Swal.fire({
                    icon: 'error',
                    title: 'Existe',
                    text: 'La categoría ya existe',
                    toast: true,  
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,  
                    
                  });
      }
      else{
        <AwesomeAlert
  show='true'
  title="Existe"
  message='La categoría ya existe'
  closeOnTouchOutside={true}
  showCancelButton={false}
  showConfirmButton={true}
  confirmText="Aceptar"
  confirmButtonColor="#007AFF"
  onConfirmPressed={() => setShowAlert(false)}
/>}
      }else{
 if (!isMobile) {
                  Swal.fire({
                    icon: 'success',
                    title: 'Exito',
                    text: 'Categoría guardada correctamente',
                    toast: true,  
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,  
                    
                  });
      }
      else{
        <AwesomeAlert
  show='true'
  title="Exito"
  message='Categoría guardada correctamente'
  closeOnTouchOutside={true}
  showCancelButton={false}
  showConfirmButton={true}
  confirmText="Aceptar"
  confirmButtonColor="#007AFF"
  onConfirmPressed={() => setShowAlert(false)}
/>}      onSave(); // Avisar al padre para refrescar o cerrar modal
      resetForm();
      }
    
    } catch (error) {
      console.error('Error al guardar categoría:', error);
      Alert.alert('Error', 'No se pudo guardar la categoría');
    }
  };

  const resetForm = () => {
    setNombre('');
    setDescripcion('');
    onClose();
  };

  return (
    <Modal visible={visible}animationType="slide" style={{ zIndex: 10 }} transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Nueva Empresa</Text>

          <TextInput
        style={styles.input}
        placeholder="Nombre de la empresa"
        value={nombre}
        onChangeText={setNombre}
      />
      <TextInput
        style={styles.input}
        placeholder="Dirección"
        value={direccion}
        onChangeText={setDireccion}
      />
      <TextInput
        style={styles.input}
        placeholder="Teléfono"
        keyboardType="phone-pad"
        value={telefono}
        onChangeText={setTelefono}
      />
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        keyboardType="email-address"
        value={correo}
        onChangeText={setCorreo}
      />
      <TextInput
        style={styles.input}
        placeholder="NIT"
        value={nit}
        onChangeText={setNit}
      />
      <TextInput
        style={styles.input}
        placeholder="Descripción"
        value={descripcion}
        onChangeText={setDescripcion}
        multiline
        numberOfLines={4}
      />

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
            <TouchableOpacity style={styles.buttonPrimary} onPress={handleGuardar}>
              <Text style={styles.buttonText}>Guardar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonSecondary} onPress={resetForm}>
              <Text style={styles.buttonTextSec}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default Addcompany;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 15,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 25,
    letterSpacing: 0.5,
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#e1e8ed',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
    marginBottom: 15,
    color: '#2c3e50',
    fontWeight: '500',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  buttonPrimary: {
    backgroundColor: '#3498db',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 12,
    flex: 0.45,
    shadowColor: '#3498db',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonSecondary: {
    backgroundColor: '#ecf0f1',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 12,
    flex: 0.45,
    borderWidth: 1.5,
    borderColor: '#bdc3c7',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  buttonTextSec: {
    color: '#7f8c8d',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
});
