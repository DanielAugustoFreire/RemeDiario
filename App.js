import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DarkTheme as NavigationDarkTheme } from '@react-navigation/native';
import { StyleSheet, Text, View, SafeAreaView, Platform, StatusBar } from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import TaskList from './components/listarItems';
import { Ionicons } from '@expo/vector-icons';
import FormItem from './components/formItem';

const HomeScreen = () => (
  <SafeAreaView style={styles.screen}>
    <Text style={styles.title}>Tarefas Pendentes</Text>
    <TaskList />
  </SafeAreaView>
);

const DarkTheme = {
  ...NavigationDarkTheme,
  colors: {
    ...NavigationDarkTheme.colors,
    background: '#121212',
    card: '#1e1e1e',
    text: '#ffffff',
    border: '#272727',
    primary: '#bb86fc',
  },
};

const Tab = createBottomTabNavigator();

const App = () => (
  <NavigationContainer theme={DarkTheme}>
    <ExpoStatusBar style="light" />
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#bb86fc',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: styles.tabBarDark,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarLabelPosition: 'below-icon',
        headerShown: true, // Mostrar o cabeçalho em todas as telas
        header: () => (
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Remediario</Text>
          </View>
        ),
      }}
    >
      <Tab.Screen 
        name="Remediário" 
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Inserir Item" 
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
    backgroundColor: '#121212',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#ffffff',
    textAlign: 'center',
  },
  tabBarDark: {
    backgroundColor: '#1e1e1e',
    borderTopWidth: 0.5,
    borderTopColor: '#333',
    height: 60,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  header: {
    width: '100%',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#1e1e1e',
    borderBottomWidth: 1,
    borderBottomColor: '#272727',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});

export default App;
