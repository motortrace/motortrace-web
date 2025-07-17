import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Clock,
  Car,
  FileText,
  Star,
  Package,
  Settings,
  Eye,
  MoreHorizontal,
  ArrowLeft
} from 'lucide-react';
import type { User as UserType, CarUser, ServiceCenter, SparePartsSeller } from '../../../types/UserTypes';
import './UserProfile.scss';

// Mock data - replace with actual data fetching
const mockCarUsers = [
  {
    id: '1',
    name: 'K. Gunasekara',
    email: 'gunasekara.k@email.com',
    phoneNumber: '+94 77 234 5678',
    userType: 'car_user' as const,
    status: 'active' as const,
    dateJoined: '2024-03-18',
    profilePicture: null,
    vehicles: [
      { id: '1', make: 'Toyota', brand: 'Camry', year: 2020 },
      { id: '2', make: 'Honda', brand: 'Civic', year: 2018 }
    ],
    totalBookings: 12,
    totalPosts: 5
  },
  {
    id: '2',
    name: 'S. Wijesinghe',
    email: 's.wijesinghe@email.com',
    phoneNumber: '+94 71 876 5432',
    userType: 'car_user' as const,
    status: 'active' as const,
    dateJoined: '2024-04-05',
    profilePicture: null,
    vehicles: [
      { id: '1', make: 'Nissan', brand: 'Altima', year: 2019 }
    ],
    totalBookings: 6,
    totalPosts: 3
  }
];

const mockServiceCenters = [
  {
    id: '1',
    businessName: 'AutoCare Plus',
    email: 'info@autocareplus.com',
    phoneNumber: '+94 11 234 5678',
    userType: 'service_center' as const,
    status: 'active' as const,
    dateJoined: '2023-08-15',
    businessLogo: null,
    location: 'Colombo 05',
    contactPersonName: 'Mr. Perera',
    operatingHours: '8:00 AM - 6:00 PM',
    totalServices: 145,
    completedServices: 132,
    averageRating: 4.5,
    services: []
  },
  {
    id: '2',
    businessName: 'Quick Fix Motors',
    email: 'contact@quickfix.com',
    phoneNumber: '+94 81 567 8901',
    userType: 'service_center' as const,
    status: 'active' as const,
    dateJoined: '2023-11-20',
    businessLogo: null,
    location: 'Kandy',
    contactPersonName: 'Ms. Silva',
    operatingHours: '9:00 AM - 5:00 PM',
    totalServices: 89,
    completedServices: 78,
    averageRating: 4.2,
    services: []
  }
];

const mockSparePartsSellers = [
  {
    id: '1',
    businessName: 'Parts World',
    email: 'sales@partsworld.com',
    phoneNumber: '+94 11 456 7890',
    userType: 'spare_parts_seller' as const,
    status: 'active' as const,
    dateJoined: '2023-07-10',
    businessLogo: null,
    shopLocation: 'Colombo 03',
    contactPersonName: 'Mr. Fernando',
    operatingHours: '8:30 AM - 7:00 PM',
    totalPartsListed: 1250,
    parts: []
  },
  {
    id: '2',
    businessName: 'AutoSpares Lanka',
    email: 'info@autospares.lk',
    phoneNumber: '+94 33 678 9012',
    userType: 'spare_parts_seller' as const,
    status: 'active' as const,
    dateJoined: '2023-09-25',
    businessLogo: null,
    shopLocation: 'Kurunegala',
    contactPersonName: 'Ms. Jayawardena',
    operatingHours: '9:00 AM - 6:00 PM',
    totalPartsListed: 890,
    parts: []
  }
];

