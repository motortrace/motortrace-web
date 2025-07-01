import React from 'react';
import './Login.scss';
import loginImage from '../../assets/images/loginPage.png'; // Replace with your own image

const LoginPage: React.FC = () => {
  return (
    <div className="login-page">
      <div className="login-left">
        {/* <img src={loginImage} alt="MotorTrace Login" /> */}
      </div>

      <div className="login-right">
        <div className="login-form-container">
          <h2>Welcome Back</h2>
          <p>Login to your MotorTrace account</p>

          <form className="login-form">
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" placeholder="you@example.com" />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input type="password" placeholder="••••••••" />
            </div>

            <div className="login-actions">
              <button type="submit" className="login-button">Login</button>
              <a href="#" className="forgot-password">Forgot Password?</a>
            </div>

            <div className="divider"><span>or</span></div>

            <button type="button" className="google-login">Continue with Google</button>

            <p className="register-text">
              Don’t have an account? <a href="#">Register</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
