import React, { useState } from 'react';
import './BusinessProfileForm.scss';

interface BusinessProfileFormProps {
  role: 'service_center' | 'part_seller';
  onComplete: (profileData: any) => void;
  loading?: boolean;
}

const BusinessProfileForm: React.FC<BusinessProfileFormProps> = ({
  role,
  onComplete,
  loading = false
}) => {
  const [profileData, setProfileData] = useState({
    businessName: '',
    businessType: '',
    businessSize: '',
    address: '',
    city: '',
    postalCode: '',
    phone: '',
    website: '',
    taxId: '',
    registrationNumber: '',
    operatingHours: {
      monday: { open: '09:00', close: '17:00', closed: false },
      tuesday: { open: '09:00', close: '17:00', closed: false },
      wednesday: { open: '09:00', close: '17:00', closed: false },
      thursday: { open: '09:00', close: '17:00', closed: false },
      friday: { open: '09:00', close: '17:00', closed: false },
      saturday: { open: '09:00', close: '17:00', closed: false },
      sunday: { open: '09:00', close: '17:00', closed: true }
    },
    services: [] as string[],
    specialties: [] as string[]
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

  const partsVendorServices = [
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
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
    setProfileData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  const handleSpecialtyToggle = (specialty: string) => {
    setProfileData(prev => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter(s => s !== specialty)
        : [...prev.specialties, specialty]
    }));
  };

  const handleOperatingHoursChange = (day: string, field: string, value: string | boolean) => {
    setProfileData(prev => ({
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

    if (!profileData.businessName.trim()) {
      newErrors.businessName = 'Business name is required';
    }

    if (!profileData.businessType.trim()) {
      newErrors.businessType = 'Business type is required';
    }

    if (!profileData.businessSize) {
      newErrors.businessSize = 'Business size is required';
    }

    if (!profileData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!profileData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!profileData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (profileData.services.length === 0) {
      newErrors.services = 'Please select at least one service';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onComplete(profileData);
  };

  const getServicesList = () => {
    return role === 'service_center' ? serviceCenterServices : partsVendorServices;
  };

  return (
    <div className="business-profile-form">
      <div className="form-header">
        <h2>Business Profile</h2>
        <p>Tell us about your {role === 'service_center' ? 'service center' : 'parts seller business'}</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <h3>Basic Information</h3>
          
          <div className="form-group">
            <label htmlFor="businessName">Business Name *</label>
            <input
              type="text"
              id="businessName"
              name="businessName"
              value={profileData.businessName}
              onChange={handleInputChange}
              placeholder="Enter your business name"
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
                value={profileData.businessType}
                onChange={handleInputChange}
                placeholder={role === 'service_center' ? 'Auto Repair Shop, Garage, etc.' : 'Parts Store, Distributor, etc.'}
                disabled={loading}
              />
              {errors.businessType && <span className="error">{errors.businessType}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="businessSize">Business Size *</label>
              <select
                id="businessSize"
                name="businessSize"
                value={profileData.businessSize}
                onChange={handleInputChange}
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
        </div>

        <div className="form-section">
          <h3>Contact Information</h3>
          
          <div className="form-group">
            <label htmlFor="address">Address *</label>
            <input
              type="text"
              id="address"
              name="address"
              value={profileData.address}
              onChange={handleInputChange}
              placeholder="Street address"
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
                value={profileData.city}
                onChange={handleInputChange}
                placeholder="City"
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
                value={profileData.postalCode}
                onChange={handleInputChange}
                placeholder="Postal code"
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="phone">Phone Number *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={profileData.phone}
                onChange={handleInputChange}
                placeholder="+94 11 234 5678"
                disabled={loading}
              />
              {errors.phone && <span className="error">{errors.phone}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="website">Website (Optional)</label>
              <input
                type="url"
                id="website"
                name="website"
                value={profileData.website}
                onChange={handleInputChange}
                placeholder="https://yourwebsite.com"
                disabled={loading}
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Business Details</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="taxId">Tax ID / VAT Number</label>
              <input
                type="text"
                id="taxId"
                name="taxId"
                value={profileData.taxId}
                onChange={handleInputChange}
                placeholder="Tax identification number"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="registrationNumber">Business Registration Number</label>
              <input
                type="text"
                id="registrationNumber"
                name="registrationNumber"
                value={profileData.registrationNumber}
                onChange={handleInputChange}
                placeholder="Registration number"
                disabled={loading}
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Services Offered *</h3>
          <p className="section-description">
            Select the services you {role === 'service_center' ? 'provide' : 'sell'}:
          </p>
          
          <div className="services-grid">
            {getServicesList().map(service => (
              <label key={service} className="service-checkbox">
                <input
                  type="checkbox"
                  checked={profileData.services.includes(service)}
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
            {Object.entries(profileData.operatingHours).map(([day, hours]) => (
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
          className="submit-btn"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Business Profile'}
        </button>
      </form>
    </div>
  );
};

export default BusinessProfileForm; 