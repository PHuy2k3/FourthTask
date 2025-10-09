import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function AdminRoute({ children }) {
  const { token, profile } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  if (profile?.role !== 'Admin') return <Navigate to="/showtimes" replace />;
  return children;
}
