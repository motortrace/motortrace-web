import React from 'react';
import './Register.scss';
import registerImage from '../../assets/images/logo.jpg'; // Replace with a relevant image

const RegisterPage: React.FC = () => {
  return (
    <div className="register-page">
      <div className="register-left">
        {/* <img src={registerImage} alt="Register at MotorTrace" /> */}
      </div>

      <div className="register-right">
        <div className="register-form-container">
          <h2>Create Account</h2>
          <p>Join MotorTrace and start shopping for the best auto parts</p>

          <form className="register-form">
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" placeholder="Sheik Abdulla" />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input type="email" placeholder="you@example.com" />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input type="password" placeholder="••••••••" />
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <input type="password" placeholder="••••••••" />
            </div>

            <button type="submit" className="register-button">Register</button>

            <div className="divider"><span>or</span></div>

            <button type="button" className="google-register">Continue with Google</button>

            <p className="login-text">
              Already have an account? <a href="#">Login</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
