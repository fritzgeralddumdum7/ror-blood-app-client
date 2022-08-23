import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { User } from '@/services';

export const fetchUserProfile = createAsyncThunk('users/fetchUserProfile',
  async () => {
    const response = await User.profile();
    const { role } = response.data.data;
    const { organization, city_municipality, blood_type } = response.data;
    let result = response.data.data;

    if (role === 1 || role === 3) {
      result = {
        ...response.data.data,
        blood_type
      }
    }

    if (role === 2) {
      result = {
        ...response.data.data,
        organization,
        city_municipality
      }
    }

    return result;
  }
)

export const fetchTally = createAsyncThunk('users/fetchTally',
  async () => {
    const response = await User.tally();

    return response.data.data;
  }
)

export const usersSlice = createSlice({
  name: 'users',
  initialState: {
    authUser: null,
    isFetching: false,
    tally: {}
  },
  reducers: {
    resetAuthUser: state => {
      state.authUser = null;
    },
    setIsFetching: (state, payload) => {
      state.authUser = payload;
    }
  },
  extraReducers: {
    [fetchUserProfile.fulfilled]: (state, action) => {
      state.authUser = action.payload;
    },
    [fetchTally.fulfilled]: (state, action) => {
      state.tally = action.payload;
    }
  }
})

export const {
  resetAuthUser,
  setIsFetching
} = usersSlice.actions;

export default usersSlice.reducer;
