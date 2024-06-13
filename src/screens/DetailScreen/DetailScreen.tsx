import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Alert, Animated } from 'react-native';
import { TextInput, Button, IconButton } from 'react-native-paper';
import { readTasks, updateTask, deleteTask } from '../../services/tasks';
import { Task } from '../../types/types'; // Importe o tipo Task
import { LongPressGestureHandler, State } from 'react-native-gesture-handler';

const DetailScreen = ({ route, navigation }) => {
  const { id } = route.params;
  const [task, setTask] = useState<Task>({ id: 0, title: '', description: '', categoryColor: 'green' });
  const shakeAnimation = new Animated.Value(0);

  useEffect(() => {
    fetchTask();
  }, []);

  const fetchTask = async () => {
    try {
      const tasksData: Task[] = await readTasks(); // Defina o tipo de retorno como Task[]
      const task = tasksData.find(t => t.id === id);
      if (task) {
        setTask(task);
      }
    } catch (error) {
      console.error('Erro ao carregar tarefa', error);
    }
  };

  const handleUpdate = async () => {
    try {
      await updateTask(id, task.title, task.description, task.categoryColor);
      navigation.goBack();
    } catch (error) {
      console.error('Erro ao atualizar tarefa', error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTask(id);
      navigation.goBack();
    } catch (error) {
      console.error('Erro ao deletar tarefa', error);
    }
  };

  const setCategoryColor = (color: string) => {
    setTask({ ...task, categoryColor: color });
  };

  const startShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start(() => showDeleteAlert());
  };

  const showDeleteAlert = () => {
    Alert.alert(
      'Excluir Tarefa',
      'Você tem certeza que deseja excluir esta tarefa?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', onPress: handleDelete, style: 'destructive' },
      ]
    );
  };

  const handleLongPress = ({ nativeEvent }) => {
    if (nativeEvent.state === State.ACTIVE) {
      startShake();
    }
  };

  return (
    <LongPressGestureHandler onHandlerStateChange={handleLongPress} minDurationMs={800}>
      <Animated.View style={[styles.container, { transform: [{ translateX: shakeAnimation }] }]}>
        <TextInput
          label="Título"
          value={task.title}
          onChangeText={(text) => setTask({ ...task, title: text })}
          style={styles.input}
        />
        <TextInput
          label="Descrição"
          value={task.description}
          onChangeText={(text) => setTask({ ...task, description: text })}
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
              task.categoryColor === 'green' && styles.selectedColorButton
            ]}
          />
          <IconButton
            icon="circle"
            iconColor="orange"
            size={30}
            onPress={() => setCategoryColor('orange')}
            style={[
              styles.colorButton,
              task.categoryColor === 'orange' && styles.selectedColorButton
            ]}
          />
          <IconButton
            icon="circle"
            iconColor="red"
            size={30}
            onPress={() => setCategoryColor('red')}
            style={[
              styles.colorButton,
              task.categoryColor === 'red' && styles.selectedColorButton
            ]}
          />
        </View>
        <Button mode="contained" onPress={handleUpdate} style={styles.button}>
          Salvar
        </Button>
      </Animated.View>
    </LongPressGestureHandler>
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
    marginVertical: 20,
  },
  colorButton: {
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedColorButton: {
    borderWidth: 2,
    borderColor: 'black',
  },
  button: {
    marginTop: 10,
  },
});

export default DetailScreen;
