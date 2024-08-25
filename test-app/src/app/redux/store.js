// store.js
import { configureStore, createSlice } from '@reduxjs/toolkit';

// Define a slice (a reducer and actions in one)
const counterSlice = createSlice({
  name: 'counter',
  initialState: { count: 0 },
  reducers: {
    increment: (state) => {
      state.count += 1; // Immer makes state mutations safe here
    },
  },
});

// Export the action to use in components
export const { increment } = counterSlice.actions;

// Configure the store with the slice reducer
const store = configureStore({
  reducer: {
    counter: counterSlice.reducer,
  },
});

export default store;