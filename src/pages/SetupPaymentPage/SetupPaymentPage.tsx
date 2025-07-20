import React, { useEffect, useState } from 'react';
import { useSetupFlow } from '../../hooks/useSetupFlow';
import { useNavigate } from 'react-router-dom';
import { fetchUserStatus } from '../../utils/fetchUserStatus';
import './SetupPaymentPage.scss';

interface PaymentData {
  planType: 'monthly' | 'yearly';
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
}

const SetupPaymentPage = () => {
  const { setupStatus } = useSetupFlow();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [checkingStatus, setCheckingStatus] = useState(true);
  const navigate = useNavigate();
  
  const [paymentData, setPaymentData] = useState<PaymentData>({
    planType: 'monthly',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });

  const plans = {
    monthly: {
      name: 'Monthly Plan',
      price: 29,
      period: 'month',
      savings: 0,
      features: [
        'Full access to all features',
        'Unlimited service requests',
        'Priority customer support',
        'Analytics dashboard'
      ]
    },
    yearly: {
      name: 'Yearly Plan',
      price: 290,
      period: 'year',
      savings: 58,
      features: [
        'All monthly features',
        '17% savings',
        'Free setup consultation',
        'Priority feature requests'
      ]
    }
  };

  useEffect(() => {
    const checkStatus = async () => {
      const status = await fetchUserStatus();
      if (!status) {
        navigate('/login');
        return;
      }
      if (status.hasActiveSubscription) {
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
    const { name, value } = e.target;
    setPaymentData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setPaymentData(prev => ({
      ...prev,
      cardNumber: formatted
    }));
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value);
    setPaymentData(prev => ({
      ...prev,
      expiryDate: formatted
    }));
  };

  const createSubscription = async (paymentData: PaymentData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token');

      const response = await fetch('http://localhost:3000/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          planType: paymentData.planType,
          paymentData: {
            cardNumber: paymentData.cardNumber.replace(/\s/g, ''),
            expiryDate: paymentData.expiryDate,
            cvv: paymentData.cvv,
            cardholderName: paymentData.cardholderName
          }
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        return { success: true, data };
      } else {
        throw new Error(data.error || 'Payment failed');
      }
    } catch (error) {
      console.error('Payment failed:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await createSubscription(paymentData);
      
      if (result.success) {
        // Payment complete, redirect to dashboard
        window.location.href = '/dashboard';
      }
    } catch (err: any) {
      setError(err.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const selectedPlan = plans[paymentData.planType];

  return (
    <div className="setup-payment-page">
      <div className="setup-container">
        <div className="setup-header">
          <h1>Complete Payment Setup</h1>
          <p>Choose your subscription plan and enter payment details to get started.</p>
        </div>

        <div className="payment-content">
          {/* Plan Selection */}
          <div className="plan-selection">
            <h3>Choose Your Plan</h3>
            <div className="plan-options">
              {Object.entries(plans).map(([key, plan]) => (
                <div
                  key={key}
                  className={`plan-option ${paymentData.planType === key ? 'selected' : ''}`}
                  onClick={() => setPaymentData(prev => ({ ...prev, planType: key as 'monthly' | 'yearly' }))}
                >
                  <div className="plan-header">
                    <h4>{plan.name}</h4>
                    <div className="plan-price">
                      <span className="amount">${plan.price}</span>
                      <span className="period">/{plan.period}</span>
                    </div>
                    {plan.savings && (
                      <div className="savings">Save ${plan.savings}/year</div>
                    )}
                  </div>
                  <ul className="plan-features">
                    {plan.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Form */}
          <form onSubmit={handleSubmit} className="payment-form">
            <h3>Payment Information</h3>
            
            <div className="form-group">
              <label htmlFor="cardholderName">Cardholder Name</label>
              <input
                type="text"
                id="cardholderName"
                name="cardholderName"
                value={paymentData.cardholderName}
                onChange={handleInputChange}
                placeholder="John Doe"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="cardNumber">Card Number</label>
              <input
                type="text"
                id="cardNumber"
                name="cardNumber"
                value={paymentData.cardNumber}
                onChange={handleCardNumberChange}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                required
                disabled={loading}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="expiryDate">Expiry Date</label>
                <input
                  type="text"
                  id="expiryDate"
                  name="expiryDate"
                  value={paymentData.expiryDate}
                  onChange={handleExpiryDateChange}
                  placeholder="MM/YY"
                  maxLength={5}
                  required
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label htmlFor="cvv">CVV</label>
                <input
                  type="text"
                  id="cvv"
                  name="cvv"
                  value={paymentData.cvv}
                  onChange={handleInputChange}
                  placeholder="123"
                  maxLength={4}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="payment-summary">
              <h4>Payment Summary</h4>
              <div className="summary-item">
                <span>{selectedPlan.name}</span>
                <span>${selectedPlan.price}/{selectedPlan.period}</span>
              </div>
              {selectedPlan.savings && (
                <div className="summary-item savings">
                  <span>Yearly Savings</span>
                  <span>-${selectedPlan.savings}</span>
                </div>
              )}
              <div className="summary-total">
                <span>Total</span>
                <span>${selectedPlan.price}/{selectedPlan.period}</span>
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}
            
            <button
              type="submit"
              className="submit-btn"
              disabled={loading}
            >
              {loading ? 'Processing Payment...' : `Pay $${selectedPlan.price}/${selectedPlan.period}`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SetupPaymentPage; 