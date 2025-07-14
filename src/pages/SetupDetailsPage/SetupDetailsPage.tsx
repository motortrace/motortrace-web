import React, { useState, useEffect } from 'react';
import { useSetupFlow } from '../../hooks/useSetupFlow';
import './SetupDetailsPage.scss';
import { useNavigate } from 'react-router-dom';
import { fetchUserStatus } from '../../utils/fetchUserStatus';

interface Vehicle {
  vehicleName: string;
  model: string;
  year: number;
  licensePlate: string;
  color: string;
  vehicleType: string;
}

interface BusinessDetails {
  businessName: string;
  address: string;
  businessRegistrationNumber: string;
  servicesOffered: string[];
  operatingHours: Record<string, string>;
}

interface ShopDetails {
  shopName: string;
  address: string;
  businessRegistrationNumber: string;
  partsCategories: string[];
  operatingHours: Record<string, string>;
}

interface CarOwnerDetails {
  carOwnerType: string;
  vehicles: Vehicle[];
}

const SetupDetailsPage = () => {
  const { completeSetupDetails } = useSetupFlow();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    phone: '',
    role: 'service_center', // Default to service center for desktop
    profileData: {
      vehicles: [{
        vehicleName: '',
        model: '',
        year: new Date().getFullYear(),
        licensePlate: '',
        color: '',
        vehicleType: 'sedan'
      }] as Vehicle[],
      businessDetails: {
        businessName: '',
        address: '',
        businessRegistrationNumber: '',
        servicesOffered: [],
        operatingHours: {}
      } as BusinessDetails,
      shopDetails: {
        shopName: '',
        address: '',
        businessRegistrationNumber: '',
        partsCategories: [],
        operatingHours: {}
      } as ShopDetails,
      carOwnerDetails: {
        carOwnerType: 'individual',
        vehicles: [{
          vehicleName: '',
          model: '',
          year: new Date().getFullYear(),
          licensePlate: '',
          color: '',
          vehicleType: 'sedan'
        }] as Vehicle[]
      } as CarOwnerDetails
    }
  });

  useEffect(() => {
    const checkStatus = async () => {
      const status = await fetchUserStatus();
      if (!status) {
        navigate('/login');
        return;
      }
      if (status.isSetupComplete) {
        navigate('/dashboard');
      } else {
        setCheckingStatus(false);
      }
    };
    checkStatus();
  }, [navigate]);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
      const isSmallScreen = window.innerWidth <= 768;
      setIsMobile(isMobileDevice || isSmallScreen);
      
      // If mobile, set default role to car_owner
      if (isMobileDevice || isSmallScreen) {
        setFormData(prev => ({
          ...prev,
          role: 'car_owner'
        }));
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleVehicleChange = (index: number, field: keyof Vehicle, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      profileData: {
        ...prev.profileData,
        vehicles: prev.profileData.vehicles.map((vehicle, i) => 
          i === index ? { ...vehicle, [field]: value } : vehicle
        )
      }
    }));
  };

  const handleCarOwnerVehicleChange = (index: number, field: keyof Vehicle, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      profileData: {
        ...prev.profileData,
        carOwnerDetails: {
          ...prev.profileData.carOwnerDetails,
          vehicles: prev.profileData.carOwnerDetails.vehicles.map((vehicle, i) => 
            i === index ? { ...vehicle, [field]: value } : vehicle
          )
        }
      }
    }));
  };

  const addVehicle = () => {
    setFormData(prev => ({
      ...prev,
      profileData: {
        ...prev.profileData,
        vehicles: [...prev.profileData.vehicles, {
          vehicleName: '',
          model: '',
          year: new Date().getFullYear(),
          licensePlate: '',
          color: '',
          vehicleType: 'sedan'
        }]
      }
    }));
  };

  const addCarOwnerVehicle = () => {
    setFormData(prev => ({
      ...prev,
      profileData: {
        ...prev.profileData,
        carOwnerDetails: {
          ...prev.profileData.carOwnerDetails,
          vehicles: [...prev.profileData.carOwnerDetails.vehicles, {
            vehicleName: '',
            model: '',
            year: new Date().getFullYear(),
            licensePlate: '',
            color: '',
            vehicleType: 'sedan'
          }]
        }
      }
    }));
  };

  const removeVehicle = (index: number) => {
    setFormData(prev => ({
      ...prev,
      profileData: {
        ...prev.profileData,
        vehicles: prev.profileData.vehicles.filter((_, i) => i !== index)
      }
    }));
  };

  const removeCarOwnerVehicle = (index: number) => {
    setFormData(prev => ({
      ...prev,
      profileData: {
        ...prev.profileData,
        carOwnerDetails: {
          ...prev.profileData.carOwnerDetails,
          vehicles: prev.profileData.carOwnerDetails.vehicles.filter((_, i) => i !== index)
        }
      }
    }));
  };

  const handleBusinessChange = (field: keyof BusinessDetails, value: any) => {
    setFormData(prev => ({
      ...prev,
      profileData: {
        ...prev.profileData,
        businessDetails: {
          ...prev.profileData.businessDetails,
          [field]: value
        }
      }
    }));
  };

  const handleShopChange = (field: keyof ShopDetails, value: any) => {
    setFormData(prev => ({
      ...prev,
      profileData: {
        ...prev.profileData,
        shopDetails: {
          ...prev.profileData.shopDetails,
          [field]: value
        }
      }
    }));
  };

  const handleCarOwnerChange = (field: keyof CarOwnerDetails, value: any) => {
    setFormData(prev => ({
      ...prev,
      profileData: {
        ...prev.profileData,
        carOwnerDetails: {
          ...prev.profileData.carOwnerDetails,
          [field]: value
        }
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await completeSetupDetails(formData);
      
      if (result && result.setupStatus.missingSteps.length === 0) {
        // All setup complete, redirect to dashboard
        window.location.href = '/dashboard';
      } else if (result?.setupStatus.redirectTo === '/setup/payment') {
        // Details complete, redirect to payment
        window.location.href = '/setup/payment';
      }
    } catch (err: any) {
      setError(err.message || 'Setup completion failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <div className="setup-details-page">
      <div className="setup-container">
        <div className="setup-header">
          <h1>Complete Your Setup</h1>
          <p>Welcome! Please provide some additional information to get started.</p>
          {isMobile && (
            <div className="mobile-notice">
              <p>📱 Mobile App - Car Owner Experience</p>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="setup-form">
          {/* Phone Number */}
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
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
          </div>

          {/* Role Selection */}
          <div className="form-group">
            <label htmlFor="role">I am a...</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              required
              disabled={loading}
            >
              {isMobile ? (
                <>
                  <option value="car_owner">Car Owner</option>
                  <option value="service_center">Service Center</option>
                  <option value="part_seller">Part Seller</option>
                </>
              ) : (
                <>
                  <option value="service_center">Service Center</option>
                  <option value="part_seller">Part Seller</option>
                </>
              )}
            </select>
            {!isMobile && (
              <p className="role-note">
                💡 Car Owner functionality is available exclusively on our mobile app
              </p>
            )}
          </div>

          {/* Car Owner Form - Mobile Only */}
          {formData.role === 'car_owner' && isMobile && (
            <div className="role-specific-form">
              <h3>Car Owner Information</h3>
              
              <div className="form-group">
                <label htmlFor="carOwnerType">Car Owner Type</label>
                <select
                  id="carOwnerType"
                  value={formData.profileData.carOwnerDetails.carOwnerType}
                  onChange={(e) => handleCarOwnerChange('carOwnerType', e.target.value)}
                  required
                >
                  <option value="individual">Individual Owner</option>
                  <option value="fleet_owner">Fleet Owner</option>
                  <option value="commercial_owner">Commercial Vehicle Owner</option>
                  <option value="rental_company">Rental Company</option>
                  <option value="dealership">Dealership</option>
                </select>
              </div>

              <h4>Vehicle Information</h4>
              {formData.profileData.carOwnerDetails.vehicles.map((vehicle, index) => (
                <div key={index} className="vehicle-form">
                  <div className="vehicle-header">
                    <h4>Vehicle {index + 1}</h4>
                    {formData.profileData.carOwnerDetails.vehicles.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeCarOwnerVehicle(index)}
                        className="remove-btn"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Vehicle Name</label>
                      <input
                        type="text"
                        value={vehicle.vehicleName}
                        onChange={(e) => handleCarOwnerVehicleChange(index, 'vehicleName', e.target.value)}
                        placeholder="My Car"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Model</label>
                      <input
                        type="text"
                        value={vehicle.model}
                        onChange={(e) => handleCarOwnerVehicleChange(index, 'model', e.target.value)}
                        placeholder="Toyota Camry"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Year</label>
                      <input
                        type="number"
                        value={vehicle.year}
                        onChange={(e) => handleCarOwnerVehicleChange(index, 'year', parseInt(e.target.value))}
                        min="1900"
                        max={new Date().getFullYear() + 1}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>License Plate</label>
                      <input
                        type="text"
                        value={vehicle.licensePlate}
                        onChange={(e) => handleCarOwnerVehicleChange(index, 'licensePlate', e.target.value)}
                        placeholder="ABC-1234"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Color</label>
                      <input
                        type="text"
                        value={vehicle.color}
                        onChange={(e) => handleCarOwnerVehicleChange(index, 'color', e.target.value)}
                        placeholder="Red"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Vehicle Type</label>
                      <select
                        value={vehicle.vehicleType}
                        onChange={(e) => handleCarOwnerVehicleChange(index, 'vehicleType', e.target.value)}
                        required
                      >
                        <option value="sedan">Sedan</option>
                        <option value="suv">SUV</option>
                        <option value="hatchback">Hatchback</option>
                        <option value="pickup">Pickup</option>
                        <option value="van">Van</option>
                        <option value="motorcycle">Motorcycle</option>
                        <option value="truck">Truck</option>
                        <option value="bus">Bus</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
              
              <button
                type="button"
                onClick={addCarOwnerVehicle}
                className="add-vehicle-btn"
              >
                + Add Another Vehicle
              </button>
            </div>
          )}

          {/* Service Center Form */}
          {formData.role === 'service_center' && (
            <div className="role-specific-form">
              <h3>Business Information</h3>
              
              <div className="form-group">
                <label>Business Name</label>
                <input
                  type="text"
                  value={formData.profileData.businessDetails.businessName}
                  onChange={(e) => handleBusinessChange('businessName', e.target.value)}
                  placeholder="ABC Auto Service"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Address</label>
                <textarea
                  value={formData.profileData.businessDetails.address}
                  onChange={(e) => handleBusinessChange('address', e.target.value)}
                  placeholder="123 Main Street, Colombo"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Business Registration Number</label>
                <input
                  type="text"
                  value={formData.profileData.businessDetails.businessRegistrationNumber}
                  onChange={(e) => handleBusinessChange('businessRegistrationNumber', e.target.value)}
                  placeholder="REG123456"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Services Offered</label>
                <div className="checkbox-group">
                  {['repair', 'diagnostics', 'maintenance', 'tire_service', 'oil_change', 'brake_service'].map(service => (
                    <label key={service} className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={formData.profileData.businessDetails.servicesOffered.includes(service)}
                        onChange={(e) => {
                          const current = formData.profileData.businessDetails.servicesOffered;
                          const updated = e.target.checked
                            ? [...current, service]
                            : current.filter(s => s !== service);
                          handleBusinessChange('servicesOffered', updated);
                        }}
                      />
                      {service.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Part Seller Form */}
          {formData.role === 'part_seller' && (
            <div className="role-specific-form">
              <h3>Shop Information</h3>
              
              <div className="form-group">
                <label>Shop Name</label>
                <input
                  type="text"
                  value={formData.profileData.shopDetails.shopName}
                  onChange={(e) => handleShopChange('shopName', e.target.value)}
                  placeholder="ABC Parts Shop"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Address</label>
                <textarea
                  value={formData.profileData.shopDetails.address}
                  onChange={(e) => handleShopChange('address', e.target.value)}
                  placeholder="123 Main Street, Colombo"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Business Registration Number</label>
                <input
                  type="text"
                  value={formData.profileData.shopDetails.businessRegistrationNumber}
                  onChange={(e) => handleShopChange('businessRegistrationNumber', e.target.value)}
                  placeholder="REG123456"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Parts Categories</label>
                <div className="checkbox-group">
                  {['engine_parts', 'brake_parts', 'electrical_parts', 'body_parts', 'accessories', 'tires'].map(category => (
                    <label key={category} className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={formData.profileData.shopDetails.partsCategories.includes(category)}
                        onChange={(e) => {
                          const current = formData.profileData.shopDetails.partsCategories;
                          const updated = e.target.checked
                            ? [...current, category]
                            : current.filter(c => c !== category);
                          handleShopChange('partsCategories', updated);
                        }}
                      />
                      {category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {error && <div className="error-message">{error}</div>}
          
          <button
            type="submit"
            className="submit-btn"
            disabled={loading}
          >
            {loading ? 'Completing Setup...' : 'Continue Setup'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SetupDetailsPage; 