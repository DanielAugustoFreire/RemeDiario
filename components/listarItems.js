import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, View, Text, TouchableOpacity, Modal, ScrollView, Alert } from 'react-native';
import { ref, onValue, remove, update } from 'firebase/database';
import { db } from '../config/config';
import { Ionicons } from '@expo/vector-icons';

export default function MedicineList() {
  const [medicineList, setMedicineList] = useState([]);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const medicinesRef = ref(db, "/Remedios");

    const unsubscribe = onValue(medicinesRef, (snapshot) => {
      const data = snapshot.val();
      console.log("Dados retornados do Firebase:", data);

      if (data) {
        const medicineArray = Object.entries(data).map(([key, medicine]) => ({
          id: key,
          nome: medicine.nome,
          dosagem: medicine.dosagem,
          horario: medicine.horario,
          frequencia: medicine.frequencia,
          observacoes: medicine.observacoes,
          dataCriacao: medicine.dataCriacao,
          tomado: medicine.tomado || false,
          ultimaVezTomado: medicine.ultimaVezTomado || null,
        }));
        setMedicineList(medicineArray);
      } else {
        setMedicineList([]);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleMedicinePress = (medicine) => {
    setSelectedMedicine(medicine);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedMedicine(null);
  };

  const toggleMedicineTaken = (medicineId, currentStatus) => {
    const medicineRef = ref(db, `/Remedios/${medicineId}`);
    const newStatus = !currentStatus;
    const updateData = {
      tomado: newStatus,
      ultimaVezTomado: newStatus ? new Date().toISOString() : null,
    };

    update(medicineRef, updateData)
      .then(() => {
        const message = newStatus ? "Remédio marcado como tomado!" : "Remédio desmarcado!";
        Alert.alert("Sucesso", message);
        console.log("Status do remédio atualizado com sucesso!");
      })
      .catch((error) => {
        console.error("Erro ao atualizar o status do remédio: ", error);
        Alert.alert("Erro", "Erro ao atualizar o status do remédio");
      });
  };

  const deleteMedicine = (medicineId) => {
    Alert.alert(
      "Confirmar Exclusão",
      "Tem certeza que deseja excluir este remédio?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => {
            const medicineRef = ref(db, `/Remedios/${medicineId}`);
            remove(medicineRef)
              .then(() => {
                console.log("Remédio excluído com sucesso!");
                closeModal();
                Alert.alert("Sucesso", "Remédio excluído com sucesso!");
              })
              .catch((error) => {
                console.error("Erro ao excluir o remédio: ", error);
                Alert.alert("Erro", "Erro ao excluir o remédio");
              });
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      {medicineList.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="medical-outline" size={64} color="#90CAF9" />
          <Text style={styles.noMedicinesText}>Nenhum remédio cadastrado</Text>
          <Text style={styles.noMedicinesSubtext}>Adicione seu primeiro remédio na aba "Adicionar Remédio"</Text>
        </View>
      ) : (
        <FlatList
          data={medicineList}
          renderItem={({ item }) => (
            <View style={styles.medicineItemContainer}>
              <TouchableOpacity onPress={() => handleMedicinePress(item)} style={[
                styles.medicineItem,
                item.tomado && styles.medicineItemTaken
              ]}>
                <View style={styles.medicineHeader}>
                  <Ionicons name="medical" size={24} color={item.tomado ? "#4CAF50" : "#2196F3"} />
                  <Text style={[styles.medicineName, item.tomado && styles.medicineNameTaken]}>{item.nome}</Text>
                  {item.tomado && (
                    <View style={styles.takenBadge}>
                      <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                      <Text style={styles.takenText}>Tomado</Text>
                    </View>
                  )}
                </View>
                <View style={styles.medicineDetails}>
                  <View style={styles.detailItem}>
                    <Ionicons name="flask-outline" size={16} color="#1976D2" />
                    <Text style={styles.medicineInfo}>{item.dosagem}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Ionicons name="time-outline" size={16} color="#1976D2" />
                    <Text style={styles.medicineInfo}>{item.horario}</Text>
                  </View>
                </View>
                {item.frequencia && (
                  <View style={styles.frequencyContainer}>
                    <Ionicons name="repeat-outline" size={14} color="#42A5F5" />
                    <Text style={styles.medicineFrequency}>{item.frequencia}</Text>
                  </View>
                )}
                {item.tomado && item.ultimaVezTomado && (
                  <View style={styles.lastTakenContainer}>
                    <Ionicons name="time" size={12} color="#4CAF50" />
                    <Text style={styles.lastTakenText}>
                      Última vez: {new Date(item.ultimaVezTomado).toLocaleString('pt-BR')}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.toggleButton, item.tomado && styles.toggleButtonTaken]}
                onPress={() => toggleMedicineTaken(item.id, item.tomado)}
              >
                <Ionicons
                  name={item.tomado ? "checkmark-circle" : "ellipse-outline"}
                  size={24}
                  color={item.tomado ? "#FFFFFF" : "#2196F3"}
                />
                <Text style={[styles.toggleButtonText, item.tomado && styles.toggleButtonTextTaken]}>
                  {item.tomado ? "Tomado" : "Marcar"}
                </Text>
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Modal para mostrar detalhes do remédio */}
      {selectedMedicine && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Ionicons name="medical" size={28} color="#2196F3" />
                <Text style={styles.modalTitle}>{selectedMedicine.nome}</Text>
                <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                  <Ionicons name="close" size={24} color="#757575" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
                <View style={[styles.detailRow, selectedMedicine.tomado && styles.detailRowTaken]}>
                  <View style={styles.detailIconContainer}>
                    <Ionicons
                      name={selectedMedicine.tomado ? "checkmark-circle" : "ellipse-outline"}
                      size={20}
                      color={selectedMedicine.tomado ? "#4CAF50" : "#FF9800"}
                    />
                  </View>
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>Status</Text>
                    <Text style={[styles.detailValue, selectedMedicine.tomado && styles.detailValueTaken]}>
                      {selectedMedicine.tomado ? "Tomado" : "Não tomado"}
                    </Text>
                    {selectedMedicine.tomado && selectedMedicine.ultimaVezTomado && (
                      <Text style={styles.lastTakenDetail}>
                        Última vez: {new Date(selectedMedicine.ultimaVezTomado).toLocaleString('pt-BR')}
                      </Text>
                    )}
                  </View>
                </View>

                <View style={styles.detailRow}>
                  <View style={styles.detailIconContainer}>
                    <Ionicons name="flask" size={20} color="#2196F3" />
                  </View>
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>Dosagem</Text>
                    <Text style={styles.detailValue}>{selectedMedicine.dosagem}</Text>
                  </View>
                </View>

                <View style={styles.detailRow}>
                  <View style={styles.detailIconContainer}>
                    <Ionicons name="time" size={20} color="#2196F3" />
                  </View>
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>Horário</Text>
                    <Text style={styles.detailValue}>{selectedMedicine.horario}</Text>
                  </View>
                </View>

                {selectedMedicine.frequencia && (
                  <View style={styles.detailRow}>
                    <View style={styles.detailIconContainer}>
                      <Ionicons name="repeat" size={20} color="#2196F3" />
                    </View>
                    <View style={styles.detailContent}>
                      <Text style={styles.detailLabel}>Frequência</Text>
                      <Text style={styles.detailValue}>{selectedMedicine.frequencia}</Text>
                    </View>
                  </View>
                )}

                {selectedMedicine.observacoes && (
                  <View style={styles.detailRow}>
                    <View style={styles.detailIconContainer}>
                      <Ionicons name="document-text" size={20} color="#2196F3" />
                    </View>
                    <View style={styles.detailContent}>
                      <Text style={styles.detailLabel}>Observações</Text>
                      <Text style={styles.detailValue}>{selectedMedicine.observacoes}</Text>
                    </View>
                  </View>
                )}
              </ScrollView>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.toggleModalButton, selectedMedicine.tomado && styles.toggleModalButtonTaken]}
                  onPress={() => {
                    toggleMedicineTaken(selectedMedicine.id, selectedMedicine.tomado);
                    closeModal();
                  }}
                >
                  <Ionicons
                    name={selectedMedicine.tomado ? "close-circle" : "checkmark-circle"}
                    size={20}
                    color="#FFFFFF"
                  />
                  <Text style={styles.toggleModalButtonText}>
                    {selectedMedicine.tomado ? "Desmarcar" : "Marcar como Tomado"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.deleteButton} onPress={() => deleteMedicine(selectedMedicine.id)}>
                  <Ionicons name="trash" size={20} color="#FFFFFF" />
                  <Text style={styles.deleteButtonText}>Excluir</Text>
                </TouchableOpacity>
              </View>
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
    backgroundColor: '#F5F7FA',
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  noMedicinesText: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1565C0',
    marginTop: 20,
    marginBottom: 10,
  },
  noMedicinesSubtext: {
    textAlign: 'center',
    fontSize: 16,
    color: '#757575',
    lineHeight: 22,
  },
  listContainer: {
    paddingBottom: 20,
  },
  medicineItemContainer: {
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  medicineItem: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginRight: 10,
    shadowColor: '#2196F3',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E3F2FD',
  },
  medicineItemTaken: {
    backgroundColor: '#F1F8E9',
    borderColor: '#C8E6C9',
    shadowColor: '#4CAF50',
  },
  medicineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  medicineName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1565C0',
    marginLeft: 8,
    flex: 1,
  },
  medicineNameTaken: {
    color: '#2E7D32',
  },
  takenBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  takenText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: 'bold',
    marginLeft: 4,
  },
  medicineDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  medicineInfo: {
    fontSize: 14,
    color: '#424242',
    marginLeft: 6,
  },
  frequencyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  medicineFrequency: {
    fontSize: 12,
    color: '#757575',
    marginLeft: 4,
  },
  lastTakenContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E8F5E8',
  },
  lastTakenText: {
    fontSize: 11,
    color: '#4CAF50',
    marginLeft: 4,
    fontStyle: 'italic',
  },
  toggleButton: {
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2196F3',
  },
  toggleButtonTaken: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  toggleButtonText: {
    fontSize: 12,
    color: '#2196F3',
    fontWeight: 'bold',
    marginLeft: 4,
  },
  toggleButtonTextTaken: {
    color: '#FFFFFF',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#2196F3',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E3F2FD',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1565C0',
    flex: 1,
    marginLeft: 10,
  },
  closeButton: {
    padding: 4,
  },
  modalScroll: {
    padding: 20,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    backgroundColor: '#F8FAFE',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#2196F3',
  },
  detailRowTaken: {
    backgroundColor: '#F1F8E9',
    borderLeftColor: '#4CAF50',
  },
  detailIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#1976D2',
    fontWeight: 'bold',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detailValue: {
    fontSize: 16,
    color: '#263238',
    lineHeight: 22,
  },
  detailValueTaken: {
    color: '#2E7D32',
    fontWeight: 'bold',
  },
  lastTakenDetail: {
    fontSize: 12,
    color: '#4CAF50',
    marginTop: 4,
    fontStyle: 'italic',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E3F2FD',
  },
  toggleModalButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
    shadowColor: '#4CAF50',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  toggleModalButtonTaken: {
    backgroundColor: '#FF9800',
    shadowColor: '#FF9800',
  },
  toggleModalButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  deleteButton: {
    backgroundColor: '#F44336',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 0.6,
    shadowColor: '#F44336',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});
  