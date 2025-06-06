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
import Addsuppliers from '../components/Add/addsuppliers';
import Updatesuppliers from '../components/Update/Updatesuppliers';

const Suppliers = ({ selectMenuItem }) => {
  const [proveedores, setProveedores] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleUpdate, setModalVisibleUpdate] = useState(false);
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState(null);

  const { width } = Dimensions.get('window');
  const isMobile = Platform.OS === 'ios' || Platform.OS === 'android';

  useEffect(() => {
    obtenerProveedores();
  }, []);

  const obtenerProveedores = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/suppliers`);
    const data = await response.json();


    if (!Array.isArray(data)) {
      return;
    }

    const proveedoresFormateados = data.map(prov => ({
      id_proveedor: prov.id_proveedores,
      nombre: prov.Nombre_proveedor,
      apellido: prov.Apellido_Proveedor,
      telefono: prov.Telefono,
      correo: prov.Correo,
      id_empresa: prov.id_empresa,
    }));

    setProveedores(proveedoresFormateados);
  } catch (error) {
    console.error('Error al obtener proveedores:', error);
    setProveedores([]);
  }
};


  const proveedoresFiltrados = proveedores.filter(
    (prov) =>
      typeof prov.nombre === 'string' &&
      prov.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleActualizar = (proveedor) => {
    setProveedorSeleccionado(proveedor);
    setModalVisibleUpdate(true);
  };

  const handleVerDetalles = (proveedor) => {
    // Implementa la lógica para ver detalles del proveedor si es necesario
    console.log('Detalles del proveedor:', proveedor);
  };

  const renderItem = ({ item }) => (
    <View style={isMobile ? styles.cardMovil : styles.card}>
      <Text style={styles.title}>{item.nombre} {item.apellido}</Text>
      <Text style={styles.info}>Teléfono: {item.telefono}</Text>
      <Text style={styles.info}>Correo: {item.correo}</Text>
      <Text style={styles.info}>ID Empresa: {item.id_empresa}</Text>

      <View style={styles.buttonContainer}>
       
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
          placeholder="Buscar proveedor..."
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Text style={isMobile ? styles.addButtonTextMovil : styles.addButtonText}>+ Agregar proveedor</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={proveedoresFiltrados}
        keyExtractor={(item) => item.id_proveedor.toString()}
        renderItem={renderItem}
        numColumns={isMobile ? 1 : 4}
        columnWrapperStyle={!isMobile && styles.row}
        ListEmptyComponent={<Text style={styles.emptyText}>No hay proveedores disponibles.</Text>}
      />

        <Addsuppliers
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={obtenerProveedores}
      />
      <Updatesuppliers
        visible={modalVisibleUpdate}
        onClose={() => setModalVisibleUpdate(false)}
        proveedor={proveedorSeleccionado}
        onSave={obtenerProveedores}
      />
     
    </View>
  );
};

export default Suppliers;

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
