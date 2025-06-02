import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,Platform,Dimensions
} from 'react-native';
import { API_BASE_URL } from '../url';
import AddSparePartsCategory from '../components/Add/addspare_parts_category';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Spare_parts_category = ( { selectMenuItem }) => {
  const [categorias, setCategorias] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

const { width } = Dimensions.get('window');
const isMobile = Platform.OS === 'ios' || Platform.OS === 'android';
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

const handleVerSubcategorias = async(categoria) => {
await AsyncStorage.setItem('idCategoriaRepuestos', categoria.id_categorias_repuestos.toString());
  selectMenuItem('sub_category');
};



  const renderItem = ({ item }) => (
   
    <>
{isMobile ? (
   <View style={styles.cardMovil}>
      <Text style={styles.title}>{item.nombre}</Text>
<Text style={styles.description}>
  {item.descripcion.length > 25
    ? item.descripcion.substring(0, 25) + '...'
    : item.descripcion}
</Text>
    {item.foto ? (
      <Image
        source={{ uri: item.foto }}
        style={{
          width: 100,
          height: 100,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 10,
          marginBottom: 10,
          marginTop: 10,
          alignSelf: 'center',
        }}
      />
    ) : (
      <Text>No hay imagen</Text>
    )}

    <View style={styles.buttonContainer}>
      <TouchableOpacity style={styles.buttonPrimaryMovil} onPress={() => handleVerSubcategorias(item)}>
        <Text style={styles.buttonTextMovil}>Sub categoria</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonSecondaryMovil} onPress={() => handleActualizar(item)}>
        <Text style={styles.buttonTextSecMovil}>Actualizar</Text>
      </TouchableOpacity>
    </View>
        </View>

) : (
   <View style={styles.card}>
      <Text style={styles.title}>{item.nombre}</Text>
<Text style={styles.description}>
  {item.descripcion.length > 25
    ? item.descripcion.substring(0, 25) + '...'
    : item.descripcion}
</Text>
    {item.foto ? (
      <Image
        source={{ uri: item.foto }}
        style={{
          width: 200,
          height: 200,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 10,
          marginBottom: 10,
          marginTop: 10,
          alignSelf: 'center',
        }}
      />
    ) : (
      <Text>No hay imagen</Text>
    )}

    <View style={styles.buttonContainer}>
      <TouchableOpacity style={styles.buttonPrimary} onPress={() => handleVerSubcategorias(item)}>
        <Text style={styles.buttonText}>Sub categoria</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonSecondary} onPress={() => handleActualizar(item)}>
        <Text style={styles.buttonTextSec}>Actualizar</Text>
      </TouchableOpacity>
    </View>
        </View>

)}
</>


      
  );

  return (
    <View style={styles.container}>
      

{isMobile ? (
<View style={styles.containerSearchandaddButton}>
      <TextInput
        style={styles.searchInputMovil}
        placeholder="Buscar categoría..."
        value={searchTerm}
        onChangeText={setSearchTerm}
      />
      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonTextMovil}>+ Agregar categoría</Text>
      </TouchableOpacity>
      </View>
):(
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
)}



{isMobile ? (
      <FlatList
        data={categoriasFiltradas}
        keyExtractor={(item) => item.id_categorias_repuestos.toString()}
        renderItem={renderItem}
        numColumns={1}
        ListEmptyComponent={<Text style={styles.emptyText}>No hay categorías disponibles.</Text>}
      />
    ) : (
<FlatList
        data={categoriasFiltradas}
        keyExtractor={(item) => item.id_categorias_repuestos.toString()}
        renderItem={renderItem}
        numColumns={4}
        columnWrapperStyle={styles.row}
        ListEmptyComponent={<Text style={styles.emptyText}>No hay categorías disponibles.</Text>}
      />
      )}

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
    width: '100%',
    height: '100%',
    backgroundColor: '#f5f5f5',
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
}
,
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
}
,
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
}
,
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
  buttonPrimaryMovil: {
    backgroundColor: '#007bff',
    paddingVertical: 6,
    paddingHorizontal: 5,
    borderRadius: 6,
  },
  buttonSecondaryMovil: {
    backgroundColor: '#e0e0e0',
    paddingVertical: 6,
    paddingHorizontal: 5,
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
  buttonTextMovil: {
    color: '#fff',
    fontSize: 5,
  },
  buttonTextSecMovil: {
    color: '#333',
    fontSize: 5,
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
  addButtonTextMovil: {
    color: '#fff',
    marginTop: 3,
    textAlign: 'center',
    fontSize: 8,
  },
  containerSearchandaddButton:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  }
});
