import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const RATES_API = 'https://api.exchangerate.host/latest?base=UAH';

export const fetchRates = createAsyncThunk('currency/fetchRates', async (_, { rejectWithValue }) => {
  try {
    const res = await fetch(RATES_API);
    if (!res.ok) throw new Error('Network response was not ok');
    const data = await res.json();
    return { rates: data.rates, date: data.date };
  } catch (err) {
    return rejectWithValue(err.message || 'Fetch failed');
  }
});

const currencySlice = createSlice({
  name: 'currency',
  initialState: {
    rates: {},
    lastUpdated: null,
    status: 'idle',
    error: null,
    selected: ['USD'],
  },
  reducers: {
    toggleCurrency(state, action) {
      const code = action.payload;
      if (state.selected.includes(code)) state.selected = state.selected.filter(c => c !== code);
      else state.selected.push(code);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRates.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchRates.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.rates = action.payload.rates;
        state.lastUpdated = action.payload.date || new Date().toISOString();
      })
      .addCase(fetchRates.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      });
  }
});

export const { toggleCurrency } = currencySlice.actions;
export default currencySlice.reducer;
