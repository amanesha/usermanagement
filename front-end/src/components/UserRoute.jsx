import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const UserRoute = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role === 'admin' || user?.is_staff) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
};

export default UserRoute;
