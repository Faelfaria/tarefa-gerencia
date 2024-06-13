import { setupDatabase } from "./database";
import * as SQLite from 'expo-sqlite';

// Chamada assíncrona para configurar o banco de dados e criar a tabela de tarefas
setupDatabase()
  .then(() => {
    console.log('Banco de dados configurado com sucesso');
  })
  .catch(error => {
    console.error('Erro ao configurar o banco de dados:', error);
  });

// Função para inserir uma nova tarefa
export const createTask = async (title, description, categoryColor) => {
  try {
    const db = await SQLite.openDatabaseAsync('tasks.db');
    const result = await db.runAsync(
      'INSERT INTO tasks (title, description, categoryColor) VALUES (?, ?, ?)',
      title,
      description,
      categoryColor
    );
    return result.lastInsertRowId;
  } catch (error) {
    console.error('Erro ao inserir tarefa:', error);
    throw error;
  }
};

// Função para atualizar uma tarefa existente
export const updateTask = async (id: number, title: string, description: string, categoryColor: string) => {
  try {
    const db = await SQLite.openDatabaseAsync('tasks.db');
    await db.runAsync(
      'UPDATE tasks SET title = ?, description = ?, categoryColor = ? WHERE id = ?',
      title,
      description,
      categoryColor,
      id
    );
  } catch (error) {
    console.error('Erro ao atualizar tarefa:', error);
    throw error;
  }
};

// Função para excluir uma tarefa
export const deleteTask = async (id: number) => {
  try {
    const db = await SQLite.openDatabaseAsync('tasks.db');
    await db.runAsync('DELETE FROM tasks WHERE id = ?', id);
  } catch (error) {
    console.error('Erro ao excluir tarefa:', error);
    throw error;
  }
};

// Função para obter todas as tarefas
export const readTasks = async () => {
  try {
    const db = await SQLite.openDatabaseAsync('tasks.db');
    const tasks = await db.getAllAsync('SELECT * FROM tasks');
    return tasks;
  } catch (error) {
    console.error('Erro ao obter todas as tarefas:', error);
    throw error;
  }
};

// Função para obter uma tarefa pelo ID
export const getTaskById = async (id: number) => {
  try {
    const db = await SQLite.openDatabaseAsync('tasks.db');
    const task = await db.getFirstAsync('SELECT * FROM tasks WHERE id = ?', id);
    return task;
  } catch (error) {
    console.error('Erro ao obter tarefa pelo ID:', error);
    throw error;
  }
};