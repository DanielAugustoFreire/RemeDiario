import React, { useState } from "react";
import { View, TextInput, Text, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { db } from '../config/config';
import { ref, push } from "firebase/database";

export default function FormItem() {
  const [item, setItem] = useState("");
  const [descricao, setDescricao] = useState("");

  const salvaItem = () => {
    const ItensRef = ref(db, "/Itens");

    if (item === "" || descricao === "") {
      Alert.alert("Erro", "Digite o item e a descrição");
      return;
    }

    push(ItensRef, {
      item: item,
      descricao: descricao,
    })
      .then(() => {
        console.log("Item salvo com sucesso!");
        setItem("");
        setDescricao("");
      })
      .catch((error) => {
        console.error("Erro ao salvar o item: ", error);
      });
  };

  return (
    <View style={styles.formItem}>
      <TextInput
        style={styles.inputItem}
        placeholder="Digite o item"
        placeholderTextColor="#888"
        value={item}
        onChangeText={(text) => setItem(text)}
      />
      <TextInput
        style={styles.inputItem}
        placeholder="Digite a descrição"
        placeholderTextColor="#888"
        value={descricao}
        onChangeText={(text) => setDescricao(text)}
      />
      <TouchableOpacity style={styles.button} onPress={salvaItem}>
        <Text style={styles.buttonText}>Salvar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  formItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212", // Fundo escuro
    padding: 20,
  },
  inputItem: {
    height: 40,
    borderColor: "#555", // Borda mais escura
    borderWidth: 1,
    borderRadius: 5,
    width: "80%",
    marginBottom: 20,
    paddingLeft: 10,
    fontSize: 16,
    color: "#fff", // Texto claro
    backgroundColor: "#1e1e1e", // Fundo do input escuro
  },
  button: {
    backgroundColor: "#bb86fc", // Roxo do tema dark
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
