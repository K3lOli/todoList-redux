import { configureStore } from '@reduxjs/toolkit';
import todoReducer from './reducers/todoReducer';
import toggleReducer from './reducers/toggleReducer';

export const store = configureStore({
  reducer: {
    todos: todoReducer,
    toggle: toggleReducer,
  },
});