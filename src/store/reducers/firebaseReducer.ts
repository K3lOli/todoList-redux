// authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null, // O usuário autenticado
  loading: false, // Indica se a autenticação está em andamento
  error: null, // Possíveis erros de autenticação
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    authSuccess: (state, action) => {
      state.user = action.payload;
      state.loading = false;
      state.error = null;
    },
    authFailure: (state, action) => {
      state.user = null;
      state.loading = false;
      state.error = action.payload;
    },
    authLogout: (state) => {
      state.user = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const { authLoading, authSuccess, authFailure, authLogout } = authSlice.actions;
export default authSlice.reducer;
