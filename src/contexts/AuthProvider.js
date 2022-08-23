import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useDispatch } from 'react-redux';
import { fetchUserProfile, resetAuthUser, fetchTally } from '@/redux/users';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const [isAuth, setIsAuth] = useState(null);

  const login = async (authorization) => {
    dispatch(fetchUserProfile());
    dispatch(fetchTally());
    setIsAuth(true);
    const token = authorization.split(' ')[1];
    Cookies.set('avion_access_token', token, { expires: 1 });
  };

  const logout = async () => {
    dispatch(resetAuthUser());
    Cookies.remove('avion_access_token');
  }

  useEffect(() => {
    const data = Cookies.get('avion_access_token');
    if (data) {
      setIsAuth(true);
    } else {
      dispatch(resetAuthUser());
      setIsAuth(false);
    }
  }, [])

  useEffect(() => {
    if (isAuth) {
      dispatch(fetchUserProfile());
      dispatch(fetchTally());
    }
  }, [isAuth])

  const stateValues = {
    login,
    logout,
    isAuth
  };

  return (
    <AuthContext.Provider value={stateValues}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
}
