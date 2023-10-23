// Importe as dependências necessárias
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ref, push, update, remove, get } from 'firebase/database';
import { db } from '../../services/firebase'; // Importe sua instância 'db' do serviço Firebase


// const userInfo = getUserInfo();

// Importe a interface 'Todo'
interface Todo {
  id: number;
  text: string | null;
  completed: boolean;
}

// Use o estado inicial 'initialState' com a interface 'Todo[]'
let initialState: Todo[] = [];
let usuario: string | null = null;
let taskFirebaseRefs: { [key: number]: string | null } = {};

// Crie um `createAsyncThunk` para buscar as tarefas do Firebase
export const fetchTasks = createAsyncThunk('todos/fetchTasks', async (user: string | null) => {
  const tasksRef = ref(db, `users/${user}/tasks`);
  usuario = user;
  console.log('tasksRef', tasksRef)
  const snapshot = await get(tasksRef);

  const tasks: Todo[] = [];
  snapshot.forEach((childSnapshot) => {
    const task: Todo = {
      id: childSnapshot.key,
      ...childSnapshot.val(),
    };
    taskFirebaseRefs[task.id] = childSnapshot.ref.key;
    console.log(childSnapshot.ref.key, childSnapshot.val());
    tasks.push(task);
  });
;
  initialState = tasks;
  console.log('taskFirebaseRefs', taskFirebaseRefs)
  console.log('initial state', initialState)
  // Retorne uma promessa que resolve com as tarefas (uma ação válida)
  return tasks;
});

console.log('initialState', initialState);



// Crie o slice Redux
const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (state, action) => {
      // Adicione a tarefa ao estado Redux
      const newTask: Todo = {
        id: Date.now(),
        text: action.payload || '',
        completed: false,
      };
      state.push(newTask);
  
      // Adicione a tarefa ao Firebase Realtime Database
      const tasksRef = ref(db, `users/${usuario}/tasks`);
      const newTaskRef = push(tasksRef, newTask);
  
      // Mapeie o ID da tarefa para a referência Firebase
      taskFirebaseRefs[newTask.id] = newTaskRef.key;
      console.log('taskFirebaseRefs', taskFirebaseRefs)
    },
    toggleTodo: (state, action) => {
      const taskId = action.payload;
  
      // Encontre a tarefa no estado Redux com base no ID
      const task = state.find((t) => t.id === taskId);
  
      if (task) {
        // Altere o valor de 'completed' no estado Redux
        task.completed = !task.completed;
  
        // Obtenha a referência Firebase associada a esta tarefa
        const taskFirebaseRefKey = taskFirebaseRefs[task.id];
        console.log('taskFirebaseRefKey', taskFirebaseRefKey)
        if (taskFirebaseRefKey) {
          const taskFirebaseRef = ref(db, `users/${usuario}/tasks/${taskFirebaseRefKey}`);
  
          // Atualize a tarefa no Firebase Realtime Database
          update(taskFirebaseRef, { completed: task.completed });
        }
      }
    },
   
    deleteTodo: (state, action) => {
      // Encontre o índice da tarefa no estado Redux e exclua-a
      const taskId = action.payload;
      const task = state.find((t) => t.id === taskId);
      const index = state.findIndex((t) => t.id === action.payload);
      if (index !== -1) {
        state.splice(index, 1);
        if(task) {
        const taskFirebaseRefKey = taskFirebaseRefs[task.id];
        // Exclua a tarefa do Firebase Realtime Database
        const taskRef = ref(db, `users/${usuario}/tasks/${taskFirebaseRefKey}`);
        remove(taskRef);
        }
      }
    },

    resetTodo: (state) => {
      // Limpe o estado Redux
      state.splice(0, state.length);
    }
  },
  extraReducers: (builder) => {
    // Lidar com o caso de sucesso do `fetchTasks`
    builder.addCase(fetchTasks.fulfilled, (_, action) => {
      return action.payload; // Atualize o estado com as tarefas buscadas
    });
  },
});

// Exporte as ações e o reducer
export const { addTodo, toggleTodo, deleteTodo, resetTodo} = todoSlice.actions;
export default todoSlice.reducer;