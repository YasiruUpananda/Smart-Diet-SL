// Client/src/features/diet/dietSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const generateDietPlan = createAsyncThunk(
  'diet/generate',
  async (payload, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth?.token || localStorage.getItem('token');
      const res = await api.post('/diet/plan', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          error.message || 
                          'Failed to generate diet plan';
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const fetchMyPlans = createAsyncThunk('diet/fetchMyPlans', async (_, thunkAPI) => {
  const token = thunkAPI.getState().auth?.token || localStorage.getItem('token');
  const res = await api.get('/diet/my-plans', { headers: { Authorization: `Bearer ${token}` }});
  return res.data;
});

const dietSlice = createSlice({
  name: 'diet',
  initialState: { loading: false, error: null, currentPlan: null, history: [] },
  reducers: { clearPlan(state){ state.currentPlan = null; state.error = null; } },
  extraReducers: builder => {
    builder
      .addCase(generateDietPlan.pending, s => { s.loading = true; s.error = null; })
      .addCase(generateDietPlan.fulfilled, (s, action) => { s.loading = false; s.currentPlan = action.payload; })
      .addCase(generateDietPlan.rejected, (s, action) => { 
        s.loading = false; 
        s.error = action.payload || action.error?.message || 'Failed to generate diet plan'; 
      })
      .addCase(fetchMyPlans.fulfilled, (s, action) => { s.history = action.payload; });
  }
});

export const { clearPlan } = dietSlice.actions;
export default dietSlice.reducer;
