import PropTypes from 'prop-types';
import useAuth from '../hooks/useAuth';
import { Navigate, useLocation } from 'react-router-dom';
import LoadingSpinner from '../pages/common/LoadingSpinner';

const PrivetRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();
    
    if (loading) return <LoadingSpinner></LoadingSpinner>;

    if (user) return children;

    return <Navigate to='/login' state={location.pathname} replace={true}></Navigate>
};

PrivetRoute.propTypes = {
    children: PropTypes.node
}

export default PrivetRoute;