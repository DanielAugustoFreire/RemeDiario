// TaskItem.js
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const TaskItem = ({ task }) => {
  return (
    <View style={styles.taskItem}>
      <Text style={styles.taskText}>{task}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  taskItem: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#1e1e1e', // Fundo escuro do card
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#333', // Borda escura
  },
  taskText: {
    color: '#fff', // Texto claro
    fontSize: 16,
  },
});

export default TaskItem;
