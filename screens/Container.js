import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Animated,
  Dimensions,
  Image,
  ScrollView,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Spare_parts_category from './spare_parts_category'; // Asegúrate de que la ruta sea correcta
import Dashboard from './Dashboard';
import Sub_category from './sub_category';
import Spare_parts from './spare_parts';
import Company from './Company';
import Suppliers from './Suppliers';
const { width } = Dimensions.get('window');

let SIDEBAR_WIDTH ; 
if (Platform.OS === 'android') {
  SIDEBAR_WIDTH = 600;
}else {
  SIDEBAR_WIDTH = width * 0.3;
}
export default function Container() {
  const [currentScreen, setCurrentScreen] = useState('company');
  const [sidebarVisible, setSidebarVisible] = useState(false);
const slideAnim = useRef(new Animated.Value(Platform.OS === 'android' ? -200 : -SIDEBAR_WIDTH)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;




  const handleSubmit = async (e) => {
        try {
      const response = await fetch(`${API_BASE_URL}/close_session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
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
      await AsyncStorage.setItem('id', result.id_usuario.toString());
      await AsyncStorage.setItem('email', result.correo);

      //alert(result.id_tipo_usuario);
      switch (result.id_tipo_usuario) {
        case 1:
          navigation.navigate('Container');
          if (!isMobile) {
            Swal.fire({
              icon: 'success',
              title: 'Inicio de sesión exitoso',
              text: 'Bienvenido de nuevo',
              toast: true,  
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000,  
            });
          }
          break;
          
      }
      
      
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error al iniciar sesión',
        text: 'Error',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
      });
    }
    
    
   
  };


  const menuItems = [
    //badge sirve para mostrar notificaciones o conteos
    //defino los elementos del menú para luego mostrarlos 
    { id: 'dashboard', title: 'Dashboard', icon: 'speedometer-outline', badge: null },
    { id: 'spare_parts_category', title: 'Categorías de Repuestos', icon: 'car-outline', badge: null },
    { id: 'company', title: 'Empresas', icon: 'grid-outline', badge: null },
    { id: 'orders', title: 'Pedidos', icon: 'receipt-outline', badge: '3' },
    { id: 'inventory', title: 'Inventario', icon: 'cube-outline', badge: null },
    { id: 'customers', title: 'Clientes', icon: 'people-outline', badge: null },
    { id: 'reports', title: 'Reportes', icon: 'bar-chart-outline', badge: null },
    { id: 'settings', title: 'Configuración', icon: 'settings-outline', badge: null },
  ];

 const toggleSidebar = () => {
  const toValue = sidebarVisible ? -SIDEBAR_WIDTH : 0;
  const overlayValue = sidebarVisible ? 0 : 0.5;

  Animated.parallel([
    Animated.timing(slideAnim, {
      toValue,
      duration: 300,
      useNativeDriver: true,
    }),
    Animated.timing(overlayAnim, {
      toValue: overlayValue,
      duration: 300,
      useNativeDriver: true,
    }),
  ]).start();

  setSidebarVisible(!sidebarVisible);
};

  const selectMenuItem = (itemId) => {
    setCurrentScreen(itemId);
    toggleSidebar();
  };


  const renderContent = () => {
    
    const screens = {
      dashboard: { title: 'Dashboard', subtitle: 'Resumen general del sistema' },
      spare_parts_category: { title: 'Categoria de Repuestos', subtitle: 'Gestión de categorias de repuestos automotrices' },
      company: { title: 'Empresas', subtitle: 'Empresas agregadas' },
      orders: { title: 'Pedidos', subtitle: 'Gestión de órdenes de compra' },
      inventory: { title: 'Inventario', subtitle: 'Control de stock y almacén' },
      customers: { title: 'Clientes', subtitle: 'Base de datos de clientes' },
      reports: { title: 'Reportes', subtitle: 'Análisis y estadísticas' },
      sub_category: { title: 'Sub categorias', subtitle: 'Sub categorias de repuestos' },
      spare_parts: { title: 'Repuestos', subtitle: 'Control de repuestos y stock' },

      settings: { title: 'Configuración', subtitle: 'Ajustes del sistema' },
      suppliers: { title: 'Proveedores', subtitle: 'Proveedores' },
    };

    //para renderizar componentes específicos según la pantalla seleccionada
    const screenComponents = {
      spare_parts_category: (props) => <Spare_parts_category {...props} selectMenuItem={selectMenuItem} />,
      dashboard: Dashboard,
      sub_category:  (props) => <Sub_category {...props} selectMenuItem={selectMenuItem} />,
      spare_parts: Spare_parts,
      company: (props) => <Company {...props} selectMenuItem={selectMenuItem} />,
      suppliers: Suppliers,
    };

    const current = screens[currentScreen];
    const SelectedComponent = screenComponents[currentScreen];

    if (SelectedComponent) {
      return (
        <View style={styles.contentContainer}>
          <View style={styles.contentHeader}>
            <Text style={styles.contentTitle}>{current.title}</Text>
            <Text style={styles.contentSubtitle}>{current.subtitle}</Text>
          </View>
          <View style={styles.contentBody}>
            <SelectedComponent />
          </View>
        </View>
      );
    }

    return (
      <View style={styles.contentContainer}>
      <Text style={styles.contentTitle}>Pantalla no encontrada</Text>
    </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1e293b" />

      {/* Header Principal */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton} onPress={toggleSidebar}>
          <Ionicons name="menu" size={24} color="#ffffff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>AutoParts Pro</Text>

        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="search" size={22} color="#ffffff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <View style={styles.notificationBadge}>
              <Text style={styles.badgeText}>5</Text>
            </View>
            <Ionicons name="notifications-outline" size={22} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Contenido Principal */}
      <View style={styles.mainContent}>{renderContent()}</View>

      {/* Overlay */}
      {sidebarVisible && (
        <Animated.View style={[styles.overlay, { opacity: overlayAnim }]}>
          <TouchableOpacity style={styles.overlayTouch} onPress={toggleSidebar} activeOpacity={1} />
        </Animated.View>
      )}

      {/* Sidebar */}
      <Animated.View style={[styles.sidebar, {width: Platform.OS === 'android' ? 200 : SIDEBAR_WIDTH,  
        transform: [{ translateX: slideAnim }] }]}>
        {/* Header del Sidebar */}
        <View style={styles.sidebarHeader}>
          <View style={styles.userProfile}>
            <Image source={{ uri: 'https://i.pravatar.cc/100?img=1' }} style={styles.userAvatar} />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>Juan Pérez</Text>
              <Text style={styles.userRole}>Administrador</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.closeButton} onPress={toggleSidebar}>
            <Ionicons name="close" size={24} color="#64748b" />
          </TouchableOpacity>
        </View>

        {/* Menú de Navegación */}
        <ScrollView style={styles.sidebarContent} showsVerticalScrollIndicator={false}>
          <View style={styles.menuSection}>
            <Text style={styles.sectionTitle}>NAVEGACIÓN</Text>

            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.menuItem, currentScreen === item.id && styles.menuItemActive]}
                onPress={() => selectMenuItem(item.id)}
              >
                <View style={styles.menuItemLeft}>
                  <Ionicons
                    name={item.icon}
                    size={22}
                    color={currentScreen === item.id ? '#3b82f6' : '#64748b'}
                  />
                  <Text style={[styles.menuItemText, currentScreen === item.id && styles.menuItemTextActive]}>
                    {item.title}
                  </Text>
                </View>

                {item.badge && (
                  <View style={styles.menuBadge}>
                    <Text style={styles.menuBadgeText}>{item.badge}</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Sección Adicional */}
          <View style={styles.menuSection}>
            <Text style={styles.sectionTitle}>CUENTA</Text>

            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <Ionicons name="help-circle-outline" size={22} color="#64748b" />
                <Text style={styles.menuItemText}>Ayuda</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <Ionicons name="log-out-outline" size={22} color="#ef4444" />
                <Text style={[styles.menuItemText, { color: '#ef4444' }]}>Cerrar Sesión</Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Footer del Sidebar */}
        <View style={styles.sidebarFooter}>
          <Text style={styles.footerText}>AutoParts Pro v2.1.0</Text>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  menuButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    flex: 1,
    marginLeft: 16,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    marginLeft: 16,
    padding: 4,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 1,
    zIndex: 10,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },

  // Contenido principal
  mainContent: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  contentContainer: {
    flex: 1,
    padding: 24,
  },
  contentHeader: {
    marginBottom: 24,
  },
  contentTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  contentSubtitle: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 4,
  },
  contentBody: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    flex: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 8,
  },
  card: {
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginTop: 12,
    color: '#1e293b',
  },
  cardText: {
    fontSize: 14,
    color: '#475569',
    marginTop: 6,
    textAlign: 'center',
    maxWidth: 280,
  },

  // Sidebar
  sidebar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 10,
    zIndex: 20,
    paddingTop: 40,
  },
  sidebarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  userProfile: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  userInfo: {
    marginLeft: 12,
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#0f172a',
  },
  userRole: {
    fontSize: 12,
    color: '#64748b',
  },
  closeButton: {
    padding: 4,
  },

  sidebarContent: {
    flex: 1,
  },
  menuSection: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#94a3b8',
    marginBottom: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    justifyContent: 'space-between',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    marginLeft: 12,
    color: '#475569',
  },
  menuItemActive: {
    backgroundColor: '#e0e7ff',
    borderRadius: 8,
    paddingLeft: 12,
  },
  menuItemTextActive: {
    color: '#3b82f6',
    fontWeight: '600',
  },
  menuBadge: {
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 24,
    alignItems: 'center',
  },
  menuBadgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },

  sidebarFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  footerText: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'center',
  },

  // Overlay
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#000',
    zIndex: 10,
  },
  overlayTouch: {
    flex: 1,
  },
});
