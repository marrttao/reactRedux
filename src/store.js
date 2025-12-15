import { configureStore } from '@reduxjs/toolkit';
import currencyReducer from './slices/currencySlice';
import historyReducer from './slices/historySlice';

const store = configureStore({
  reducer: {
    currency: currencyReducer,
    history: historyReducer,
  },
});

export default store;
