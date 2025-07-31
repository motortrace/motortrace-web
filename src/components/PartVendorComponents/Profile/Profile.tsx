import React, { useState } from 'react';
import { MapPin, Phone, Mail, CheckCircle, Clock, Edit2, Star, Award, Package, Truck, Shield, Calendar, Users, TrendingUp, Camera, Save, X, Plus, Trash2, Globe, Facebook, Instagram, MessageCircle } from 'lucide-react';

import logo from '../../../assets/images/partsSellerLogo.jpg';
import cover from '../../../assets/images/partsSellerCover.jpeg';
import './Profile.scss';

interface SocialMedia {
  facebook: string;
  instagram: string;
  whatsapp: string;
}

interface BusinessHours {
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
}

interface Policies {
  returnPolicy: string;
  warrantyPolicy: string;
  shippingPolicy: string;
}

interface ShopData {
  name: string;
  owner: string;
  contactNumber: string;
  email: string;
  address: string;
  registeredDate: string;
  verified: boolean;
  operatingHours: string;
  status: string;
  productsCount: number;
  ordersCompleted: number;
  rating: number;
  totalReviews: number;
  logo: string;
  coverImage: string;
  description: string;
  specialties: string[];
  brandsCovered: string[];
  certifications: string[];
  website: string;
  socialMedia: SocialMedia;
  businessHours: BusinessHours;
  policies: Policies;
}

type EditingSection = 'basic' | 'cover' | 'logo' | 'description' | 'contact' | 'hours' | 'social' | 'specialties' | 'brands' | 'certifications' | 'policies' | '';

