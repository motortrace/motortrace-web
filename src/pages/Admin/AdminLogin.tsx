import React, { useState } from 'react';
import { Eye, EyeOff, User, Lock} from 'lucide-react';
import Logo from "../../assets/images/motortraceLogo.png"
import './AdminLogin.scss';
import { useNavigate } from 'react-router-dom';

interface adminLoginFormData {
  email: string;
  password: string;
}

const AdminLogin: React.FC = () => {
  const [formData, setFormData] = useState<adminLoginFormData>({
    email: '',
    password: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<adminLoginFormData>>({});
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name as keyof adminLoginFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
    setError('');
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<adminLoginFormData> = {};
    if (!formData.email) {
      newErrors.email = '* Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '* Please enter a valid email';
    }
    if (!formData.password) {
      newErrors.password = '* Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = '* Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!validateForm()) return;
  //   setIsLoading(true);
  //   setError('');
  //   try {
  //     const res = await fetch('http://localhost:3000/auth/adminLogin', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'X-Client-Type': 'web',
  //       },
  //       body: JSON.stringify(formData),
  //     });
  //     let data: any = {};
  //     const contentType = res.headers.get('content-type');
  //     if (contentType && contentType.includes('application/json')) {
  //       data = await res.json();
  //       console.log(data);
  //     } else {
  //       // Not JSON, likely an HTML error page
  //       throw new Error('Server error: Please try again later.');
  //     }
  //     if (!res.ok) {
  //       throw new Error(data.error || 'adminLogin failed');
  //     }
  //     if (data.token) {
  //       localStorage.setItem('token', data.token);
  //     }
  //     if (data.user) {
  //       localStorage.setItem('user', JSON.stringify(data.user));
  //     }
  //     let user = data.user;
  //     if (!user) {
  //       try {
  //         user = JSON.parse(localStorage.getItem('user') || '{}');
  //       } catch {}
  //     }
  //     if (user && user.role === 'admin') {
  //       navigate('/admin/dashboard');
  //     } else {
  //       setError('Access denied: Not an admin account');
  //       localStorage.removeItem('token');
  //       localStorage.removeItem('user');
  //     }
  //   } catch (err: any) {
  //     setError(err.message);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const res = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Remove X-Client-Type if not required by server
        },
        body: JSON.stringify(formData),
      });
  
      let data: any = {};
      
      // Always try to parse JSON first
      try {
        const text = await res.text();
        if (text) {
          data = JSON.parse(text);
        }
      } catch (parseError) {
        console.error('Failed to parse response:', parseError);
        throw new Error('Server returned invalid response');
      }
  
      // Handle different response status codes properly
      if (res.status === 401) {
        // Authentication failed
        setError(data.error || data.message || 'Invalid email or password');
        return;
      }
      
      if (res.status === 500) {
        // Server error
        console.error('Server error:', data);
        setError('Internal server error. Please try again later.');
        return;
      }
      
      if (!res.ok) {
        // Other HTTP errors
        throw new Error(data.error || data.message || `HTTP ${res.status}: ${res.statusText}`);
      }
  
      // Success case
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }
  
      const user = data.user;
      if (user && user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        setError('Access denied: Not an admin account');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
      
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="adminLogin-container">
      <div className="adminLogin-background">
        <div className="background-pattern"></div>
        <div className="background-overlay"></div>
      </div>
      <div className="adminLogin-content">
        <div className="adminLogin-card">
          <div className="adminLogin-header">
            <div className="logo">
              <img src={Logo} alt="Logo" className="logo-icon" />
              <h1 className="logo-text">MotorTrace Admin</h1>
            </div>
            <p className="subtitle">Admin Portal - Login to Manage the Platform</p>
          </div>
          <form onSubmit={handleSubmit} className="adminLogin-form">
            <div className="form-group">
              {error && <span className="error-message">* {error}</span>} 
              {errors.email && <span className="error-message">{errors.email}</span>}
              <div className="input-wrapper">
                <User className="input-icon" />
                <input
                  type="email"
                  name="email"
                  placeholder="Admin Email address"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`form-input ${errors.email ? 'error' : ''}`}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="form-group">
              {errors.password && <span className="error-message">{errors.password}</span>}
              <div className="input-wrapper">
                <Lock className="input-icon" />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`form-input ${errors.password ? 'error' : ''}`}
                  disabled={isLoading}
                />
                
              </div>
              
            </div>
            <div className="form-options">
              <label className="checkbox-wrapper">
                <input type="checkbox" disabled={isLoading} />
                <span className="checkmark"></span>
                <span className="checkbox-text">Remember me</span>
              </label>
              <a href="#" className="forgot-password">Forgot password?</a>
            </div>
            
            <button
              type="submit"
              className={`adminLogin-button ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="loading-spinner"></div>
              ) : (
                `Login as Admin`
              )}
            </button>
          </form>
          <div className="adminLogin-footer">
            <p>Authorized Personnel Only!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;