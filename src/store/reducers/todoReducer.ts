// Importe as dependências necessárias
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ref, push, update, remove, get } from 'firebase/database';
import { db } from '../../services/firebase'; // Importe sua instância 'db' do serviço Firebase

// Importe a interface 'Todo'
interface Todo {
  id: number;
  text: string | null;
  completed: boolean;
}

// Use o estado inicial 'initialState' com a interface 'Todo[]'
const initialState: Todo[] = [];

// Crie um `createAsyncThunk` para buscar as tarefas do Firebase
export const fetchTasks = createAsyncThunk('todos/fetchTasks', async () => {
  const tasksRef = ref(db, 'tasks');
  const snapshot = await get(tasksRef);

  const tasks: Todo[] = [];
  snapshot.forEach((childSnapshot) => {
    const task: Todo = {
      id: childSnapshot.key,
      ...childSnapshot.val(),
    };
    tasks.push(task);
  });

  // Retorne uma promessa que resolve com as tarefas (uma ação válida)
  return tasks;
});

// Crie o slice Redux
const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (state, action) => {
      // Adicione a tarefa ao estado Redux
      const newTask: Todo = {
        id: Date.now(),
        text: action.payload,
        completed: false,
      };
      state.push(newTask);

      // Adicione a tarefa ao Firebase Realtime Database
      const tasksRef = ref(db, 'tasks');
      push(tasksRef, newTask);
    },
    toggleTodo: (state, action) => {
      // Encontre a tarefa no estado Redux e altere o valor de 'completed'
      const task = state.find((t) => t.id === action.payload);
      if (task) {
        task.completed = !task.completed;

        // Atualize a tarefa no Firebase Realtime Database
        const taskRef = ref(db, `tasks/${action.payload}`);
        update(taskRef, { completed: task.completed });
      }
    },
    deleteTodo: (state, action) => {
      // Encontre o índice da tarefa no estado Redux e exclua-a
      const index = state.findIndex((t) => t.id === action.payload);
      if (index !== -1) {
        state.splice(index, 1);

        // Exclua a tarefa do Firebase Realtime Database
        const taskRef = ref(db, `tasks/${action.payload}`);
        remove(taskRef);
      }
    },
  },
  extraReducers: (builder) => {
    // Lidar com o caso de sucesso do `fetchTasks`
    builder.addCase(fetchTasks.fulfilled, (_, action) => {
      return action.payload; // Atualize o estado com as tarefas buscadas
    });
  },
});

// Exporte as ações e o reducer
export const { addTodo, toggleTodo, deleteTodo } = todoSlice.actions;
export default todoSlice.reducer;