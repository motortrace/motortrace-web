import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUserStatus } from '../../utils/fetchUserStatus';
import './LoginPage.scss';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    agreeToTerms: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkStatus = async () => {
      const status = await fetchUserStatus();
      console.log('LoginPage - Checking existing status:', status);
      if (status && status.user) {
        const user = status.user;
        const userRole = user.role;
        console.log('LoginPage - User already logged in with role:', userRole);

        if (userRole === 'admin') {
          console.log('LoginPage - Redirecting admin to /admin/dashboard');
          navigate('/admin/dashboard');
        } 
        else if (userRole === 'service_advisor') {
          console.log('LoginPage - Redirecting service_advisor to /serviceadvisor/dashboard');
          navigate('/serviceadvisor/dashboard');
        } 
        else if (userRole === 'manager') {
          console.log('LoginPage - Redirecting manager to /manager/dashboard');
          navigate('/manager/dashboard');
        }
        else {
          console.log('LoginPage - Unknown role, redirecting to /');
          navigate('/');
        }
      } else {
        console.log('LoginPage - No existing user, showing login form');
        setCheckingStatus(false);
      }
    };
    checkStatus();
  }, [navigate]);

  if (checkingStatus) return (
    <div className="login-page">
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        gap: '20px'
      }}>
        <div style={{
          width: 64,
          height: 64,
          border: '6px solid rgba(255, 255, 255, 0.2)',
          borderTop: '6px solid #ffffff',
          borderRadius: '50%',
          animation: 'spin-cogwheel 1s linear infinite',
        }}></div>
        <div style={{
          color: 'white',
          fontSize: '1.2rem',
          fontWeight: '600',
          textAlign: 'center',
          opacity: 0.9
        }}>
          Checking authentication...
        </div>
        <style>{`
          @keyframes spin-cogwheel {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Client-Type': 'web',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await res.json();
      console.log('LoginPage - Login response:', data);

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error(data.error === 'Invalid login credentials'
            ? 'Incorrect email or password. Please try again.'
            : 'Authentication failed. Please try again.');
        } 
        else if (res.status === 400) {
          throw new Error(data.error || 'Invalid request. Please check your input.');
        } 
        else if (res.status === 404) {
          throw new Error('User not found. Please check your email or sign up.');
        } 
        else {
          throw new Error(data.error || 'Login failed. Please try again.');
        }
      }

      if (!data.data || !data.data.user) {
        throw new Error('Invalid response from server. Please try again.');
      }

      console.log('LoginPage - Login successful, storing credentials');
      console.log('LoginPage - User data:', data.data.user);

      // Store the access token
      if (data.data.access_token) {
        localStorage.setItem('token', data.data.access_token);
        console.log('LoginPage - Token stored');
      }

      // Store user object
      if (data.data.user) {
        localStorage.setItem('user', JSON.stringify(data.data.user));
        console.log('LoginPage - User stored:', data.data.user);
      }

      // Get user role for redirection
      const user = data.data.user;
      const userRole = user?.role;

      if (!userRole) {
        throw new Error('User role information is missing');
      }

      console.log('LoginPage - User role from response:', userRole);
      console.log('LoginPage - About to redirect to appropriate dashboard');

      // Redirect based on user role
      switch (userRole) {
        case 'admin':
          console.log('LoginPage - Redirecting to /admin/dashboard');
          navigate('/admin/dashboard');
          break;
        case 'service_advisor':
          console.log('LoginPage - Redirecting to /serviceadvisor/dashboard');
          navigate('/serviceadvisor/dashboard');
          break;
        case 'manager':
          console.log('LoginPage - Redirecting to /manager/dashboard');
          navigate('/manager/dashboard');
          break;
        default:
          console.log('LoginPage - Unknown role, redirecting to /');
          navigate('/');
      }
    } catch (err: any) {
      console.error('LoginPage - Login error:', err);

      if (err.message.includes('Failed to fetch')) {
        setError('Network error. Please check your connection and try again.');
      } else if (err.message.includes('JSON')) {
        setError('Invalid response from server. Please try again later.');
      } else {
        setError(err.message || 'An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-page">
      <div className="login-container" style={{ fontFamily: 'poppins' }}>

        <div className="login-left">

          <div style={{ display: 'flex', alignItems: 'center', gap: '12.5px' }}>
            <div className="login-logo"></div>
            <h2 className="login-h2">Welcome Back</h2>
          </div>

          <p className="login-subtitle" >
            Log in to manage your services and dashboard
          </p>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ marginRight: '8px', display: 'inline-block' }}>
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2" fill="none" />
                  <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" />
                </svg>
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email address"
                required
                disabled={loading}
                autoComplete="email"
              />
            </div>

            <div className="form-group password-group">
              <label htmlFor="password">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ marginRight: '8px', display: 'inline-block' }}>
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="2" fill="none" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2" fill="none" />
                </svg>
                Password
                <span className="login-forgot">Forgot password?</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  disabled={loading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  style={{
                    position: 'absolute',
                    right: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#6b7280',
                    padding: '4px'
                  }}
                  disabled={loading}
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" stroke="currentColor" strokeWidth="2" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" stroke="currentColor" strokeWidth="2" />
                      <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" stroke="currentColor" strokeWidth="2" />
                      <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" />
                      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="login-error">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ marginRight: '8px', display: 'inline-block' }}>
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                  <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="2" />
                  <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="2" />
                </svg>
                {error.includes('network') ? (
                  <>
                    Connection issue. Please check your internet connection and try again.
                  </>
                ) : error.includes('Invalid login credentials') ? (
                  <>
                    The email or password you entered is incorrect
                  </>
                ) : error.includes('User not found') ? (
                  <>
                    No account found with this email. Please check your email or sign up.
                  </>
                ) : (
                  error
                )}
              </div>
            )}

            <button
              type="submit"
              className="login-submit"
              disabled={loading || !formData.email || !formData.password}
            >
              {loading ? (
                <div style={{ display: 'flex', gap: '7.5px', justifyContent: 'center', alignItems: 'center' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ marginRight: '8px', animation: 'spin-cogwheel 1s linear infinite' }}>
                    <path d="M21 12a9 9 0 11-6.219-8.56" stroke="currentColor" strokeWidth="2" />
                  </svg>
                  Signing In...
                </div>
              ) : (
                <>
                  Sign In to Dashboard
                </>
              )}
            </button>
          </form>

          <div className="login-footer">
            © 2025 MotorTrace. All rights reserved
          </div>
        </div>

        <div className="login-right" style={{ background: 'linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%)' }}>

          <div style={{
            textAlign: 'center',
            marginBottom: '40px',
            position: 'relative',
            zIndex: 2
          }}>
            <h3 style={{
              color: 'white',
              fontSize: '2rem',
              fontWeight: '700',
              margin: '0 0 16px 0',
              textShadow: '0 2px 20px rgba(0, 0, 0, 0.3)'
            }}>
              Comprehensive Auto Management
            </h3>
            <p style={{
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: '1.1rem',
              margin: '0',
              lineHeight: '1.6',
              textShadow: '0 1px 10px rgba(0, 0, 0, 0.2)'
            }}>
              Streamline your automotive service operations with our integrated platform
            </p>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: 'auto',
            position: 'relative',
            zIndex: 2
          }}>
            <img
              src="https://autoleap.com/wp-content/uploads/2022/01/about-image-1.svg"
              alt="Dashboard preview"
              style={{
                width: '90%',
                height: 'auto',
                maxWidth: '400px',
                objectFit: 'contain',
                borderRadius: '16px',
                filter: 'drop-shadow(0 20px 40px rgba(0, 0, 0, 0.3)) brightness(1.1) contrast(1.1)'
              }}
            />
          </div>

          <div style={{
            marginTop: '40px',
            textAlign: 'center',
            position: 'relative',
            zIndex: 2
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '32px',
              flexWrap: 'wrap',
              opacity: 0.9
            }}>
              <div style={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '0.85rem',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" fill="none" />
                </svg>
                Secure Platform
              </div>
              <div style={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '0.85rem',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" fill="none" />
                </svg>
                Real-time Updates
              </div>
              <div style={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '0.85rem',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" fill="none" />
                </svg>
                Multi-role Access
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;