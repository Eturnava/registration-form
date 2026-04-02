import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AdminUser, RegularUser } from '../../types';


interface UsersState {
  admins: AdminUser[];
  users: RegularUser[];
}

const initialState: UsersState = {
  admins: [],
  users: [],
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    addAdmin(state, action: PayloadAction<AdminUser>) {
      state.admins.push(action.payload);
    },
    addUser(state, action: PayloadAction<RegularUser>) {
      state.users.push(action.payload);
    },
    updateUser(state, action: PayloadAction<RegularUser>) {
      const index = state.users.findIndex((u) => u.id === action.payload.id);
      if (index !== -1) {
        state.users[index] = action.payload;
      }
    },
    deleteUser(state, action: PayloadAction<string>) {
      state.users = state.users.filter((u) => u.id !== action.payload);
    },
    updateAdmin(state, action: PayloadAction<AdminUser>) {
      const index = state.admins.findIndex((a) => a.id === action.payload.id);
      if (index !== -1) {
        state.admins[index] = action.payload;
      }
    },
  },
});

export const { addAdmin, addUser, updateUser, deleteUser, updateAdmin } = usersSlice.actions;
export default usersSlice.reducer;
