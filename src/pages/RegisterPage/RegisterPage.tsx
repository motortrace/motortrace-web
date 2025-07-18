import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUserStatus } from '../../utils/fetchUserStatus';
import '../LoginPage/LoginPage.scss';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    agree: false,
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [checkingStatus, setCheckingStatus] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkStatus = async () => {
      const status = await fetchUserStatus();
      if (status) {
        navigate('/dashboard');
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (e.target instanceof HTMLInputElement && e.target.type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }
      
      // Store the token
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      
      // Check if setup is required
      if (data.requiresSetup) {
        // Redirect to the appropriate setup page
        window.location.href = data.setupStatus.redirectTo;
      } else {
        // Setup complete, redirect to dashboard
        window.location.href = '/dashboard';
      }
      
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Redirect to backend Google OAuth endpoint with callback URL
      const callbackUrl = encodeURIComponent(`${window.location.origin}/auth/callback`);
      window.location.href = `http://localhost:3000/auth/google?callback=${callbackUrl}`;
      
    } catch (err: any) {
      setError('Google authentication failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-left">
          <div className="login-logo"></div>
          
          <h2>Create your account</h2>
          <p className="login-subtitle">Sign up to get started with MotorTrace</p>
          
          <div className="social-login">
            <button 
              className="login-google" 
              onClick={handleGoogleRegister} 
              disabled={loading} 
              style={{ color: '#222' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Sign up with Google
            </button>
          </div>
          
          <div className="login-divider"><span>or</span></div>
          
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="you@example.com"
                required
                disabled={loading}
              />
            </div>
            
            <div className="form-group password-group">
              <label htmlFor="password">Password</label>
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

            <div className="terms-group">
              <input
                type="checkbox"
                id="agree"
                name="agree"
                checked={formData.agree}
                onChange={handleInputChange}
                required
              />
              <label htmlFor="agree">
                I agree to the <a href="#">Terms & Privacy</a>
              </label>
            </div>
            
            {error && <div className="login-error">{error}</div>}
            
            <button
              type="submit"
              className="login-submit"
              disabled={loading || !formData.agree}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="login-signup">
            Already have an account? <a href="#">Sign in</a>
          </div>
          <div className="login-footer">
            2024 MotorTrace, All rights reserved
          </div>
        </div>
        <div className="login-right">
          <img 
            src="https://autoleap.com/wp-content/uploads/2022/01/about-image-1.svg" 
            alt="Dashboard preview" 
            style={{
              width: '100%', 
              height: '100%', 
              maxWidth: '100%', 
              maxHeight: '100%', 
              objectFit: 'contain', 
              borderRadius: 16
            }} 
          />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage; 