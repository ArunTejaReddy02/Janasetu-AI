import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-screen bg-background text-on-surface-variant">
        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium">Verifying authorization...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login page, preserving original location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role-based access control
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // If citizen tries to access admin portal, redirect to /resident
    if (user.role === 'CITIZEN') {
      return <Navigate to="/resident" replace />;
    }
    // If admin tries to access resident portal, redirect to admin dashboard
    return <Navigate to="/" replace />;
  }

  return children;
}