interface UserProfileProps {
  onToggleUserStatus?: (userId: string, currentStatus: string) => void;
  onViewDetails?: (type: string, userId: string) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({
  onToggleUserStatus = () => { },
  onViewDetails = () => { }
}) => {
  const { userType, userId } = useParams<{ userType: string; userId: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserType | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [loading, setLoading] = useState(true);
  const [disableBtnVisibility, setDisableBtnVisibility] = useState('none');

  // Mapping between URL parameters and user types
  const userTypeMap: Record<string, string> = {
    'carUsers': 'car_user',
    'serviceCenters': 'service_center',
    'sparePartsSellers': 'spare_parts_seller'
  };

  // Fetch user data based on URL parameters
  useEffect(() => {
    const fetchUserData = () => {
      if (!userType || !userId) {
        navigate('/admin/userManagement/carUsers');
        return;
      }

      let foundUser: UserType | null = null;

      switch (userType) {
        case 'carUsers':
          foundUser = mockCarUsers.find(u => u.id === userId) || null;
          break;
        case 'serviceCenters':
          foundUser = mockServiceCenters.find(u => u.id === userId) || null;
          break;
        case 'sparePartsSellers':
          foundUser = mockSparePartsSellers.find(u => u.id === userId) || null;
          break;
        default:
          navigate('/admin/userManagement/carUsers');
          return;
      }

      if (!foundUser) {
        // User not found, redirect back to user management
        navigate(`/admin/userManagement/${userType}`);
        return;
      }

      setUser(foundUser);
      setLoading(false);
    };

    fetchUserData();
  }, [userType, userId, navigate]);

  const handleGoBack = () => {
    navigate(`/admin/userManagement/${userType}`);
  };

  const handleToggleStatus = () => {
    if (user) {
      onToggleUserStatus(user.id, user.status);
      // Update local state
      setUser(prev => prev ? { ...prev, status: prev.status === 'active' ? 'suspended' : 'active' } : null);
    }
    setShowConfirmation(false);
  };

  const getStatusBadgeClass = (status: string) => {
    return status === 'active' ? 'status-badge active' : 'status-badge suspended';
  };

  const getUserTypeLabel = (userType: string) => {
    switch (userType) {
      case 'car_user': return 'Car User';
      case 'service_center': return 'Service Center';
      case 'spare_parts_seller': return 'Spare Parts Seller';
      default: return 'User';
    }
  };

  const renderBasicInfo = () => {
    if (!user) return null;

    const isCarUser = user.userType === 'car_user';
    const displayName = isCarUser ? (user as CarUser).name : (user as ServiceCenter | SparePartsSeller).businessName;
    const profileImage = isCarUser
      ? (user as CarUser).profilePicture
      : (user as ServiceCenter | SparePartsSeller).businessLogo;

    return (
      <div className="profile-section basic-info">
        <div className="profile-header">
          <div className="profile-image-container">
            {profileImage ? (
              <img src={profileImage} alt={displayName} className="profile-image" />
            ) : (
              <div className="profile-image placeholder">
                <User size={48} />
              </div>
            )}
          </div>
          <div className="profile-details">
            <h1 className="profile-name">{displayName}</h1>
            <p className="user-type">{getUserTypeLabel(user.userType)}</p>
            <div className="status-container">
              <span className={getStatusBadgeClass(user.status)}>
                {user.status === 'active' ? 'Active' : 'Suspended'}
              </span>
            </div>
            <div className="join-date">
              <Calendar size={16} />
              <span>Joined {new Date(user.dateJoined).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</span>
            </div>
          </div>
          <div className="profile-actions">
      
            <button 
              className="more-actions-btn" 
              onClick={() =>
                setDisableBtnVisibility((prev) => (prev === 'none' ? 'block' : 'none'))
              }
            >
              <MoreHorizontal size={20} />
            </button>

            <button
              className={`toggle-status-btn ${user.status === 'active' ? 'disable' : 'enable'}`}
              onClick={() => setShowConfirmation(true)}
              style = {{display: disableBtnVisibility}}
            >
              {user.status === 'active' ? 'Disable User' : 'Enable User'}
            </button>
          </div>
        </div>

        {showConfirmation && (
          <div className="confirmation-modal">
            <div className="confirmation-content">
              <p>Are you sure you want to {user.status === 'active' ? 'disable' : 'enable'} this user?</p>
              <div className="confirmation-actions">
                <button onClick={handleToggleStatus} className="confirm-btn">
                  Yes, {user.status === 'active' ? 'Disable' : 'Enable'}
                </button>
                <button onClick={() => setShowConfirmation(false)} className="cancel-btn">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderContactInfo = () => {
    if (!user) return null;

    const isCarUser = user.userType === 'car_user';
    const location = !isCarUser
      ? user.userType === 'service_center'
        ? (user as ServiceCenter).location
        : (user as SparePartsSeller).shopLocation
      : null;
    const contactPerson = !isCarUser
      ? (user as ServiceCenter | SparePartsSeller).contactPersonName
      : null;

    return (
      <div className="profile-section contact-info">
        <h2 className="section-title">Contact Information</h2>
        <div className="contact-grid">
          {contactPerson && (
            <div className="contact-item">
              <User size={20} />
              <div>
                <label>Contact Person</label>
                <span>{contactPerson}</span>
              </div>
            </div>
          )}
          <div className="contact-item">
            <Mail size={20} />
            <div>
              <label>Email</label>
              <span>{user.email}</span>
            </div>
          </div>
          <div className="contact-item">
            <Phone size={20} />
            <div>
              <label>Phone</label>
              <span>{user.phoneNumber}</span>
            </div>
          </div>
          {location && (
            <div className="contact-item">
              <MapPin size={20} />
              <div>
                <label>Location</label>
                <span>{location}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderBusinessInfo = () => {
    if (!user || user.userType === 'car_user') return null;

    const businessUser = user as ServiceCenter | SparePartsSeller;
    const isServiceCenter = user.userType === 'service_center';

    return (
      <div className="profile-section business-info">
        <h2 className="section-title">Business Information</h2>
        <div className="business-grid">
          <div className="business-item">
            <Clock size={20} />
            <div>
              <label>Operating Hours</label>
              <span>{businessUser.operatingHours}</span>
            </div>
          </div>
          <div className="business-item">
            <Package size={20} />
            <div>
              <label>
                {isServiceCenter ? 'Services Offered' : 'Parts Listed'}
              </label>
              <span className="clickable" onClick={() => onViewDetails(
                isServiceCenter ? 'services' : 'parts',
                user.id
              )}>
                {isServiceCenter
                  ? (user as ServiceCenter).totalServices
                  : (user as SparePartsSeller).totalPartsListed
                } {isServiceCenter ? 'Services' : 'Parts'}
                <Eye size={16} />
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderActivityEngagement = () => {
    if (!user) return null;

    const isCarUser = user.userType === 'car_user';
    const isServiceCenter = user.userType === 'service_center';

    if (isCarUser) {
      const carUser = user as CarUser;
      return (
        <div className="profile-section activity-engagement">
          <h2 className="section-title">Activity & Engagement</h2>
          <div className="activity-grid">
            <div className="activity-item">
              <Car size={24} />
              <div className="activity-details">
                <h3>Vehicles Registered</h3>
                <span className="activity-count">{carUser.vehicles.length}</span>
                {carUser.vehicles.length > 0 && (
                  <div className="vehicle-list">
                    {carUser.vehicles.map((vehicle) => (
                      <div key={vehicle.id} className="vehicle-item">
                        {vehicle.year} {vehicle.make} {vehicle.brand}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="activity-item clickable" onClick={() => onViewDetails('bookings', user.id)}>
              <Settings size={24} />
              <div className="activity-details">
                <h3>Total Bookings</h3>
                <span className="activity-count">{carUser.totalBookings}</span>
                <span className="view-details">View All <Eye size={16} /></span>
              </div>
            </div>
            <div className="activity-item clickable" onClick={() => onViewDetails('posts', user.id)}>
              <FileText size={24} />
              <div className="activity-details">
                <h3>Posts Created</h3>
                <span className="activity-count">{carUser.totalPosts}</span>
                <span className="view-details">View All <Eye size={16} /></span>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (isServiceCenter) {
      const serviceCenter = user as ServiceCenter;
      return (
        <div className="profile-section activity-engagement">
          <h2 className="section-title">Activity & Engagement</h2>
          <div className="activity-grid">
            <div className="activity-item">
              <Settings size={24} />
              <div className="activity-details">
                <h3>Completed Services</h3>
                <span className="activity-count">{serviceCenter.completedServices}</span>
              </div>
            </div>
            <div className="activity-item">
              <Star size={24} />
              <div className="activity-details">
                <h3>Average Rating</h3>
                <span className="activity-count">{serviceCenter.averageRating.toFixed(1)}/5.0</span>
                <div className="rating-stars">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      fill={i < Math.floor(serviceCenter.averageRating) ? '#ffd700' : 'none'}
                      color="#ffd700"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  if (loading) {
    return (
      <div className="view-user-profile">
        <div className="loading">Loading user profile...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="view-user-profile">
        <div className="error">User not found</div>
      </div>
    );
  }

  return (
    <>
       <div className="view-user-profile">
        <div className="profile-navigation">
          <button onClick={handleGoBack} className="back-button">
            <ArrowLeft size={20} />
            Back to User Management
          </button>
        </div>

        {renderBasicInfo()}
        {renderContactInfo()}
        {renderBusinessInfo()}
        {renderActivityEngagement()}
      </div>
    </>
     
    
  );
};

export default UserProfile;