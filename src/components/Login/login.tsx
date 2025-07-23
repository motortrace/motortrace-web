// import React, { useState } from 'react';
// import './Login.scss';
// import { useNavigate } from 'react-router-dom';

// const Login: React.FC = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [role, setRole] = useState('admin'); // Default role
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const handleLogin = (e: React.FormEvent) => {
//     e.preventDefault();

//     // Replace with your actual login validation
//     if (!email || !password) {
//       setError('Please enter all fields');
//       return;
//     }

//     // Example route redirection based on role
//     switch (role) {
//       case 'admin':
//         navigate('/admin/dashboard');
//         break;
//       case 'part-seller':
//         navigate('/partseller/dashboard');
//         break;
//       case 'service-center':
//         navigate('/servicecenter/dashboard');
//         break;
//       case 'customer':
//         navigate('/customer/home');
//         break;
//       default:
//         setError('Invalid user role');
//     }
//   };

//   return (
//     <div className="login-page">
//       <div className="login-box">
//         <h2 className="login-title">Motor Trace Login</h2>

//         {error && <div className="error-msg">{error}</div>}

//         <form onSubmit={handleLogin} className="login-form">
//           <div className="form-group">
//             <label>Email Address</label>
//             <input
//               type="email"
//               placeholder="Enter email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />
//           </div>

//           <div className="form-group">
//             <label>Password</label>
//             <input
//               type="password"
//               placeholder="Enter password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />
//           </div>

//           <div className="form-group">
//             <label>User Role</label>
//             <select value={role} onChange={(e) => setRole(e.target.value)}>
//               <option value="admin">Admin</option>
//               <option value="part-seller">Parts Seller</option>
//               <option value="service-center">Service Center</option>
//               <option value="customer">Customer</option>
//             </select>
//           </div>

//           <button type="submit" className="login-btn">Login</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;

import React, { useState } from 'react';
import './login.scss';
import { Eye, EyeOff, Car, Shield, ArrowRight, CheckCircle } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('admin');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate API call
    setTimeout(() => {
      if (!email || !password) {
        setError('Please enter all fields');
        setIsLoading(false);
        return;
      }

      // Example route redirection based on role
      switch (role) {
        case 'admin':
          console.log('Redirecting to /admin/dashboard');
          break;
        case 'part-seller':
          console.log('Redirecting to /partseller/dashboard');
          break;
        case 'service-center':
          console.log('Redirecting to /servicecenter/dashboard');
          break;
        case 'customer':
          console.log('Redirecting to /customer/home');
          break;
        default:
          setError('Invalid user role');
      }
      setIsLoading(false);
    }, 1500);
  };

  const roleIcons = {
    admin: Shield,
    'part-seller': Car,
    'service-center': CheckCircle,
    customer: Car
  };

  const RoleIcon = roleIcons[role as keyof typeof roleIcons];

  return (
    <div className="login-page">
      {/* Background Pattern */}
      <div className="background-pattern"></div>
      
      <div className="login-container">
        {/* Login Card */}
        <div className="login-box">
          {/* Gradient Overlay */}
          <div className="gradient-overlay"></div>
          
          {/* Header */}
          <div className="login-header">
            <div className="logo-container">
              <Car className="logo-icon" />
            </div>
            <h1 className="login-title">Motor Trace</h1>
            <p className="login-subtitle">Sign in to your account</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-msg">
              {error}
            </div>
          )}

          {/* Login Form */}
          <div className="login-form">
            {/* Email Input */}
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
              />
            </div>

            {/* Password Input */}
            <div className="form-group">
              <label>Password</label>
              <div className="password-input-container">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input password-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle"
                >
                  {showPassword ? <EyeOff className="toggle-icon" /> : <Eye className="toggle-icon" />}
                </button>
              </div>
            </div>

            {/* User Role */}
            <div className="form-group">
              <label>User Role</label>
              <div className="select-container">
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="form-select"
                >
                  <option value="admin">Admin</option>
                  <option value="part-seller">Parts Seller</option>
                  <option value="service-center">Service Center</option>
                  <option value="customer">Customer</option>
                </select>
                <div className="select-icon">
                  <RoleIcon className="role-icon" />
                </div>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="form-options">
              <label className="remember-me">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="checkbox"
                />
                <span className="checkbox-label">Remember me</span>
              </label>
              <button
                type="button"
                className="forgot-password"
              >
                Forgot password?
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="login-btn"
              onClick={handleLogin}
            >
              {isLoading ? (
                <div className="loading-spinner"></div>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="arrow-icon" />
                </>
              )}
            </button>
          </div>

          {/* Divider */}
          <div className="divider">
            <div className="divider-line"></div>
            <div className="divider-text">
              <span>or</span>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="signup-section">
            <p className="signup-text">
              Don't have an account?{' '}
              <button className="signup-link">
                Sign up
              </button>
            </p>
          </div>

          {/* Footer */}
          <div className="login-footer">
            <p className="footer-text">
              © 2024 Motor Trace. All rights reserved.
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="features-grid">
          <div className="feature-card">
            <Shield className="feature-icon" />
            <p className="feature-text">Secure Login</p>
          </div>
          <div className="feature-card">
            <Car className="feature-icon" />
            <p className="feature-text">Vehicle Tracking</p>
          </div>
          <div className="feature-card">
            <CheckCircle className="feature-icon" />
            <p className="feature-text">Real-time Data</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;