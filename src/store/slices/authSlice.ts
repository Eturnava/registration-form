import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AppUser } from '../../types';

interface AuthState {
  currentUser: AppUser | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  currentUser: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action: PayloadAction<AppUser>) {
      state.currentUser = action.payload;
      state.isAuthenticated = true;
    },
    logout(state) {
      state.currentUser = null;
      state.isAuthenticated = false;
    },
    updateCurrentUser(state, action: PayloadAction<Partial<AppUser>>) {
      if (state.currentUser) {
        state.currentUser = { ...state.currentUser, ...action.payload } as AppUser;
      }
    },
  },
});

export const { login, logout, updateCurrentUser } = authSlice.actions;
export default authSlice.reducer;
