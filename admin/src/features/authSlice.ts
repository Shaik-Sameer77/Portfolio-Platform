import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  user: {
    email: string;
    name: string;
    role: string;
  } | null;
}

const initialState: AuthState = {
  token: null,
  isAuthenticated: !!localStorage.getItem('admin_logged_in'),
  user: localStorage.getItem('admin_user') ? JSON.parse(localStorage.getItem('admin_user')!) : null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<{ token?: string; user: any }>) => {
      state.token = action.payload.token || null;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      localStorage.setItem('admin_logged_in', 'true');
      localStorage.setItem('admin_user', JSON.stringify(action.payload.user));
      if (action.payload.token) {
        localStorage.setItem('admin_token', action.payload.token);
      }
    },
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem('admin_logged_in');
      localStorage.removeItem('admin_user');
      localStorage.removeItem('admin_token');
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
