import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, View, Text, TouchableOpacity, Modal, Button } from 'react-native';
import { ref, onValue, remove } from 'firebase/database'; 
import { db } from '../config/config';  

export default function TaskList() {
  const [taskList, setTaskList] = useState([]);  
  const [selectedTask, setSelectedTask] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);  

  useEffect(() => {
    const tasksRef = ref(db, "/Itens");

    onValue(tasksRef, (snapshot) => {
      const data = snapshot.val();
      console.log("Dados retornados do Firebase:", data);

      if (data) {
        const taskArray = Object.entries(data).map(([key, item]) => ({
          id: key,
          item: item.item,
          descricao: item.descricao,
        }));
        setTaskList(taskArray);
      } else {
        setTaskList([]);
      }
    });

    return () => {
      tasksRef.off();
    };
  }, []);

  const handleTaskPress = (task) => {
    setSelectedTask(task);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedTask(null);
  };

  const deleteTask = (taskId) => {
    const taskRef = ref(db, `/Itens/${taskId}`); 
    remove(taskRef) 
      .then(() => {
        console.log("Tarefa excluída com sucesso!");
        closeModal();
      })
      .catch((error) => {
        console.error("Erro ao excluir a tarefa: ", error);
      });
  };

  return (
    <View style={styles.container}>
      {taskList.length === 0 ? (
        <Text style={styles.noTasksText}>Não há tarefas disponíveis.</Text>
      ) : (
        <FlatList
          data={taskList}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleTaskPress(item)}>
              <View style={styles.taskItem}>
                <Text style={styles.taskText}>{item.item}</Text>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}

      {/* Modal para mostrar a descrição */}
      {selectedTask && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{selectedTask.item}</Text>
              <Text style={styles.modalDescription}>Descrição: {selectedTask.descricao}</Text>
              <Button title="Fechar" onPress={closeModal} color="#bb86fc" />
              <Button
                title="Excluir Tarefa"
                onPress={() => deleteTask(selectedTask.id)}
                color="#cf6679" // Vermelho do Material Dark
              />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    paddingHorizontal: 15,
    backgroundColor: '#121212',
  },
  noTasksText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#aaa',
    marginTop: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  taskItem: {
    padding: 15,
    backgroundColor: '#1e1e1e',
    borderRadius: 5,
    marginBottom: 10,
    borderColor: '#333',
    borderWidth: 1,
  },
  taskText: {
    fontSize: 16,
    color: '#fff',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#1e1e1e',
    borderRadius: 10,
    alignItems: 'center',
    borderColor: '#333',
    borderWidth: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 20,
    textAlign: 'center',
  },
});
  