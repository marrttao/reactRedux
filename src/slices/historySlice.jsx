import { createSlice } from '@reduxjs/toolkit';

const historySlice = createSlice({
  name: 'history',
  initialState: {
    items: [],
  },
  reducers: {
    pushConversion(state, action) {
      state.items.unshift(action.payload);
      if (state.items.length > 5) state.items.pop();
    },
    clearHistory(state) {
      state.items = [];
    }
  }
});

export const { pushConversion, clearHistory } = historySlice.actions;
export default historySlice.reducer;
