import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { BloodType } from '@/services';
import { formatAsSelectData } from '@/helpers';


export const fetchBloodTypes = createAsyncThunk('bloodTypes/fetchBloodTypes',
  async () => {
    const response = await BloodType.getBloodTypes();

    return response.data.data;
  }
)

export const bloodTypesSlice = createSlice({
  name: 'bloodTypes',
  initialState: {
    bloodTypes: []
  },
  extraReducers: {
    [fetchBloodTypes.fulfilled]: (state, action) => {
      state.bloodTypes = formatAsSelectData(action.payload, 'name');
    }
  }
})

export default bloodTypesSlice.reducer;
