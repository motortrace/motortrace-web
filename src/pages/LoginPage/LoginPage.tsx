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
  const navigate = useNavigate();

  useEffect(() => {
    const checkStatus = async () => {
      const status = await fetchUserStatus();
      if (status) {
        // Get user from localStorage or status
        let user = status.user;
        if (!user) {
          try {
            user = JSON.parse(localStorage.getItem('user') || '{}');
          } catch {}
        }
        if (user && user.role === 'admin') {
          navigate('/admin/dashboard');
        } else if (user && user.role === 'service_center') {
          navigate('/servicecenter/dashboard');
        } else {
          navigate('/');
        }
      } else {
        setCheckingStatus(false);
      }
    };
    checkStatus();
  }, [navigate]);

  if (checkingStatus) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <div style={{
        width: 48,
        height: 48,
        border: '6px solid #e5e7eb',
        borderTop: '6px solid #6366f1',
        borderRadius: '50%',
        animation: 'spin-cogwheel 1s linear infinite',
        marginBottom: 12
      }}></div>
      <style>{`
        @keyframes spin-cogwheel {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Client-Type': 'web',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }
      
      // Store the token
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      // Store user object if present
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      // Redirect to role-specific dashboard
      let user = data.user;
      if (!user) {
        // Try to get from localStorage if not in response
        try {
          user = JSON.parse(localStorage.getItem('user') || '{}');
        } catch {}
      }
      if (user && user.role === 'admin') {
        window.location.href = '/admin/dashboard';
      } else if (user && user.role === 'service_center') {
        window.location.href = '/servicecenter/dashboard';
      } else {
        window.location.href = '/';
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Remove Google OAuth login button and logic

  const handleAppleLogin = () => {
    // TODO: Implement Apple OAuth flow
    alert('Apple login not implemented yet');
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-left">
          <div className="login-logo"></div>
          <h2>Welcome Back</h2>
          <p className="login-subtitle">Enter your credentials to log in to your account</p>
          {/* Removed Google OAuth button */}
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <input 
                type="email" 
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="simaakniyaz@gmail.com"
                required 
                disabled={loading} 
              />
            </div>
            <div className="form-group password-group">
              <label htmlFor="password">
                Password
                <span className="login-forgot">Forgot password?</span>
              </label>
              <input 
                type="password" 
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="min 8 chars"
                required 
                minLength={8} 
                disabled={loading} 
              />
            </div>
            {error && <div className="login-error">{error}</div>}
            <button 
              type="submit" 
              className="login-submit" 
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          {/* No sign up link, login only */}
          <div className="login-footer">
            2024 MotorTrace, All rights reserved
          </div>
        </div>
        <div className="login-right">
          <img src="https://autoleap.com/wp-content/uploads/2022/01/about-image-1.svg" alt="Dashboard preview" style={{width: '100%', height: '100%', maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: 16}} />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;