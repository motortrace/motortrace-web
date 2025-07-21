import React, { useState } from 'react';
import './CompleteRegistration.scss';

interface CompleteRegistrationProps {
  userData: {
    name: string;
    email: string;
    // OAuth data from Google
  };
  onComplete: (registrationData: any) => void;
  loading?: boolean;
}

const CompleteRegistration: React.FC<CompleteRegistrationProps> = ({
  userData,
  onComplete,
  loading = false
}) => {
  const [formData, setFormData] = useState({
    phone: '',
    role: 'service_center' as 'service_center' | 'part_seller',
    businessName: '',
    businessType: '',
    businessSize: '',
    address: '',
    city: '',
    postalCode: '',
    website: '',
    taxId: '',
    registrationNumber: '',
    services: [] as string[],
    operatingHours: {
      monday: { open: '09:00', close: '17:00', closed: false },
      tuesday: { open: '09:00', close: '17:00', closed: false },
      wednesday: { open: '09:00', close: '17:00', closed: false },
      thursday: { open: '09:00', close: '17:00', closed: false },
      friday: { open: '09:00', close: '17:00', closed: false },
      saturday: { open: '09:00', close: '17:00', closed: false },
      sunday: { open: '09:00', close: '17:00', closed: true }
    }
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const businessSizes = [
    { value: 'solo', label: 'Solo mechanic/owner' },
    { value: 'small', label: '2-5 employees' },
    { value: 'medium', label: '6-15 employees' },
    { value: 'large', label: '16+ employees' }
  ];

  const serviceCenterServices = [
    'Oil Change & Maintenance',
    'Brake Service',
    'Engine Diagnostics',
    'Electrical Systems',
    'AC & Heating',
    'Transmission Service',
    'Suspension & Steering',
    'Exhaust Systems',
    'Tire Service',
    'Body & Paint Work'
  ];

  const partsSellerServices = [
    'Engine Parts',
    'Brake Parts',
    'Electrical Parts',
    'Suspension Parts',
    'Transmission Parts',
    'Body Parts',
    'Interior Parts',
    'Accessories',
    'Tools & Equipment',
    'Lubricants & Fluids'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleServiceToggle = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  const handleOperatingHoursChange = (day: string, field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      operatingHours: {
        ...prev.operatingHours,
        [day]: {
          ...prev.operatingHours[day as keyof typeof prev.operatingHours],
          [field]: value
        }
      }
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.businessName.trim()) {
      newErrors.businessName = 'Business name is required';
    }

    if (!formData.businessType.trim()) {
      newErrors.businessType = 'Business type is required';
    }

    if (!formData.businessSize) {
      newErrors.businessSize = 'Business size is required';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (formData.services.length === 0) {
      newErrors.services = 'Please select at least one service';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Prepare the complete registration data
    const registrationData = {
      ...userData,
      phone: formData.phone,
      role: formData.role,
      profileData: {
        businessDetails: {
          businessName: formData.businessName,
          businessType: formData.businessType,
          businessSize: formData.businessSize,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          phone: formData.phone,
          website: formData.website,
          taxId: formData.taxId,
          registrationNumber: formData.registrationNumber,
          servicesOffered: formData.services,
          operatingHours: formData.operatingHours
        }
      }
    };

    onComplete(registrationData);
  };

  const getServicesList = () => {
    return formData.role === 'service_center' ? serviceCenterServices : partsSellerServices;
  };

  return (
    <div className="complete-registration">
      <div className="registration-container">
        <div className="registration-header">
          <div className="oauth-success">
            <div className="success-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" fill="#10b981" />
                <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h1>Welcome, {userData.name}! 👋</h1>
            <p className="subtitle">Your Google account is connected successfully</p>
            <p className="description">Please complete your business profile to get started with MotorTrace</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="registration-form">
          <div className="form-section">
            <h3>Contact Information</h3>
            
            <div className="form-group">
              <label htmlFor="phone">Phone Number *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+94 11 234 5678"
                required
                disabled={loading}
              />
              {errors.phone && <span className="error">{errors.phone}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="role">Business Type *</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                required
                disabled={loading}
              >
                <option value="service_center">Service Center</option>
                <option value="part_seller">Parts Seller</option>
              </select>
            </div>
          </div>

          <div className="form-section">
            <h3>Business Information</h3>
            
            <div className="form-group">
              <label htmlFor="businessName">Business Name *</label>
              <input
                type="text"
                id="businessName"
                name="businessName"
                value={formData.businessName}
                onChange={handleInputChange}
                placeholder="Enter your business name"
                required
                disabled={loading}
              />
              {errors.businessName && <span className="error">{errors.businessName}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="businessType">Business Type *</label>
                <input
                  type="text"
                  id="businessType"
                  name="businessType"
                  value={formData.businessType}
                  onChange={handleInputChange}
                  placeholder={formData.role === 'service_center' ? 'Auto Repair Shop, Garage, etc.' : 'Parts Store, Distributor, etc.'}
                  required
                  disabled={loading}
                />
                {errors.businessType && <span className="error">{errors.businessType}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="businessSize">Business Size *</label>
                <select
                  id="businessSize"
                  name="businessSize"
                  value={formData.businessSize}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                >
                  <option value="">Select size</option>
                  {businessSizes.map(size => (
                    <option key={size.value} value={size.value}>
                      {size.label}
                    </option>
                  ))}
                </select>
                {errors.businessSize && <span className="error">{errors.businessSize}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="address">Address *</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Street address"
                required
                disabled={loading}
              />
              {errors.address && <span className="error">{errors.address}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">City *</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="City"
                  required
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
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  placeholder="Postal code"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="website">Website (Optional)</label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder="https://yourwebsite.com"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="taxId">Tax ID / VAT Number</label>
                <input
                  type="text"
                  id="taxId"
                  name="taxId"
                  value={formData.taxId}
                  onChange={handleInputChange}
                  placeholder="Tax identification number"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="registrationNumber">Business Registration Number</label>
              <input
                type="text"
                id="registrationNumber"
                name="registrationNumber"
                value={formData.registrationNumber}
                onChange={handleInputChange}
                placeholder="Registration number"
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Services Offered *</h3>
            <p className="section-description">
              Select the services you {formData.role === 'service_center' ? 'provide' : 'sell'}:
            </p>
            
            <div className="services-grid">
              {getServicesList().map(service => (
                <label key={service} className="service-checkbox">
                  <input
                    type="checkbox"
                    checked={formData.services.includes(service)}
                    onChange={() => handleServiceToggle(service)}
                    disabled={loading}
                  />
                  <span className="checkmark"></span>
                  {service}
                </label>
              ))}
            </div>
            {errors.services && <span className="error">{errors.services}</span>}
          </div>

          <div className="form-section">
            <h3>Operating Hours</h3>
            <p className="section-description">Set your business operating hours:</p>
            
            <div className="operating-hours">
              {Object.entries(formData.operatingHours).map(([day, hours]) => (
                <div key={day} className="day-row">
                  <div className="day-label">
                    <input
                      type="checkbox"
                      checked={!hours.closed}
                      onChange={(e) => handleOperatingHoursChange(day, 'closed', !e.target.checked)}
                      disabled={loading}
                    />
                    <span>{day.charAt(0).toUpperCase() + day.slice(1)}</span>
                  </div>
                  {!hours.closed && (
                    <div className="time-inputs">
                      <input
                        type="time"
                        value={hours.open}
                        onChange={(e) => handleOperatingHoursChange(day, 'open', e.target.value)}
                        disabled={loading}
                      />
                      <span>to</span>
                      <input
                        type="time"
                        value={hours.close}
                        onChange={(e) => handleOperatingHoursChange(day, 'close', e.target.value)}
                        disabled={loading}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="complete-btn"
            disabled={loading}
          >
            {loading ? 'Completing Registration...' : 'Complete Registration'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CompleteRegistration; 