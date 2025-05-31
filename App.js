import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet, Text, View, SafeAreaView, Platform, StatusBar } from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import MedicineList from './components/listarItems';
import { Ionicons } from '@expo/vector-icons';
import FormItem from './components/formItem';

const HomeScreen = () => (
  <SafeAreaView style={styles.screen}>
    <Text style={styles.title}>Meus Remédios</Text>
    <MedicineList />
  </SafeAreaView>
);



const Tab = createBottomTabNavigator();

const App = () => (
  <NavigationContainer >
    <ExpoStatusBar style="dark" />
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#2196F3',
        tabBarInactiveTintColor: '#757575',
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        tabBarLabelPosition: 'below-icon',
        headerShown: true,
        header: () => (
          <View style={styles.header}>
            <Ionicons name="medical" size={28} color="#2196F3" style={styles.headerIcon} />
            <Text style={styles.headerTitle}>RemeDiário</Text>
          </View>
        ),
      }}
    >
      <Tab.Screen
        name="Meus Remédios"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="medical" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Adicionar Remédio"
        component={FormItem}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  </NavigationContainer>
);

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1565C0',
    textAlign: 'center',
  },
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E3F2FD',
    height: 65,
    paddingBottom: 5,
    paddingTop: 5,
    shadowColor: '#2196F3',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },

  header: {
    width: '100%',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E3F2FD',
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#2196F3',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerIcon: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1565C0',
  },
});

export default App;
