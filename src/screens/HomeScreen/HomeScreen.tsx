import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { FAB, Card, Title, Paragraph, Appbar, Text, Dialog, Portal, Button, TextInput, IconButton } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { deleteTask, readTasks, updateTask } from '../../services/tasks';
import { Task } from '../../types/types';

const HomeScreen = ({ navigation }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [visible, setVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const fetchData = async () => {
    try {
      const tasksData = await readTasks();
      setTasks(tasksData as Task[]);
    } catch (error) {
      console.error('Erro ao buscar tarefas:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
  );

  const handleDeleteTask = async (taskId: number) => {
    try {
      await deleteTask(taskId);
      fetchData();
    } catch (error) {
      console.error('Erro ao excluir tarefa:', error);
    }
  };

  const handleCardPress = (task: Task) => {
    setSelectedTask(task);
    setVisible(true);
  };

  const handleSaveTask = async () => {
    if (selectedTask) {
      try {
        await updateTask(selectedTask.id, selectedTask.title, selectedTask.description, selectedTask.categoryColor);
        fetchData();
        setVisible(false);
      } catch (error) {
        console.error('Erro ao atualizar tarefa:', error);
      }
    }
  };

  const hideDialog = () => setVisible(false);

  const handleChange = (name: string, value: string) => {
    if (selectedTask) {
      setSelectedTask({ ...selectedTask, [name]: value });
    }
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Tarefas</Text>
          <FAB
            small
            icon="plus"
            onPress={() => navigation.navigate('CreateTask')}
            style={styles.fab}
          />
        </View>
      </Appbar.Header>
      <ScrollView>
        {tasks.map(task => (
          <TouchableOpacity key={task.id} onPress={() => handleCardPress(task)}>
            <Card style={[styles.card, { backgroundColor: task.categoryColor }]}>
              <Card.Content>
                <Title>{task.title}</Title>
                <Paragraph>{task.description}</Paragraph>
              </Card.Content>
              <Card.Actions>
                <IconButton
                  icon="delete"
                  onPress={() => handleDeleteTask(task.id)}
                  style={styles.actionButton}
                />
              </Card.Actions>
            </Card>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>Editar Tarefa</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Title"
              value={selectedTask ? selectedTask.title : ''}
              onChangeText={(text) => handleChange('title', text)}
              style={styles.input}
            />
            <TextInput
              label="Description"
              value={selectedTask ? selectedTask.description : ''}
              onChangeText={(text) => handleChange('description', text)}
              style={styles.input}
            />
            <View style={styles.colorButtonContainer}>
              <IconButton
                icon="circle"
                iconColor="green"
                size={30}
                onPress={() => handleChange('categoryColor', 'green')}
                style={[
                  styles.colorButton,
                  selectedTask && selectedTask.categoryColor === 'green' && styles.selectedColorButton
                ]}
              />
              <IconButton
                icon="circle"
                iconColor="orange"
                size={30}
                onPress={() => handleChange('categoryColor', 'orange')}
                style={[
                  styles.colorButton,
                  selectedTask && selectedTask.categoryColor === 'orange' && styles.selectedColorButton
                ]}
              />
              <IconButton
                icon="circle"
                iconColor="red"
                size={30}
                onPress={() => handleChange('categoryColor', 'red')}
                style={[
                  styles.colorButton,
                  selectedTask && selectedTask.categoryColor === 'red' && styles.selectedColorButton
                ]}
              />
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Cancelar</Button>
            <Button onPress={handleSaveTask}>Salvar</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  card: {
    marginVertical: 10,
    borderWidth: 1, // Adiciona a largura da borda
    borderColor: 'gray', // Adiciona a cor da borda
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    right: 0,
    top: -15,
  },
  actionButton: {
    marginRight: 16,
  },
  input: {
    marginBottom: 10,
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
});

export default HomeScreen;
