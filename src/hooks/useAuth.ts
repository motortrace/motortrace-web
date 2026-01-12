import { useState, useEffect } from 'react';

interface User {
  id: number;
  email: string;
  name: string;
  phone: string | null;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: localStorage.getItem('token'),
    loading: true,
    isAuthenticated: false
  });

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setAuthState(prev => ({
          ...prev,
          loading: false,
          isAuthenticated: false
        }));
        return;
      }

      try {
        // Verify token with backend
        const response = await fetch('http://localhost:3000/auth/verify', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setAuthState({
            user: data.user,
            token,
            loading: false,
            isAuthenticated: true
          });
        } else {
          // Token invalid, clear it
          localStorage.removeItem('token');
          setAuthState({
            user: null,
            token: null,
            loading: false,
            isAuthenticated: false
          });
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('token');
        setAuthState({
          user: null,
          token: null,
          loading: false,
          isAuthenticated: false
        });
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        setAuthState({
          user: data.user,
          token: data.token,
          loading: false,
          isAuthenticated: true
        });
        return { success: true, data };
      } else {
        throw new Error(data.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuthState({
      user: null,
      token: null,
      loading: false,
      isAuthenticated: false
    });
  };

  const updateUser = (userData: Partial<User>) => {
    setAuthState(prev => ({
      ...prev,
      user: prev.user ? { ...prev.user, ...userData } : null
    }));
  };

  return {
    ...authState,
    login,
    logout,
    updateUser
  };
}; 