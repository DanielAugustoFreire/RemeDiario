import React, { useState } from "react";
import { View, TextInput, Text, TouchableOpacity, Alert, StyleSheet, ScrollView } from "react-native";
import { db } from '../config/config';
import { ref, push } from "firebase/database";
import { Ionicons } from '@expo/vector-icons';

export default function FormItem() {
  const [nome, setNome] = useState("");
  const [dosagem, setDosagem] = useState("");
  const [horario, setHorario] = useState("");
  const [frequencia, setFrequencia] = useState("");
  const [observacoes, setObservacoes] = useState("");

  const salvaRemedio = () => {
    const RemediosRef = ref(db, "/Remedios");

    if (nome === "" || dosagem === "" || horario === "") {
      Alert.alert("Erro", "Digite pelo menos o nome, dosagem e horário do remédio");
      return;
    }

    push(RemediosRef, {
      nome: nome,
      dosagem: dosagem,
      horario: horario,
      frequencia: frequencia,
      observacoes: observacoes,
      dataCriacao: new Date().toISOString(),
      tomado: false,
      ultimaVezTomado: null,
    })
      .then(() => {
        console.log("Remédio salvo com sucesso!");
        setNome("");
        setDosagem("");
        setHorario("");
        setFrequencia("");
        setObservacoes("");
        Alert.alert("Sucesso", "Remédio adicionado com sucesso!");
      })
      .catch((error) => {
        console.error("Erro ao salvar o remédio: ", error);
        Alert.alert("Erro", "Erro ao salvar o remédio");
      });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formItem}>
        <View style={styles.header}>
          <Ionicons name="medical" size={32} color="#2196F3" />
          <Text style={styles.title}>Adicionar Remédio</Text>
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="medical-outline" size={20} color="#2196F3" style={styles.inputIcon} />
          <TextInput
            style={styles.inputItem}
            placeholder="Nome do remédio"
            placeholderTextColor="#90A4AE"
            value={nome}
            onChangeText={(text) => setNome(text)}
            autoCapitalize="words"
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="flask-outline" size={20} color="#2196F3" style={styles.inputIcon} />
          <TextInput
            style={styles.inputItem}
            placeholder="Dosagem (ex: 500mg, 1 comprimido)"
            placeholderTextColor="#90A4AE"
            value={dosagem}
            onChangeText={(text) => setDosagem(text)}
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="time-outline" size={20} color="#2196F3" style={styles.inputIcon} />
          <TextInput
            style={styles.inputItem}
            placeholder="Horário (ex: 08:00, 14:00, 20:00)"
            placeholderTextColor="#90A4AE"
            value={horario}
            onChangeText={(text) => setHorario(text)}
            keyboardType="default"
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="repeat-outline" size={20} color="#2196F3" style={styles.inputIcon} />
          <TextInput
            style={styles.inputItem}
            placeholder="Frequência (ex: 3x ao dia, 1x por semana)"
            placeholderTextColor="#90A4AE"
            value={frequencia}
            onChangeText={(text) => setFrequencia(text)}
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="document-text-outline" size={20} color="#2196F3" style={styles.inputIcon} />
          <TextInput
            style={[styles.inputItem, styles.textArea]}
            placeholder="Observações (opcional)"
            placeholderTextColor="#90A4AE"
            value={observacoes}
            onChangeText={(text) => setObservacoes(text)}
            multiline={true}
            numberOfLines={3}
            textAlignVertical="top"
            autoCapitalize="sentences"
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={salvaRemedio}>
          <Ionicons name="checkmark-circle" size={24} color="#FFFFFF" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Salvar Remédio</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  formItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F7FA",
    padding: 20,
    paddingTop: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
    backgroundColor: "#FFFFFF",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    shadowColor: "#2196F3",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1565C0",
    marginLeft: 10,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 15,
    paddingHorizontal: 15,
    width: "100%",
    shadowColor: "#2196F3",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#E3F2FD",
  },
  inputIcon: {
    marginRight: 10,
  },
  inputItem: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: "#263238",
    paddingVertical: 15,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
    paddingTop: 15,
  },
  button: {
    backgroundColor: "#2196F3",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginTop: 30,
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    shadowColor: "#2196F3",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});
