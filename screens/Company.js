import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Dimensions
} from 'react-native';
import { API_BASE_URL } from '../url';
import AddCompany from '../components/Add/addcompany';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UpdateCompany from '../components/Update/Updatecompany';

const Company = ({ selectMenuItem }) => {
  const [empresas, setEmpresas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleUpdate, setModalVisibleUpdate] = useState(false);
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState(null);

  const { width } = Dimensions.get('window');
  const isMobile = Platform.OS === 'ios' || Platform.OS === 'android';

  useEffect(() => {
    obtenerEmpresas();
  }, []);

  const obtenerEmpresas = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/company`);
      const data = await response.json();
      // Mapear para adaptar las propiedades que vienen con nombres diferentes
      const empresasFormateadas = data.map(empresa => ({
        id_empresa: empresa.id_empresas,
        nombre: empresa.Nombre_empresas,
        descripcion: empresa.Descripcion,
        direccion: empresa.Direccion,
        telefono: empresa.Telefono,
        correo: empresa.Correo,
        nit: empresa.NIT,
        estado: empresa.Estado, // "1" o "0"
        // logo eliminado
      }));
      setEmpresas(empresasFormateadas);
    } catch (error) {
      console.error('Error al obtener empresas:', error);
      setEmpresas([]);
    }
  };

  const empresasFiltradas = empresas.filter(
    (empresa) =>
      typeof empresa.nombre === 'string' &&
      empresa.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleActualizar = (empresa) => {
    setEmpresaSeleccionada(empresa);
    setModalVisibleUpdate(true);
  };

  const handleVerDetalles = async (empresa) => {
    await AsyncStorage.setItem('idEmpresaSeleccionada', empresa.id_empresa.toString());
    await AsyncStorage.setItem('nombreEmpresa', empresa.nombre.toString());
    
    selectMenuItem('suppliers');
  };

  const renderItem = ({ item }) => (
    <View style={isMobile ? styles.cardMovil : styles.card}>
      <Text style={styles.title}>{item.nombre}</Text>
      <Text style={styles.description}>
        {item.descripcion?.length > 25 ? item.descripcion.substring(0, 25) + '...' : item.descripcion}
      </Text>

      <Text style={styles.info}>Dirección: {item.direccion}</Text>
      <Text style={styles.info}>Teléfono: {item.telefono}</Text>
      <Text style={styles.info}>Correo: {item.correo}</Text>
      <Text style={styles.info}>NIT: {item.nit}</Text>
      <Text style={styles.info}>Estado: {item.estado === '1' ? 'Activo' : 'Inactivo'}</Text>


      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={isMobile ? styles.buttonPrimaryMovil : styles.buttonPrimary}
          onPress={() => handleVerDetalles(item)}
        >
          <Text style={isMobile ? styles.buttonTextMovil : styles.buttonText}>Ver detalles</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={isMobile ? styles.buttonSecondaryMovil : styles.buttonSecondary}
          onPress={() => handleActualizar(item)}
        >
          <Text style={isMobile ? styles.buttonTextSecMovil : styles.buttonTextSec}>Actualizar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.containerSearchandaddButton}>
        <TextInput
          style={isMobile ? styles.searchInputMovil : styles.searchInput}
          placeholder="Buscar empresa..."
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Text style={isMobile ? styles.addButtonTextMovil : styles.addButtonText}>+ Agregar empresa</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={empresasFiltradas}
        keyExtractor={(item) => item.id_empresa.toString()}
        renderItem={renderItem}
        numColumns={isMobile ? 1 : 4}
        columnWrapperStyle={!isMobile && styles.row}
        ListEmptyComponent={<Text style={styles.emptyText}>No hay empresas disponibles.</Text>}
      />

      <AddCompany
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={obtenerEmpresas}
      />
      <UpdateCompany 
        visible={modalVisibleUpdate}
        onClose={() => setModalVisibleUpdate(false)}
        onSave={obtenerEmpresas}
        empresa={empresaSeleccionada}

      />
    </View>
  );
};

export default Company;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    width: '100%',
    height: '100%',
    backgroundColor: '#f5f5f5',
  },
  containerSearchandaddButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  searchInput: {
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 8,
    width: '75%',
    paddingHorizontal: 5,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  searchInputMovil: {
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 8,
    width: '65%',
    marginRight: 10,
    paddingHorizontal: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    borderRadius: 12,
    padding: 10,
    width: '30%',
    marginBottom: 15,
    backgroundColor: '#fff',
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardMovil: {
    borderRadius: 12,
    padding: 10,
    width: '100%',
    marginBottom: 15,
    backgroundColor: '#fff',
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#333',
  },
  description: {
    fontSize: 13,
    color: '#555',
    marginBottom: 6,
  },
  info: {
    fontSize: 13,
    color: '#444',
    marginBottom: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  buttonPrimary: {
    backgroundColor: '#007bff',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  buttonPrimaryMovil: {
    backgroundColor: '#007bff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  buttonTextMovil: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  buttonSecondary: {
    backgroundColor: '#28a745',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  buttonSecondaryMovil: {
    backgroundColor: '#28a745',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  
  buttonTextSec: {
    color: '#fff',
    fontWeight: '600',
  },
  buttonTextSecMovil: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  addButtonTextMovil: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
  },
});
