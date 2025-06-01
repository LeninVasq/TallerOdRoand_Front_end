import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image
} from 'react-native';
import { API_BASE_URL } from '../url';
import AddSparePartsCategory from '../components/addspare_parts_category';

const Spare_parts_category = () => {
  const [categorias, setCategorias] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalVisible, setModalVisible] = useState(false);


  useEffect(() => {
    obtenerCategorias();
  }, []);

  const obtenerCategorias = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/Spare_Parts_Category`);
      const data = await response.json();
      setCategorias(data);
    } catch (error) {
      console.error('Error al obtener categorías:', error);
      setCategorias([]);
    }
  };

  const categoriasFiltradas = categorias.filter(
    (categoria) =>
      typeof categoria.nombre === 'string' &&
      categoria.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleActualizar = (categoria) => {
    Alert.alert('Actualizar', `Actualizar categoría: ${categoria.nombre}`);
  };

  const handleVerRepuestos = (categoria) => {
    Alert.alert('Ver repuestos', `Repuestos de la categoría: ${categoria.nombre}`);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.nombre}</Text>
      <Text style={styles.description}>{item.descripcion}</Text>
{item.foto ? (
  <Image
    source="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAAAAAAAD/4QAuRXhpZgAATU0AKgAAAAgAAkAAAAMAAAABAIIAAEABAAEAA"
  />
) : (
  <Text>No hay imagen</Text>
)}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.buttonPrimary} onPress={() => handleVerRepuestos(item)}>
          <Text style={styles.buttonText}>Repuestos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonSecondary} onPress={() => handleActualizar(item)}>
          <Text style={styles.buttonTextSec}>Actualizar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.containerSearchandaddButton}>
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar categoría..."
        value={searchTerm}
        onChangeText={setSearchTerm}
      />
      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>+ Agregar categoría</Text>
      </TouchableOpacity>
      </View>

      <FlatList
        data={categoriasFiltradas}
        keyExtractor={(item) => item.id_categorias_repuestos.toString()}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={styles.row}
        ListEmptyComponent={<Text style={styles.emptyText}>No hay categorías disponibles.</Text>}
      />

    <AddSparePartsCategory
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={obtenerCategorias}
      />
    </View>
  );
};

export default Spare_parts_category;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    w2idth: '100%',
    backgroundColor: '#f5f5f5',
  },
  searchInput: {
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  row: {
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    marginBottom: 15,
    flex: 1,
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
  fotoPlaceholder: {
    fontSize: 12,
    color: '#888',
    marginBottom: 10,
    fontStyle: 'italic',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonPrimary: {
    backgroundColor: '#007bff',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  buttonSecondary: {
    backgroundColor: '#e0e0e0',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 13,
  },
  buttonTextSec: {
    color: '#333',
    fontSize: 13,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 30,
    color: '#555',
  },
  addButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 6,
    marginBottom: 15,
  },
  addButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 15,
  },
  containerSearchandaddButton:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  }
});
