import React from 'react';
import { useNavigate } from 'react-router-dom';
import './OnboardingSuccess.scss';

interface OnboardingSuccessProps {
  userData: {
    name: string;
    email: string;
    role: string;
  };
  businessData: any;
  paymentData: any;
}

const OnboardingSuccess: React.FC<OnboardingSuccessProps> = ({
  userData,
  businessData,
  paymentData
}) => {
  const navigate = useNavigate();

  const handleGoToDashboard = () => {
    navigate('/servicecenter/dashboard');
  };

  const getWelcomeMessage = () => {
    const roleText = userData.role === 'service_center' ? 'Service Center' : 'Parts Seller';
    return `Welcome to MotorTrace, ${userData.name}!`;
  };

  const getNextSteps = () => {
    if (userData.role === 'service_center') {
      return [
        'Set up your service categories and pricing',
        'Add your technicians and their schedules',
        'Configure your appointment booking system',
        'Set up your inventory management',
        'Connect with parts suppliers'
      ];
    } else {
      return [
        'Add your parts inventory',
        'Set up pricing and availability',
        'Configure shipping and delivery options',
        'Set up your payment methods',
        'Start receiving orders from service centers'
      ];
    }
  };

  return (
    <div className="onboarding-success">
      <div className="success-container">
        <div className="success-header">
          <div className="success-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" fill="#10b981" />
              <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1>🎉 Welcome to MotorTrace!</h1>
          <p className="success-subtitle">{getWelcomeMessage()}</p>
          <p className="success-description">
            Your {userData.role === 'service_center' ? 'service center' : 'parts seller business'} is now set up and ready to go!
          </p>
        </div>

        <div className="success-details">
          <div className="detail-card">
            <h3>Account Details</h3>
            <div className="detail-row">
              <span>Name:</span>
              <span>{userData.name}</span>
            </div>
            <div className="detail-row">
              <span>Email:</span>
              <span>{userData.email}</span>
            </div>
            <div className="detail-row">
              <span>Business:</span>
              <span>{businessData.businessName}</span>
            </div>
            <div className="detail-row">
              <span>Plan:</span>
              <span>{paymentData.plan.type === 'monthly' ? 'Monthly' : 'Yearly'} Subscription</span>
            </div>
          </div>

          <div className="detail-card">
            <h3>Subscription Status</h3>
            <div className="status-badge active">
              <span className="status-dot"></span>
              Active
            </div>
            <div className="detail-row">
              <span>Next billing:</span>
              <span>
                {paymentData.plan.type === 'monthly' 
                  ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()
                  : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString()
                }
              </span>
            </div>
            <div className="detail-row">
              <span>Amount:</span>
              <span>${paymentData.amount}</span>
            </div>
          </div>
        </div>

        <div className="next-steps">
          <h3>What's Next?</h3>
          <p>Here are some things you can do to get started:</p>
          <ul>
            {getNextSteps().map((step, index) => (
              <li key={index}>
                <span className="step-number">{index + 1}</span>
                {step}
              </li>
            ))}
          </ul>
        </div>

        <div className="action-buttons">
          <button className="primary-btn" onClick={handleGoToDashboard}>
            Go to Dashboard
          </button>
          <button className="secondary-btn" onClick={() => window.open('/help', '_blank')}>
            View Help Center
          </button>
        </div>

        <div className="success-footer">
          <p>Need help? Contact our support team at support@motortrace.com</p>
          <p>Your 14-day free trial starts now!</p>
        </div>
      </div>
    </div>
  );
};

export default OnboardingSuccess; 