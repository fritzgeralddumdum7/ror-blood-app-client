import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import Cookies from 'js-cookie';
import { useSelector } from 'react-redux';


const RequireAuth = ({ children }) => {
    const { authUser } = useSelector(state => state.users);
    const location = useLocation();
    const auth = useAuth();
    const user = Cookies.get('avion_access_token');

    if (!auth.isAuth && !authUser) {
        return <Navigate to='/login' state={{ path: location.pathname }} />
    }

    return children;
}

export default RequireAuth;
