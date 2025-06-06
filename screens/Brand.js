import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  Platform,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { API_BASE_URL } from '../url';
import Addbrand from '../components/Add/addbrand';
import Updatebrand from '../components/Update/Updatebrands';

const Brand = () => {
  const [brands, setBrands] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleUpdate, setModalVisibleUpdate] = useState(false);
  const [marcaSeleccionada, setMarcaSeleccionada] = useState(null);

  const { width } = Dimensions.get('window');
  const isMobile = Platform.OS === 'ios' || Platform.OS === 'android';

  useEffect(() => {
    obtenerBrands();
  }, []);

  const obtenerBrands = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/brands`);
      const data = await response.json();
      const brandsFormateadas = data.map((marca) => ({
        id_marca: marca.id_marca,
        nombre: marca.Nombre,
        estado: marca.Estado,
      }));
      setBrands(brandsFormateadas);
    } catch (error) {
      console.error('Error al obtener marcas:', error);
      setBrands([]);
    }
  };

  const brandsFiltradas = brands.filter((marca) =>
    marca.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <View style={isMobile ? styles.cardMovil : styles.card}>
      <Text style={styles.title}>{item.nombre}</Text>
      <Text style={styles.info}>Estado: {item.estado? 'Activo': 'Inactivo'}</Text>
      <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={isMobile ? styles.buttonPrimaryMovil : styles.buttonPrimary}
                onPress={() => handleVerDetalles(item)}
              >
                <Text style={isMobile ? styles.buttonTextMovil : styles.buttonText}>Ver detalles</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={isMobile ? styles.buttonSecondaryMovil : styles.buttonSecondary}
                onPress={() => handleUpdate(item)}
              >
                <Text style={isMobile ? styles.buttonTextSecMovil : styles.buttonTextSec}>Actualizar</Text>
              </TouchableOpacity>
            </View>
    </View>
  );

  const handleUpdate = (marca) => {
    setMarcaSeleccionada(marca);
    setModalVisibleUpdate(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={isMobile ? styles.searchInputMovil : styles.searchInput}
          placeholder="Buscar marca..."
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
        <TouchableOpacity
          style={isMobile ? styles.addButtonMovil : styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addButtonText}>+ Agregar Marca</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={brandsFiltradas}
        keyExtractor={(item) => item.id_marca.toString()}
        renderItem={renderItem}
        numColumns={isMobile ? 1 : 3}
        columnWrapperStyle={!isMobile && styles.row}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No hay resultados disponibles.</Text>
        }
      />

        <Addbrand
              visible={modalVisible}
              onClose={() => setModalVisible(false)}
              onSave={obtenerBrands}
            />
            <Updatebrand 
        visible={modalVisibleUpdate}
        onClose={() => setModalVisibleUpdate(false)}
        onSave={obtenerBrands}
        marca={marcaSeleccionada}

      />
    </View>
  );
};

export default Brand;

const styles = StyleSheet.create({
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
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  searchInput: {
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 8,
    width: '75%',
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  searchInputMovil: {
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 8,
    flex: 1,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  addButton: {
    backgroundColor: '#1976d2',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
  },
  addButtonMovil: {
    backgroundColor: '#1976d2',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    width: '30%',
    elevation: 3,
  },
  cardMovil: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    width: '100%',
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  info: {
    fontSize: 13,
    color: '#555',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
  },
});
