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
import { launchImageLibrary } from 'react-native-image-picker';
import { API_BASE_URL } from '../../url';
import Swal from 'sweetalert2';
import AwesomeAlert from 'react-native-awesome-alerts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';


let message = '';

let title = '';

const AddSub_Category = ({ visible, onClose, onSave }) => {
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [image, setImage] = useState(null);
    const isMobile = Platform.OS === 'ios' || Platform.OS === 'android';
    const [showAlert, setShowAlert] = useState(false);
    const [imageM, setImageM] = useState('');


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
                setImage(response.assets[0].uri);
            }
        });
    };

    const handleFileChangeNative = async () => {
        // Pedir permisos
        const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!granted) {
            alert('Se necesitan permisos para acceder a la galería');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
            base64: false, // base64: false porque lo haremos manualmente
        });

        if (!result.cancelled) {
            const uri = result.assets ? result.assets[0].uri : result.uri;

            // Leer archivo y convertir a base64
            const base64 = await FileSystem.readAsStringAsync(uri, {
                encoding: FileSystem.EncodingType.Base64,
            });

            setImage("data:image/jpeg;base64,"+base64); // Puedes seguir usando la URI si la necesitas
            setImageM(uri); // Guardar la imagen en base64
        }
    };

    const handleGuardar = async () => {


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
            else {
                setShowAlert(true);
                message = 'Se requiere una imagen'
                title = 'Error'
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
            else {
                setShowAlert(true);
                message = 'Todos los campos son obligatorios'
                title = 'Error'
            }
            return;
        }

        try {
            
            console.log('Guardando categoría:',  image);
            const idCategoria = await AsyncStorage.getItem('idCategoriaRepuestos');

            const response = await fetch(`${API_BASE_URL}/Sub_category`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: nombre,
                    description: descripcion,
                    photo: image,
                    spare_parts_category_id: idCategoria,
                }),
            });

            if (!response.ok) throw new Error(`Error: ${response.error_message}`);

            const result = await response.json();

            console.log('Categoría guardada:', result);
            if (result.error_message === 'The sub category already exists') {
                if (!isMobile) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Existe',
                        text: 'La sub categoría ya existe',
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 3000,

                    });
                }
                else {
                    setShowAlert(true);
                    message = 'La sub categoría ya existe'
                    title = 'Existe'
                }
            } else {
                if (!isMobile) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Exito',
                        text: 'Sub categoría guardada correctamente',
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 3000,

                    });
                }
                else {
                    setShowAlert(true);
                    message = 'Sub categoría guardada correctamente'
                    title = 'Existe'
                } onSave(); // Avisar al padre para refrescar o cerrar modal
                resetForm();
            }
            console.log('Categoría guardada:', result);
        } catch (error) {
            console.error('Error al guardar categoría:', error);
            Alert.alert('Error', 'No se pudo guardar la categoría');
        }
    };

    const resetForm = () => {
        setNombre('');
        setDescripcion('');
        setImage(null);
        onClose();
    };

    return (

        <Modal visible={visible} animationType="slide" style={{ zIndex: 10 }} transparent={true}>

            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    {isMobile ? (
                        <AwesomeAlert
                            show={showAlert}
                            title={title}
                            message={message}
                            closeOnTouchOutside={true}
                            showCancelButton={false}
                            showConfirmButton={true}
                            confirmText="Aceptar"
                            confirmButtonColor="#007AFF"
                            onConfirmPressed={() => setShowAlert(false)}
                        />) : (
                        <></>
                    )
                    }
                    <Text style={styles.modalTitle}>Nueva Sub Categoría</Text>

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

                    {isMobile ? (
                        <TouchableOpacity onPress={handleFileChangeNative} style={{ alignItems: 'center' }}>
                            {imageM ? (
                                <Image
                                    source={{
                                        uri: imageM,
                                    }}
                                    style={{ width: 80, height: 80, borderRadius: 10 }}
                                />
                            ) : (
                                <Text style={{ fontSize: 14, color: '#aaa', padding: 20 }}>Subir Imagen</Text>
                            )}
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity onPress={handleFileChange} style={{ alignItems: 'center' }}>
                            {image ? (
                                <Image
                                    source={{
                                        uri: image,
                                    }}
                                    style={{ width: 80, height: 80, borderRadius: 10 }}
                                />
                            ) : (
                                <Text style={{ fontSize: 14, color: '#aaa', padding: 20 }}>Subir Imagen</Text>
                            )}
                        </TouchableOpacity>
                    )}

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

export default AddSub_Category;

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
