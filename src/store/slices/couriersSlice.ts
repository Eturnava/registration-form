import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { CourierUser } from '../../types';

interface CouriersState {
  couriers: CourierUser[];
}

const initialState: CouriersState = {
  couriers: [],
};

const couriersSlice = createSlice({
  name: 'couriers',
  initialState,
  reducers: {
    addCourier(state, action: PayloadAction<CourierUser>) {
      state.couriers.push(action.payload);
    },
    updateCourier(state, action: PayloadAction<CourierUser>) {
      const index = state.couriers.findIndex((c) => c.id === action.payload.id);
      if (index !== -1) {
        state.couriers[index] = action.payload;
      }
    },
    deleteCourier(state, action: PayloadAction<string>) {
      state.couriers = state.couriers.filter((c) => c.id !== action.payload);
    },
  },
});

export const { addCourier, updateCourier, deleteCourier } = couriersSlice.actions;
export default couriersSlice.reducer;
