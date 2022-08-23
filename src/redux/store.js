import { configureStore } from '@reduxjs/toolkit';
import bloodTypesReducer from './bloodTypes';
import provincesReducer from './provinces';
import orgsReducer from './orgs';
import usersReducer from './users';

export default configureStore({
  reducer: {
    bloodTypes: bloodTypesReducer,
    provinces: provincesReducer,
    orgs: orgsReducer,
    users: usersReducer
  }
});
