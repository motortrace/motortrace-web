import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { fetchUserStatus } from '../utils/fetchUserStatus';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const [checking, setChecking] = useState(true);
  const [redirect, setRedirect] = useState<string | null>(null);

  useEffect(() => {
    const check = async () => {
      const status = await fetchUserStatus();
      console.log('ProtectedRoute check - status:', status);
      console.log('ProtectedRoute check - allowedRoles:', allowedRoles);
      
      if (!status) {
        console.log('ProtectedRoute: No status from API, trying localStorage fallback');
        // Fallback to localStorage if API fails
        try {
          const localUser = JSON.parse(localStorage.getItem('user') || '{}');
          console.log('ProtectedRoute: localStorage user:', localUser);
          
          if (localUser && localUser.role) {
            // Check role-based access with localStorage data
            if (allowedRoles && allowedRoles.length > 0) {
              if (!allowedRoles.includes(localUser.role)) {
                console.log('ProtectedRoute: localStorage user role not allowed:', localUser.role);
                // User's role doesn't match allowed roles, redirect to their own dashboard
                redirectByRole(localUser.role);
                setChecking(false);
                return;
              }
            }
            console.log('ProtectedRoute: Access granted via localStorage');
            setChecking(false);
            return;
          }
        } catch (e) {
          console.error('Error parsing localStorage user:', e);
        }
        
        console.log('ProtectedRoute: No valid auth data, redirecting to login');
        setRedirect('/login');
        setChecking(false);
        return;
      }

      // Check role-based access if roles are specified
      if (allowedRoles && allowedRoles.length > 0) {
        const user = status.user || status.data?.user || status;
        console.log('ProtectedRoute: User object:', user);
        console.log('ProtectedRoute: User role:', user?.role);
        console.log('ProtectedRoute: Allowed roles:', allowedRoles);
        console.log('ProtectedRoute: Role allowed?', user?.role && allowedRoles.includes(user.role));
        
        if (!user || !user.role || !allowedRoles.includes(user.role)) {
          console.log('ProtectedRoute: User not authorized, redirecting based on role');
          // User doesn't have required role, redirect to their appropriate dashboard
          redirectByRole(user?.role);
          setChecking(false);
          return;
        }
      }

      console.log('ProtectedRoute: Access granted');
      setChecking(false);
    };
    
    const redirectByRole = (role?: string) => {
      if (role === 'admin') {
        setRedirect('/admin/dashboard');
      } else if (role === 'manager') {
        setRedirect('/manager/dashboard');
      } else if (role === 'serviceadvisor' || role === 'service_advisor' || role === 'advisor') {
        setRedirect('/serviceadvisor/dashboard');
      } else {
        setRedirect('/login');
      }
    };
    
    check();
  }, [allowedRoles]);

  if (checking) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <div style={{
        width: 48,
        height: 48,
        border: '6px solid #e5e7eb',
        borderTop: '6px solid #6366f1',
        borderRadius: '50%',
        animation: 'spin-cogwheel 1s linear infinite',
        marginBottom: 12
      }} className="cogwheel-loader"></div>
      <style>{`
        @keyframes spin-cogwheel {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
  if (redirect) return <Navigate to={redirect} replace />;
  return <>{children}</>;
};

export default ProtectedRoute;