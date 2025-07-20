import React, { useState } from 'react';
import './PaymentForm.scss';

interface PaymentFormProps {
  selectedPlan: { type: 'monthly' | 'yearly'; price: number };
  onPaymentSuccess: (paymentData: any) => void;
  onPaymentError: (error: string) => void;
  loading?: boolean;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  selectedPlan,
  onPaymentSuccess,
  onPaymentError,
  loading = false
}) => {
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    billingAddress: '',
    city: '',
    postalCode: '',
    country: 'Sri Lanka'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPaymentData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!paymentData.cardNumber.replace(/\s/g, '').match(/^\d{16}$/)) {
      newErrors.cardNumber = 'Please enter a valid 16-digit card number';
    }

    if (!paymentData.expiryDate.match(/^(0[1-9]|1[0-2])\/([0-9]{2})$/)) {
      newErrors.expiryDate = 'Please enter expiry date in MM/YY format';
    }

    if (!paymentData.cvv.match(/^\d{3,4}$/)) {
      newErrors.cvv = 'Please enter a valid CVV';
    }

    if (!paymentData.cardholderName.trim()) {
      newErrors.cardholderName = 'Please enter cardholder name';
    }

    if (!paymentData.billingAddress.trim()) {
      newErrors.billingAddress = 'Please enter billing address';
    }

    if (!paymentData.city.trim()) {
      newErrors.city = 'Please enter city';
    }

    if (!paymentData.postalCode.trim()) {
      newErrors.postalCode = 'Please enter postal code';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful payment
      const paymentResult = {
        id: 'pay_' + Math.random().toString(36).substr(2, 9),
        amount: selectedPlan.price,
        currency: 'USD',
        status: 'succeeded',
        plan: selectedPlan,
        timestamp: new Date().toISOString()
      };

      onPaymentSuccess(paymentResult);
    } catch (error) {
      onPaymentError('Payment failed. Please try again.');
    }
  };

  return (
    <div className="payment-form">
      <div className="payment-header">
        <h2>Payment Information</h2>
        <p>Complete your subscription to MotorTrace Pro</p>
        <div className="plan-summary">
          <span>Plan: {selectedPlan.type === 'monthly' ? 'Monthly' : 'Yearly'}</span>
          <span className="amount">${selectedPlan.price}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <h3>Card Details</h3>
          
          <div className="form-group">
            <label htmlFor="cardNumber">Card Number</label>
            <input
              type="text"
              id="cardNumber"
              name="cardNumber"
              value={paymentData.cardNumber}
              onChange={(e) => {
                const formatted = formatCardNumber(e.target.value);
                setPaymentData(prev => ({ ...prev, cardNumber: formatted }));
              }}
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              disabled={loading}
            />
            {errors.cardNumber && <span className="error">{errors.cardNumber}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="expiryDate">Expiry Date</label>
              <input
                type="text"
                id="expiryDate"
                name="expiryDate"
                value={paymentData.expiryDate}
                onChange={(e) => {
                  const formatted = formatExpiryDate(e.target.value);
                  setPaymentData(prev => ({ ...prev, expiryDate: formatted }));
                }}
                placeholder="MM/YY"
                maxLength={5}
                disabled={loading}
              />
              {errors.expiryDate && <span className="error">{errors.expiryDate}</span>}
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
                disabled={loading}
              />
              {errors.cvv && <span className="error">{errors.cvv}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="cardholderName">Cardholder Name</label>
            <input
              type="text"
              id="cardholderName"
              name="cardholderName"
              value={paymentData.cardholderName}
              onChange={handleInputChange}
              placeholder="John Doe"
              disabled={loading}
            />
            {errors.cardholderName && <span className="error">{errors.cardholderName}</span>}
          </div>
        </div>

        <div className="form-section">
          <h3>Billing Address</h3>
          
          <div className="form-group">
            <label htmlFor="billingAddress">Address</label>
            <input
              type="text"
              id="billingAddress"
              name="billingAddress"
              value={paymentData.billingAddress}
              onChange={handleInputChange}
              placeholder="123 Main Street"
              disabled={loading}
            />
            {errors.billingAddress && <span className="error">{errors.billingAddress}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="city">City</label>
              <input
                type="text"
                id="city"
                name="city"
                value={paymentData.city}
                onChange={handleInputChange}
                placeholder="Colombo"
                disabled={loading}
              />
              {errors.city && <span className="error">{errors.city}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="postalCode">Postal Code</label>
              <input
                type="text"
                id="postalCode"
                name="postalCode"
                value={paymentData.postalCode}
                onChange={handleInputChange}
                placeholder="10000"
                disabled={loading}
              />
              {errors.postalCode && <span className="error">{errors.postalCode}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="country">Country</label>
            <select
              id="country"
              name="country"
              value={paymentData.country}
              onChange={handleInputChange}
              disabled={loading}
            >
              <option value="Sri Lanka">Sri Lanka</option>
              <option value="United States">United States</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Canada">Canada</option>
              <option value="Australia">Australia</option>
            </select>
          </div>
        </div>

        <div className="payment-summary">
          <div className="summary-row">
            <span>Plan</span>
            <span>{selectedPlan.type === 'monthly' ? 'Monthly' : 'Yearly'} Subscription</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>${selectedPlan.price}</span>
          </div>
        </div>

        <button
          type="submit"
          className="payment-submit"
          disabled={loading}
        >
          {loading ? (
            <>
              <div className="spinner"></div>
              Processing Payment...
            </>
          ) : (
            `Pay $${selectedPlan.price}`
          )}
        </button>
      </form>

      <div className="payment-footer">
        <p>🔒 Your payment information is secure and encrypted</p>
        <p>✓ 14-day free trial • ✓ Cancel anytime</p>
      </div>
    </div>
  );
};

export default PaymentForm; 