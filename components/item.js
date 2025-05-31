// MedicineItem.js
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const MedicineItem = ({ medicine }) => {
  return (
    <View style={styles.medicineItem}>
      <Text style={styles.medicineName}>{medicine.nome}</Text>
      <Text style={styles.medicineInfo}>
        {medicine.dosagem} • {medicine.horario}
      </Text>
      {medicine.frequencia && (
        <Text style={styles.medicineFrequency}>{medicine.frequencia}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  medicineItem: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#1e1e1e', // Fundo escuro do card
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333', // Borda escura
  },
  medicineName: {
    color: '#fff', // Texto claro
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  medicineInfo: {
    color: '#bb86fc',
    fontSize: 14,
    marginBottom: 3,
  },
  medicineFrequency: {
    color: '#aaa',
    fontSize: 12,
  },
});

export default MedicineItem;
