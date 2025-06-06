import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { API_BASE_URL } from '../url';
import Swal from 'sweetalert2';
import AwesomeAlert from 'react-native-awesome-alerts';
import { useNavigation } from '@react-navigation/native';
import AddSpare_parts from '../components/Add/addSpare_parts';
import AsyncStorage from '@react-native-async-storage/async-storage';



const Spare_parts = () => {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  
  const obtenerSubCategorias = async () => {
          const idSubCategoria = await AsyncStorage.getItem('idsub_categorias');
    try {
      const response = await fetch(`${API_BASE_URL}/Spare_parts_Category_Id/${idSubCategoria}`);
      const data = await response.json();
      setCategorias(data);
    } catch (error) {
      console.error('Error al obtener categorías:', error);
      setCategorias([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerSubCategorias();
  }, []);

  const handleUpdate = (id) => {
    console.log('Actualizar ID:', id);
    // Lógica para actualizar
  };

  const handleAdd = () => {
    console.log('Agregar nueva subcategoría');
    // Lógica para agregar
  };

  const renderRow = (item, index) => (
    <View
      key={index}
      style={[
        styles.row,
        index % 2 === 0 ? styles.evenRow : styles.oddRow,
      ]}
    >
      <View style={styles.nameCell}>
        <Text style={styles.nameText} numberOfLines={2}>
          {item.nombre}
        </Text>
      </View>
      <View style={styles.descriptionCell}>
        <Text style={styles.descriptionText} numberOfLines={3}>
          {item.descripcion}
        </Text>
      </View>
      <View style={styles.descriptionCell}>
        <Text style={styles.descriptionText} numberOfLines={3}>
          {item.sctok}
        </Text>
      </View>

      <View style={styles.imageCell}>
        <Image source={{ uri: item.foto }} style={styles.image} />
      </View>
      <View style={styles.statusCell}>
        <Text
          style={[
            styles.statusText,
            { color: item.estado ? '#4CAF50' : '#f44336' },
          ]}
        >
          {item.estado ? 'Activo' : 'Inactivo'}
        </Text>
      </View>
      <View style={styles.actionsCell}>
        <TouchableOpacity
          style={[styles.button, styles.updateButton]}
          onPress={() => handleUpdate(item.id_categoria)}
        >
          <Text style={styles.buttonText}>Actualizar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.updateButton]}
          onPress={() => handleUpdate(item.id_categoria)}
        >
          <Text style={styles.buttonText}>Ingreso</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nombre..."
          value={search}
          onChangeText={setSearch}
        />
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.addButtonText}>Agregar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.headerContainer}>
        <View style={styles.nameCell}>
          <Text style={styles.headerText}>Nombre</Text>
        </View>
        <View style={styles.descriptionCell}>
          <Text style={styles.headerText}>Descripción</Text>
        </View>
        <View style={styles.descriptionCell}>
          <Text style={styles.headerText}>Stock</Text>
        </View>
        <View style={styles.imageCell}>
          <Text style={styles.headerText}>Foto</Text>
        </View>
        <View style={styles.statusCell}>
          <Text style={styles.headerText}>Estado</Text>
        </View>
        <View style={styles.actionsCell}>
          <Text style={styles.headerText}>Acciones</Text>
        </View>
      </View>

      <View style={styles.tableContainer}>
  {loading ? (
    <ActivityIndicator size="large" color="#3498db" style={{ padding: 24 }} />
  ) : !Array.isArray(categorias) || categorias.length === 0 ? (
    <Text style={styles.emptyText}>No hay datos disponibles.</Text>
  ) : (
    <ScrollView showsVerticalScrollIndicator={false}>
      {categorias
        .filter((item) =>
          item.nombre.toLowerCase().includes(search.toLowerCase())
        )
        .map(renderRow)}
    </ScrollView>
  )}
</View>


      <AddSpare_parts
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={obtenerSubCategorias}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', padding: 16 },
  topBar: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  addButton: {
    backgroundColor: '#2980b9',
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  tableContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
  },
  headerContainer: {
    flexDirection: 'row',
    backgroundColor: '#3498db',
    paddingHorizontal: 12,
    height: 64,
    alignItems: 'center',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  evenRow: { backgroundColor: '#ffffff' },
  oddRow: { backgroundColor: '#f8f9fa' },
  nameCell: { flex: 2, justifyContent: 'center' },
  descriptionCell: { flex: 3, justifyContent: 'center' },
  imageCell: { flex: 1.5, alignItems: 'center', justifyContent: 'center' },
  statusCell: { flex: 1.5, alignItems: 'center', justifyContent: 'center' },
  actionsCell: {
    flex: 2.2,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  headerText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
    textAlign: 'center',
  },
  nameText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    textAlign: 'center',
  },
  descriptionText: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  statusText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 4,
    textAlign: 'center',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ecf0f1',
  },
  button: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    marginHorizontal: 4,
  },
  updateButton: {
    backgroundColor: '#2ecc71',
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
  },
  buttonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    padding: 24,
    fontSize: 16,
    color: '#7f8c8d',
  },
});

export default Spare_parts;
