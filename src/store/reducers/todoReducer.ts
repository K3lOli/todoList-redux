// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
// import { getDatabase, ref, set, update, remove } from 'firebase/database';

export interface Todo {
  id: number;
  text: string | null;
  completed: boolean;
}

const initialState: Todo[] = [];

// export const adictionTodo = createAsyncThunk('todos/addTodo', async (text:string|null, { dispatch }) => {
//   const db = getDatabase();
//   const todosRef = ref(db, 'todos');

//   const newTodo = {
//     text,
//     completed: false,
//   };

//   try {
//     await set(todosRef, newTodo);
//     return newTodo;
//   } catch (error) {
//     console.error('Erro ao adicionar tarefa:', error);
//     throw error;
//   }
// });

// // Ação assíncrona para atualizar uma tarefa
// export const updateTodo = createAsyncThunk<{ id: number, completed: boolean }, { id: number, completed: boolean }>('todos/updateTodo', async ({ id, completed }, { dispatch }) => {
//   const db = getDatabase();
//   const todoRef = ref(db, `todos/${id}`);

//   try {
//     await update(todoRef, { completed });
//     return { id, completed };
//   } catch (error) {
//     console.error('Erro ao atualizar tarefa:', error);
//     throw error;
//   }
// });

// // Ação assíncrona para excluir uma tarefa
// export const removeTodo = createAsyncThunk('todos/deleteTodo', async (id: number, { dispatch }) => {
//   const db = getDatabase();
//   const todoRef = ref(db, `todos/${id}`);

//   try {
//     await remove(todoRef);
//     return id;
//   } catch (error) {
//     console.error('Erro ao excluir tarefa:', error);
//     throw error;
//   }
// });

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (state, action) => {
      state.push({
        id: Date.now(),
        text: action.payload,
        completed: false,
      });
      console.log(state.length)
    },
    toggleTodo: (state, action) => {
      const todo = state.find((t) => t.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
    deleteTodo: (state, action) => {
      const index = state.findIndex((t) => t.id === action.payload);
      if (index !== -1) {
        state.splice(index, 1);
        console.log(state)
      }
    },
  },
  // extraReducers: (builder) => {
  //   builder
  //     .addCase(adictionTodo.fulfilled, (state, action) => {
  //       state.push({ id: Date.now(), ...action.payload });
  //     })
  //     .addCase(updateTodo.fulfilled, (state, action) => {
  //       const { id, completed } = action.payload;
  //       const todo = state.find((t) => t.id === id);
  //       if (todo) {
  //         todo.completed = completed;
  //       }
  //     })
  //     .addCase(removeTodo.fulfilled, (state, action) => {
  //       const id = action.payload;
  //       return state.filter((todo) => todo.id !== id);
  //     });
  // },
});

export const { addTodo, toggleTodo, deleteTodo } = todoSlice.actions;
export default todoSlice.reducer;