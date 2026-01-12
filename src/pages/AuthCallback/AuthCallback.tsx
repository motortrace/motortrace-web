import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import './AuthCallback.scss';

interface User {
  id: number;
  email: string;
  name: string;
  phone: string | null;
  role: string;
}

interface SetupStatus {
  isRegistrationComplete: boolean;
  isSetupComplete: boolean;
  hasActiveSubscription: boolean;
  missingSteps: string[];
  redirectTo: string;
}

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Extract URL parameters
        const token = searchParams.get('token');
        const userStr = searchParams.get('user');
        const setupStatusStr = searchParams.get('setupStatus');
        const requiresSetup = searchParams.get('requiresSetup') === 'true';

        // Validate required parameters
        if (!token) {
          throw new Error('No authentication token received');
        }

        if (!userStr) {
          throw new Error('No user data received');
        }

        // Parse JSON strings
        let user: User;
        let setupStatus: SetupStatus | null = null;

        try {
          user = JSON.parse(decodeURIComponent(userStr));
        } catch (parseError) {
          throw new Error('Invalid user data format');
        }

        if (setupStatusStr) {
          try {
            setupStatus = JSON.parse(decodeURIComponent(setupStatusStr));
          } catch (parseError) {
            console.warn('Invalid setup status format, continuing without setup status');
          }
        }

        // Store authentication data
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        // Determine redirect based on setup status
        if (requiresSetup && setupStatus) {
          // Redirect to appropriate setup page
          window.location.href = setupStatus.redirectTo;
        } else {
          // Setup complete, redirect to dashboard
          window.location.href = '/dashboard';
        }

      } catch (err: any) {
        console.error('Auth callback error:', err);
        setError(err.message || 'Authentication failed');
        setLoading(false);
      }
    };

    handleCallback();
  }, [searchParams]);

  if (error) {
    return (
      <div className="auth-callback-page">
        <div className="auth-callback-container">
          <div className="error-content">
            <h1>Authentication Failed</h1>
            <p>{error}</p>
            <button 
              onClick={() => window.location.href = '/login'}
              className="retry-btn"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-callback-page">
      <div className="auth-callback-container">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <h1>Completing Authentication...</h1>
          <p>Please wait while we set up your account.</p>
        </div>
      </div>
    </div>
  );
};

export default AuthCallback; 