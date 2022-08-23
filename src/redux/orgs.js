import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { OrganizationType, Organization } from '@/services';
import { formatAsSelectData } from '@/helpers';

export const fetchOrgTypes = createAsyncThunk('orgs/fetchOrgTypes',
  async () => {
    const response = await OrganizationType.getOrganizationTypes();

    return response.data.data;
  }
)

export const fetchOrgs = createAsyncThunk('orgs/fetchOrgs',
  async () => {
    const response = await Organization.getOrganizations();

    return response.data.data;
  }
)

export const orgsSlice = createSlice({
  name: 'orgs',
  initialState: {
    orgs: [],
    orgTypes: []
  },
  extraReducers: {
    [fetchOrgTypes.fulfilled]: (state, action) => {
      state.orgTypes = formatAsSelectData(action.payload, 'name');
    },
    [fetchOrgs.fulfilled]: (state, action) => {
      state.orgs = formatAsSelectData(action.payload, 'name');
    }
  }
})

export default orgsSlice.reducer;
