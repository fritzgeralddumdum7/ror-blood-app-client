import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthProvider';
import './styles/global.css';
import Cookies from 'js-cookie';
import { useNavigate, useLocation } from 'react-router-dom';
import { LoadingOverlay } from '@mantine/core';

import AdminOrganizations from '@/pages/admin/Organizations';
import AdminPatients from '@/pages/admin/Patients';
import AdminDonors from '@/pages/admin/Donors';
import AdminCases from '@/pages/admin/Cases';

import DonorsRequests from '@/pages/donors/Requests';
import DonorsAppointments from '@/pages/donors/Appointments';
import DonorsDashboard from '@/pages/donors/Dashboard';

import OrgsRequests from '@/pages/orgs/Requests';
import OrgsAppointments from '@/pages/orgs/Appointments';
import OrgsPatients from '@/pages/orgs/Patients';
import OrgsDonors from '@/pages/orgs/Donors';
import OrgsDashboard from '@/pages/orgs/Dashboard';
import OrgsRequestAppointments from '@/pages/orgs/RequestAppointments';

import Dashboard from '@/pages/Dashboard';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import ResetPassword from '@/pages/ResetPassword';
import SignUp from '@/pages/SignUp';
import RequireAuth from '@/contexts/RequireAuth';
import { useDispatch, useSelector } from 'react-redux';

import { fetchBloodTypes } from '@/redux/bloodTypes';
import { fetchProvinces } from '@/redux/provinces';
import { fetchOrgTypes, fetchOrgs } from '@/redux/orgs';
import API from '@/api/base';

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { authUser } = useSelector(state => state.users);
  const [auth, setAuth] = useState(null);

  const redirectPath = location.pathname || '/';

  const UNAUTH_ROUTES = [
    '/login',
    '/sign-up',
    '/reset-password'
  ];

  useEffect(() => {
    const auth = Cookies.get('avion_access_token');
    if (auth && !UNAUTH_ROUTES.includes(redirectPath)) {
      setAuth(true);
    } else {
      if (UNAUTH_ROUTES.includes(redirectPath)) {
        return navigate(redirectPath, { replace: true });
      }
      navigate('/login', { replace: true });
    }
  }, []);

  useEffect(() => {
    setIsMounted(true);
    if (isMounted) {
      dispatch(fetchBloodTypes());
      dispatch(fetchProvinces());
      dispatch(fetchOrgTypes());
      dispatch(fetchOrgs());
    }
  }, [isMounted]);

  useEffect(() => {
    if (authUser && auth) {
      const redirectPath = location.pathname || '/organizations';
      if (authUser?.role === 4 && redirectPath !== '/' && !UNAUTH_ROUTES.includes(redirectPath)) {
        return navigate(redirectPath, { replace: true });
      } else {
        const auth = Cookies.get('avion_access_token');
        if (auth && authUser?.role !== 4 && redirectPath === '/login') {
          return navigate('/', { replace: true });
        } else {
          if (authUser?.role !== 4 && redirectPath !== '/organizations') {
            return navigate(redirectPath, { replace: true });
          } else {
            return navigate('/organizations', { replace: true });
          }
        }
      }
    }
  }, [auth, authUser])

  let pendingRequests = 0;

  API.interceptors.request.use(request => {
    pendingRequests++;
    return request;
  }, null, { synchronous: true });

  API.interceptors.response.use(response => {
    pendingRequests--;

    if (pendingRequests <= 0) {
      setIsLoading(false);
    }
    return response;
  });

  return (
    <AuthProvider>
      {
        isLoading ? <LoadingOverlay visible={isLoading} /> :

          <Routes>
            <Route path="/login" exact element={<Login />} />
            <Route path="/home" exact element={<Home />} />
            <Route path="/reset-password" exact element={<ResetPassword />} />
            <Route path="/sign-up" exact element={<SignUp />} />
            {
              authUser?.role === 1 ? // donor
                <>
                  <Route
                    path="/requests"
                    exact
                    element={(
                      <RequireAuth>
                        <DonorsRequests />
                      </RequireAuth>
                    )}
                  />
                  <Route
                    path="/appointments"
                    exact
                    element={(
                      <RequireAuth>
                        <DonorsAppointments />
                      </RequireAuth>
                    )}
                  />
                  <Route
                    path="/"
                    exact
                    element={(
                      <RequireAuth>
                        <DonorsDashboard />
                      </RequireAuth>
                    )}
                  />

                  <Route
                    path="*"
                    element={(
                      <RequireAuth />
                    )}
                  />
                </> :
                authUser?.role === 2 ? // org member
                  <>
                    <Route
                      path="/requests"
                      exact
                      element={(
                        <RequireAuth>
                          <OrgsRequests />
                        </RequireAuth>
                      )}
                    />
                    <Route
                      path="/appointments"
                      exact
                      element={(
                        <RequireAuth>
                          <OrgsAppointments />
                        </RequireAuth>
                      )}
                    />
                    <Route
                      path="/patients"
                      exact
                      element={(
                        <RequireAuth>
                          <OrgsPatients />
                        </RequireAuth>
                      )}
                    />
                    <Route
                      path="/donors"
                      exact
                      element={(
                        <RequireAuth>
                          <OrgsDonors />
                        </RequireAuth>
                      )}
                    />
                     <Route
                      path="/requestappointments/:blood_request_id"
                      exact
                      element={(
                        <RequireAuth>
                          <OrgsRequestAppointments />
                        </RequireAuth>
                      )}
                    />
                    <Route
                      path="/"
                      exact
                      element={(
                        <RequireAuth>
                          <OrgsDashboard />
                        </RequireAuth>
                      )}
                    />
                  </>
                  : // admin
                  <>
                    <Route
                      path="/patients"
                      exact
                      element={(
                        <RequireAuth>
                          <AdminPatients />
                        </RequireAuth>
                      )}
                    />
                    <Route
                      path="/donors"
                      exact
                      element={(
                        <RequireAuth>
                          <AdminDonors />
                        </RequireAuth>
                      )}
                    />
                    <Route
                      path="/organizations"
                      exact
                      element={(
                        <RequireAuth>
                          <AdminOrganizations />
                        </RequireAuth>
                      )}
                    />
                    <Route
                      path="/cases"
                      exact
                      element={(
                        <RequireAuth>
                          <AdminCases />
                        </RequireAuth>
                      )}
                    />
                  </>
            }
          </Routes>
      }
    </AuthProvider>
  );
}

export default App;
