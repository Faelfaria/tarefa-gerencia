import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { TextInput, Button, IconButton } from 'react-native-paper';
import { createTask } from '../../services/tasks';

const CreateScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryColor, setCategoryColor] = useState('green'); // Define a cor padrão como verde

  // Função para salvar uma nova tarefa
  const handleSave = async () => {
    try {
      await createTask(title, description, categoryColor);
      navigation.goBack();
    } catch (error) {
      console.error('Erro ao criar tarefa', error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        label="Título"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      <TextInput
        label="Descrição"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
      />
      <Text style={styles.colorLabel}>Escolha a cor da categoria:</Text>
      <View style={styles.colorButtonContainer}>
        <IconButton
          icon="circle"
          iconColor="green"
          size={30}
          onPress={() => setCategoryColor('green')}
          style={[
            styles.colorButton,
            categoryColor === 'green' && styles.selectedColorButton
          ]}
        />
        <IconButton
          icon="circle"
          iconColor="orange"
          size={30}
          onPress={() => setCategoryColor('orange')}
          style={[
            styles.colorButton,
            categoryColor === 'orange' && styles.selectedColorButton
          ]}
        />
        <IconButton
          icon="circle"
          iconColor="red"
          size={30}
          onPress={() => setCategoryColor('red')}
          style={[
            styles.colorButton,
            categoryColor === 'red' && styles.selectedColorButton
          ]}
        />
      </View>
      <Button mode="contained" onPress={handleSave}>
        Salvar
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  input: {
    marginBottom: 10,
  },
  colorLabel: {
    marginTop: 20,
    marginBottom: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  colorButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  colorButton: {
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedColorButton: {
    borderWidth: 2,
    borderColor: 'black',
  },
});

export default CreateScreen;
