import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PERMISSIONS } from '../config/roles';

export const ProtectedRoute = ({ path }) => {
  const { user } = useAuth();


  if (!user) {
    return <Navigate to="/login" replace />;
  }


  const allowedRoles = PERMISSIONS[path];
  if (allowedRoles && !allowedRoles.includes(user.role)) {
  
    return <Navigate to="/dashboard" replace />;
  }

 
  return <Outlet />;
};