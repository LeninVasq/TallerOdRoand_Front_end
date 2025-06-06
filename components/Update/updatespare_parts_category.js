import React, { useState,useEffect  } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  Image,
  Platform,Switch 
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import { API_BASE_URL } from '../../url';
import Swal from 'sweetalert2';
import AwesomeAlert from 'react-native-awesome-alerts';



const UpdateSparePartsCategory = ({ visible, onClose, onSave, categoria  }) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [image, setImage] = useState(null);
  const [activo, setActivo] = useState(false);
const isMobile = Platform.OS === 'ios' || Platform.OS === 'android';


useEffect(() => {
    if (categoria) {
      setNombre(categoria.nombre);
      setDescripcion(categoria.descripcion);
      setImage(categoria.foto);
      setActivo(categoria.estado);
    }
  }, [categoria]);
  const handleFileChange = () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        


         const selectedImage = response.assets[0].uri

      // Validar si la imagen ya estaba en base64
      if (image === selectedImage) {
        console.log('Esta imagen ya estaba cargada como base64.');
              setImage(image);

        return;
      }

      // Guardar la nueva imagen en base64
      setImage(selectedImage);
      }
    });
  };

  const handleGuardarUpdate = async () => {


    if (image === null) {
      if (!isMobile) {
                  Swal.fire({
                    icon: 'error',
                    title: 'Campo vacio',
                    text: 'Se requiere una imagen',
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
  message='Se requiere una imagen'
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

      const response = await fetch(`${API_BASE_URL}/Spare_Parts_Category/${categoria.id_categorias_repuestos}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:  JSON.stringify({
          name: nombre,
          description: descripcion,
          photo: image ,
          status: activo? 1 : 0,
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
                    text: 'Categoría actualizada correctamente',
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
  message='Categoría actualizada correctamente'
  closeOnTouchOutside={true}
  showCancelButton={false}
  showConfirmButton={true}
  confirmText="Aceptar"
  confirmButtonColor="#007AFF"
  onConfirmPressed={() => setShowAlert(false)}
/>}      onSave(); // Avisar al padre para refrescar o cerrar modal
      resetFormUpdate();
      }
    
    } catch (error) {
      console.error('Error al guardar categoría:', error);
      Alert.alert('Error', 'No se pudo guardar la categoría');
    }
  };

  const resetFormUpdate = () => {
    setNombre('');
    setDescripcion('');
    setImage(null);
    onClose();
  };

  return (
    <Modal visible={visible}animationType="slide" style={{ zIndex: 10 }} transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Actualizar Categoria  {categoria?.nombre}</Text>

          <TextInput
            style={styles.input}
            placeholder="Nombre"
            value={nombre}
            onChangeText={setNombre}
          />
          <TextInput
            style={styles.input}
            placeholder="Descripción"
            value={descripcion}
            onChangeText={setDescripcion}
          />

         <TouchableOpacity onPress={handleFileChange} style={{alignItems: 'center'}}>
      {image  ? (
        <Image
          source={{
            uri: image,
          }}
          style={{width: 80, height: 80, borderRadius: 10}}
        />
      ) : (
        <Text style={{fontSize: 14, color: '#aaa', padding:20}}>Subir Imagen</Text>
      )}
    </TouchableOpacity>

    <View style={styles.switchContainer}>
          <Text>Estado: {activo ? 'Activo' : 'Inactivo'}</Text>
            <Switch
              value={activo}
              onValueChange={setActivo}
            />
          </View>



          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
            <TouchableOpacity style={styles.buttonPrimary} onPress={handleGuardarUpdate}>
              <Text style={styles.buttonText}>Guardar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonSecondary} onPress={resetFormUpdate}>
              <Text style={styles.buttonTextSec}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default UpdateSparePartsCategory;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    justifyContent: 'space-between',
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
