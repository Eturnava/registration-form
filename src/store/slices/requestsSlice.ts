import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { CourierRequest } from '../../types';

interface RequestsState {
  requests: CourierRequest[];
}

const initialState: RequestsState = {
  requests: [],
};

const requestsSlice = createSlice({
  name: 'requests',
  initialState,
  reducers: {
    addRequest(state, action: PayloadAction<CourierRequest>) {
      state.requests.push(action.payload);
    },
    removeRequest(state, action: PayloadAction<string>) {
      state.requests = state.requests.filter((r) => r.id !== action.payload);
    },
    removeRequestsByUser(state, action: PayloadAction<string>) {
      state.requests = state.requests.filter((r) => r.userId !== action.payload);
    },
    removeRequestsByCourier(state, action: PayloadAction<string>) {
      state.requests = state.requests.filter((r) => r.courierId !== action.payload);
    },
  },
});

export const { addRequest, removeRequest, removeRequestsByUser, removeRequestsByCourier } =
  requestsSlice.actions;
export default requestsSlice.reducer;