const PartsSellerProfile: React.FC = () => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingSection, setEditingSection] = useState<EditingSection>('');
  
  const [shopData, setShopData] = useState<ShopData>({
    name: 'AutoZone Parts Hub',
    owner: 'Sampath Motors',
    contactNumber: '+94 77 123 4567',
    email: 'autozoneparts@sampath.lk',
    address: 'No. 42, Highlevel Road, Maharagama, Sri Lanka',
    registeredDate: '2022-08-15',
    verified: true,
    operatingHours: 'Mon - Sat (9:00 AM - 6:00 PM)',
    status: 'Active',
    productsCount: 125,
    ordersCompleted: 342,
    rating: 4.6,
    totalReviews: 89,
    logo: logo,
    coverImage: cover,
    description: 'Premium automotive parts supplier specializing in genuine OEM and high-quality aftermarket parts for all vehicle makes and models. Serving Sri Lankan automotive industry since 2022.',
    specialties: ['Engine Components', 'Brake Systems', 'Suspension Parts', 'Electrical Components', 'Body Parts', 'Transmission Parts'],
    brandsCovered: ['Toyota', 'Honda', 'Nissan', 'Suzuki', 'Hyundai', 'Mazda', 'Mitsubishi', 'BMW', 'Mercedes', 'Audi'],
    certifications: ['ISO 9001:2015', 'Authorized Dealer', 'Quality Assured'],
    website: 'www.autozoneparts.lk',
    socialMedia: {
      facebook: '@autozonepartsLK',
      instagram: '@autozonepartsLK',
      whatsapp: '+94 77 123 4567'
    },
    businessHours: {
      monday: '9:00 AM - 6:00 PM',
      tuesday: '9:00 AM - 6:00 PM',
      wednesday: '9:00 AM - 6:00 PM',
      thursday: '9:00 AM - 6:00 PM',
      friday: '9:00 AM - 6:00 PM',
      saturday: '9:00 AM - 6:00 PM',
      sunday: 'Closed'
    },
    policies: {
      returnPolicy: '30 days return policy',
      warrantyPolicy: '1 year warranty on all parts',
      shippingPolicy: 'Free shipping on orders over Rs. 5000'
    }
  });

  const [tempData, setTempData] = useState<ShopData>({} as ShopData);

  const handleEditStart = (section: EditingSection): void => {
    setEditingSection(section);
    setIsEditing(true);
    setTempData({ ...shopData });
  };

  const handleEditSave = (): void => {
    setShopData({ ...tempData });
    setIsEditing(false);
    setEditingSection('');
  };

  const handleEditCancel = (): void => {
    setTempData({} as ShopData);
    setIsEditing(false);
    setEditingSection('');
  };

  const handleInputChange = (field: keyof ShopData, value: string | number | boolean): void => {
    setTempData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedInputChange = (parent: keyof ShopData, field: string, value: string): void => {
    setTempData(prev => ({
      ...prev,
      [parent]: {
        ...(prev[parent] as Record<string, any>),
        [field]: value
      }
    }));
  };

  const handleArrayInputChange = (field: keyof ShopData, index: number, value: string): void => {
    setTempData(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field: keyof ShopData): void => {
    setTempData(prev => ({
      ...prev,
      [field]: [...(prev[field] as string[]), '']
    }));
  };

  const removeArrayItem = (field: keyof ShopData, index: number): void => {
    setTempData(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((_, i) => i !== index)
    }));
  };

  const renderStars = (rating: number): JSX.Element[] => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        size={16} 
        className={i < Math.floor(rating) ? 'star-filled' : 'star-empty'}
        fill={i < Math.floor(rating) ? '#fbbf24' : 'none'}
      />
    ));
  };

  const currentData = isEditing ? tempData : shopData;

  return (
    <div className="parts-seller-profile">
      {/* Cover Section */}
      <div className="cover-section">
        <div className="cover-image">
          <img src={currentData.coverImage} alt="Shop Cover" />
          <button 
            className="edit-cover-btn"
            onClick={() => handleEditStart('cover')}
          >
            <Camera size={16} />
            Edit Cover
          </button>
        </div>
      </div>

      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-logo">
          <img src={currentData.logo} alt="Shop Logo" />
          <button 
            className="edit-logo-btn"
            onClick={() => handleEditStart('logo')}
          >
            <Camera size={12} />
          </button>
        </div>
        
        <div className="profile-info">
          <div className="shop-title">
            {isEditing && editingSection === 'basic' ? (
              <input
                type="text"
                value={currentData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="edit-input"
              />
            ) : (
              <h1 className="shop-name">
                {currentData.name}
                {currentData.verified && <CheckCircle size={20} className="verified-icon" />}
              </h1>
            )}
            
            {isEditing && editingSection === 'basic' ? (
              <input
                type="text"
                value={currentData.owner}
                onChange={(e) => handleInputChange('owner', e.target.value)}
                className="edit-input"
                placeholder="Owner name"
              />
            ) : (
              <p className="shop-owner">Owned by: {currentData.owner}</p>
            )}
          </div>
          
          <div className="shop-meta">
            <span className={`status-badge ${currentData.status.toLowerCase()}`}>
              {currentData.status}
            </span>
            <div className="rating-display">
              {renderStars(currentData.rating)}
              <span className="rating-text">
                {currentData.rating} ({currentData.totalReviews} reviews)
              </span>
            </div>
          </div>
        </div>
        
        <div className="profile-actions">
          {isEditing && editingSection === 'basic' ? (
            <div className="edit-actions">
              <button className="save-btn" onClick={handleEditSave}>
                <Save size={16} />
                Save
              </button>
              <button className="cancel-btn" onClick={handleEditCancel}>
                <X size={16} />
                Cancel
              </button>
            </div>
          ) : (
            <button 
              className="edit-btn"
              onClick={() => handleEditStart('basic')}
            >
              <Edit2 size={16} />
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Shop Description */}
      <div className="description-section">
        <div className="section-header">
          <h3>About Our Shop</h3>
          {isEditing && editingSection === 'description' ? (
            <div className="edit-actions">
              <button className="save-btn" onClick={handleEditSave}>
                <Save size={16} />
              </button>
              <button className="cancel-btn" onClick={handleEditCancel}>
                <X size={16} />
              </button>
            </div>
          ) : (
            <button 
              className="edit-section-btn"
              onClick={() => handleEditStart('description')}
            >
              <Edit2 size={14} />
            </button>
          )}
        </div>
        
        {isEditing && editingSection === 'description' ? (
          <textarea
            value={currentData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            className="edit-textarea"
            rows={4}
          />
        ) : (
          <p className="shop-description">{currentData.description}</p>
        )}
      </div>

      {/* Main Content */}
      <div className="profile-content">
        <div className="left-column">
          {/* Contact Information */}
          <div className="info-card">
            <div className="card-header">
              <h3>Contact Information</h3>
              {isEditing && editingSection === 'contact' ? (
                <div className="edit-actions">
                  <button className="save-btn" onClick={handleEditSave}>
                    <Save size={16} />
                  </button>
                  <button className="cancel-btn" onClick={handleEditCancel}>
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <button 
                  className="edit-section-btn"
                  onClick={() => handleEditStart('contact')}
                >
                  <Edit2 size={14} />
                </button>
              )}
            </div>
            
            <div className="info-list">
              <div className="info-item">
                <Phone size={16} />
                {isEditing && editingSection === 'contact' ? (
                  <input
                    type="tel"
                    value={currentData.contactNumber}
                    onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                    className="edit-input"
                  />
                ) : (
                  <span>{currentData.contactNumber}</span>
                )}
              </div>
              
              <div className="info-item">
                <Mail size={16} />
                {isEditing && editingSection === 'contact' ? (
                  <input
                    type="email"
                    value={currentData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="edit-input"
                  />
                ) : (
                  <span>{currentData.email}</span>
                )}
              </div>
              
              <div className="info-item">
                <MapPin size={16} />
                {isEditing && editingSection === 'contact' ? (
                  <input
                    type="text"
                    value={currentData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="edit-input"
                  />
                ) : (
                  <span>{currentData.address}</span>
                )}
              </div>
              
              <div className="info-item">
                <Globe size={16} />
                {isEditing && editingSection === 'contact' ? (
                  <input
                    type="url"
                    value={currentData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    className="edit-input"
                  />
                ) : (
                  <span>{currentData.website}</span>
                )}
              </div>
            </div>
          </div>

          {/* Business Hours */}
          <div className="info-card">
            <div className="card-header">
              <h3>Business Hours</h3>
              {isEditing && editingSection === 'hours' ? (
                <div className="edit-actions">
                  <button className="save-btn" onClick={handleEditSave}>
                    <Save size={16} />
                  </button>
                  <button className="cancel-btn" onClick={handleEditCancel}>
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <button 
                  className="edit-section-btn"
                  onClick={() => handleEditStart('hours')}
                >
                  <Edit2 size={14} />
                </button>
              )}
            </div>
            
            <div className="hours-list">
              {Object.entries(currentData.businessHours).map(([day, hours]) => (
                <div key={day} className="hours-item">
                  <span className="day">{day.charAt(0).toUpperCase() + day.slice(1)}</span>
                  {isEditing && editingSection === 'hours' ? (
                    <input
                      type="text"
                      value={hours}
                      onChange={(e) => handleNestedInputChange('businessHours', day, e.target.value)}
                      className="edit-input small"
                    />
                  ) : (
                    <span className="hours">{hours}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Social Media */}
          <div className="info-card">
            <div className="card-header">
              <h3>Social Media</h3>
              {isEditing && editingSection === 'social' ? (
                <div className="edit-actions">
                  <button className="save-btn" onClick={handleEditSave}>
                    <Save size={16} />
                  </button>
                  <button className="cancel-btn" onClick={handleEditCancel}>
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <button 
                  className="edit-section-btn"
                  onClick={() => handleEditStart('social')}
                >
                  <Edit2 size={14} />
                </button>
              )}
            </div>
            
            <div className="social-list">
              <div className="social-item">
                <Facebook size={16} />
                {isEditing && editingSection === 'social' ? (
                  <input
                    type="text"
                    value={currentData.socialMedia.facebook}
                    onChange={(e) => handleNestedInputChange('socialMedia', 'facebook', e.target.value)}
                    className="edit-input"
                  />
                ) : (
                  <span>{currentData.socialMedia.facebook}</span>
                )}
              </div>
              
              <div className="social-item">
                <Instagram size={16} />
                {isEditing && editingSection === 'social' ? (
                  <input
                    type="text"
                    value={currentData.socialMedia.instagram}
                    onChange={(e) => handleNestedInputChange('socialMedia', 'instagram', e.target.value)}
                    className="edit-input"
                  />
                ) : (
                  <span>{currentData.socialMedia.instagram}</span>
                )}
              </div>
              
              <div className="social-item">
                <MessageCircle size={16} />
                {isEditing && editingSection === 'social' ? (
                  <input
                    type="text"
                    value={currentData.socialMedia.whatsapp}
                    onChange={(e) => handleNestedInputChange('socialMedia', 'whatsapp', e.target.value)}
                    className="edit-input"
                  />
                ) : (
                  <span>{currentData.socialMedia.whatsapp}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="right-column">
          {/* Statistics */}
          <div className="stats-section">
            <div className="stat-card">
              <div className="stat-icon">
                <Package size={24} />
              </div>
              <div className="stat-content">
                <h4>Products</h4>
                <p>{currentData.productsCount}</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">
                <Truck size={24} />
              </div>
              <div className="stat-content">
                <h4>Orders Completed</h4>
                <p>{currentData.ordersCompleted}</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">
                <TrendingUp size={24} />
              </div>
              <div className="stat-content">
                <h4>Success Rate</h4>
                <p>98.5%</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">
                <Users size={24} />
              </div>
              <div className="stat-content">
                <h4>Happy Customers</h4>
                <p>1,250+</p>
              </div>
            </div>
          </div>

          {/* Specialties */}
          <div className="info-card">
            <div className="card-header">
              <h3>Parts Specialties</h3>
              {isEditing && editingSection === 'specialties' ? (
                <div className="edit-actions">
                  <button className="save-btn" onClick={handleEditSave}>
                    <Save size={16} />
                  </button>
                  <button className="cancel-btn" onClick={handleEditCancel}>
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <button 
                  className="edit-section-btn"
                  onClick={() => handleEditStart('specialties')}
                >
                  <Edit2 size={14} />
                </button>
              )}
            </div>
            
            <div className="specialty-tags">
              {currentData.specialties.map((specialty, index) => (
                <div key={index} className="specialty-tag">
                  {isEditing && editingSection === 'specialties' ? (
                    <div className="edit-tag">
                      <input
                        type="text"
                        value={specialty}
                        onChange={(e) => handleArrayInputChange('specialties', index, e.target.value)}
                        className="edit-input small"
                      />
                      <button
                        className="remove-tag-btn"
                        onClick={() => removeArrayItem('specialties', index)}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ) : (
                    specialty
                  )}
                </div>
              ))}
              
              {isEditing && editingSection === 'specialties' && (
                <button
                  className="add-tag-btn"
                  onClick={() => addArrayItem('specialties')}
                >
                  <Plus size={14} />
                  Add Specialty
                </button>
              )}
            </div>
          </div>

          {/* Brands Covered */}
          <div className="info-card">
            <div className="card-header">
              <h3>Brands We Cover</h3>
              {isEditing && editingSection === 'brands' ? (
                <div className="edit-actions">
                  <button className="save-btn" onClick={handleEditSave}>
                    <Save size={16} />
                  </button>
                  <button className="cancel-btn" onClick={handleEditCancel}>
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <button 
                  className="edit-section-btn"
                  onClick={() => handleEditStart('brands')}
                >
                  <Edit2 size={14} />
                </button>
              )}
            </div>
            
            <div className="brand-tags">
              {currentData.brandsCovered.map((brand, index) => (
                <div key={index} className="brand-tag">
                  {isEditing && editingSection === 'brands' ? (
                    <div className="edit-tag">
                      <input
                        type="text"
                        value={brand}
                        onChange={(e) => handleArrayInputChange('brandsCovered', index, e.target.value)}
                        className="edit-input small"
                      />
                      <button
                        className="remove-tag-btn"
                        onClick={() => removeArrayItem('brandsCovered', index)}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ) : (
                    brand
                  )}
                </div>
              ))}
              
              {isEditing && editingSection === 'brands' && (
                <button
                  className="add-tag-btn"
                  onClick={() => addArrayItem('brandsCovered')}
                >
                  <Plus size={14} />
                  Add Brand
                </button>
              )}
            </div>
          </div>

          {/* Certifications */}
          <div className="info-card">
            <div className="card-header">
              <h3>Certifications & Awards</h3>
              {isEditing && editingSection === 'certifications' ? (
                <div className="edit-actions">
                  <button className="save-btn" onClick={handleEditSave}>
                    <Save size={16} />
                  </button>
                  <button className="cancel-btn" onClick={handleEditCancel}>
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <button 
                  className="edit-section-btn"
                  onClick={() => handleEditStart('certifications')}
                >
                  <Edit2 size={14} />
                </button>
              )}
            </div>
            
            <div className="certification-list">
              {currentData.certifications.map((cert, index) => (
                <div key={index} className="certification-item">
                  <Award size={16} />
                  {isEditing && editingSection === 'certifications' ? (
                    <div className="edit-cert">
                      <input
                        type="text"
                        value={cert}
                        onChange={(e) => handleArrayInputChange('certifications', index, e.target.value)}
                        className="edit-input"
                      />
                      <button
                        className="remove-cert-btn"
                        onClick={() => removeArrayItem('certifications', index)}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ) : (
                    <span>{cert}</span>
                  )}
                </div>
              ))}
              
              {isEditing && editingSection === 'certifications' && (
                <button
                  className="add-cert-btn"
                  onClick={() => addArrayItem('certifications')}
                >
                  <Plus size={14} />
                  Add Certification
                </button>
              )}
            </div>
          </div>

          {/* Policies */}
          <div className="info-card">
            <div className="card-header">
              <h3>Our Policies</h3>
              {isEditing && editingSection === 'policies' ? (
                <div className="edit-actions">
                  <button className="save-btn" onClick={handleEditSave}>
                    <Save size={16} />
                  </button>
                  <button className="cancel-btn" onClick={handleEditCancel}>
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <button 
                  className="edit-section-btn"
                  onClick={() => handleEditStart('policies')}
                >
                  <Edit2 size={14} />
                </button>
              )}
            </div>
            
            <div className="policy-list">
              <div className="policy-item">
                <Shield size={16} />
                <div>
                  <strong>Return Policy:</strong>
                  {isEditing && editingSection === 'policies' ? (
                    <input
                      type="text"
                      value={currentData.policies.returnPolicy}
                      onChange={(e) => handleNestedInputChange('policies', 'returnPolicy', e.target.value)}
                      className="edit-input"
                    />
                  ) : (
                    <span>{currentData.policies.returnPolicy}</span>
                  )}
                </div>
              </div>
              
              <div className="policy-item">
                <Shield size={16} />
                <div>
                  <strong>Warranty:</strong>
                  {isEditing && editingSection === 'policies' ? (
                    <input
                      type="text"
                      value={currentData.policies.warrantyPolicy}
                      onChange={(e) => handleNestedInputChange('policies', 'warrantyPolicy', e.target.value)}
                      className="edit-input"
                    />
                  ) : (
                    <span>{currentData.policies.warrantyPolicy}</span>
                  )}
                </div>
              </div>
              
              <div className="policy-item">
                <Truck size={16} />
                <div>
                  <strong>Shipping:</strong>
                  {isEditing && editingSection === 'policies' ? (
                    <input
                      type="text"
                      value={currentData.policies.shippingPolicy}
                      onChange={(e) => handleNestedInputChange('policies', 'shippingPolicy', e.target.value)}
                      className="edit-input"
                    />
                  ) : (
                    <span>{currentData.policies.shippingPolicy}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartsSellerProfile;