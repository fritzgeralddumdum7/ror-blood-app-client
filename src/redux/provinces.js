import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Province } from '@/services';
import { formatAsSelectData } from '@/helpers';

export const fetchProvinces = createAsyncThunk('provinces/fetchProvinces',
  async () => {
    const response = await Province.all();

    return response.data.data;
  }
)

export const provincesSlice = createSlice({
  name: 'provinces',
  initialState: {
    provinces: []
  },
  extraReducers: {
    [fetchProvinces.fulfilled]: (state, action) => {
      state.provinces = formatAsSelectData(action.payload, 'name');
    }
  }
})

export default provincesSlice.reducer;
