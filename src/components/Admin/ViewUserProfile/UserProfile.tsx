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
  ArrowLeft,
  CreditCard,
  Clock as ClockIcon,
  CheckCircle,
  XCircle
} from 'lucide-react';
import type { User as UserType, CarUser, ServiceCenter, SparePartsSeller, Subscription } from '../../../types/UserTypes';
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
  },
  {
    id: '3',
    name: 'R. Abeywardena',
    email: 'abeywardena.r@email.com',
    phoneNumber: '+94 76 345 6789',
    userType: 'car_user' as const,
    status: 'suspended' as const,
    dateJoined: '2023-11-28',
    profilePicture: null,
    vehicles: [
      { id: '1', make: 'Suzuki', brand: 'Swift', year: 2021 },
      { id: '2', make: 'Toyota', brand: 'Corolla', year: 2019 }
    ],
    totalBookings: 20,
    totalPosts: 8
  },
  {
    id: '4',
    name: 'D. Herath',
    email: 'd.herath@email.com',
    phoneNumber: '+94 78 555 1234',
    userType: 'car_user' as const,
    status: 'active' as const,
    dateJoined: '2024-02-11',
    profilePicture: null,
    vehicles: [
      { id: '1', make: 'Honda', brand: 'City', year: 2020 },
      { id: '2', make: 'Nissan', brand: 'Sunny', year: 2018 }
    ],
    totalBookings: 14,
    totalPosts: 6
  },
  {
    id: '5',
    name: 'N. Rathnayake',
    email: 'n.rathnayake@email.com',
    phoneNumber: '+94 72 654 7890',
    userType: 'car_user' as const,
    status: 'suspended' as const,
    dateJoined: '2023-10-15',
    profilePicture: null,
    vehicles: [
      { id: '1', make: 'Toyota', brand: 'Vitz', year: 2017 }
    ],
    totalBookings: 7,
    totalPosts: 2
  },
  {
    id: '6',
    name: 'H. Peris',
    email: 'h.peris@email.com',
    phoneNumber: '+94 75 456 7890',
    userType: 'car_user' as const,
    status: 'active' as const,
    dateJoined: '2024-01-29',
    profilePicture: null,
    vehicles: [
      { id: '1', make: 'Suzuki', brand: 'Alto', year: 2021 },
      { id: '2', make: 'Honda', brand: 'Fit', year: 2019 }
    ],
    totalBookings: 18,
    totalPosts: 7
  },
  {
    id: '7',
    name: 'M. Silva',
    email: 'm.silva@email.com',
    phoneNumber: '+94 77 321 6549',
    userType: 'car_user' as const,
    status: 'active' as const,
    dateJoined: '2023-12-20',
    profilePicture: null,
    vehicles: [
      { id: '1', make: 'Toyota', brand: 'Aqua', year: 2020 },
      { id: '2', make: 'Nissan', brand: 'March', year: 2018 },
      { id: '3', make: 'Suzuki', brand: 'Wagon R', year: 2019 }
    ],
    totalBookings: 23,
    totalPosts: 10
  },
  {
    id: '8',
    name: 'L. Jayasuriya',
    email: 'l.jayasuriya@email.com',
    phoneNumber: '+94 71 912 3456',
    userType: 'car_user' as const,
    status: 'suspended' as const,
    dateJoined: '2023-09-12',
    profilePicture: null,
    vehicles: [
      { id: '1', make: 'Honda', brand: 'Civic', year: 2016 }
    ],
    totalBookings: 5,
    totalPosts: 1
  },
  {
    id: '9',
    name: 'P. Ekanayake',
    email: 'p.ekanayake@email.com',
    phoneNumber: '+94 76 789 0123',
    userType: 'car_user' as const,
    status: 'suspended' as const,
    dateJoined: '2023-08-03',
    profilePicture: null,
    vehicles: [
      { id: '1', make: 'Toyota', brand: 'Corolla', year: 2015 },
      { id: '2', make: 'Suzuki', brand: 'Swift', year: 2020 }
    ],
    totalBookings: 16,
    totalPosts: 4
  },
  {
    id: '10',
    name: 'T. Ranasinghe',
    email: 't.ranasinghe@email.com',
    phoneNumber: '+94 78 234 5671',
    userType: 'car_user' as const,
    status: 'active' as const,
    dateJoined: '2024-05-02',
    profilePicture: null,
    vehicles: [
      { id: '1', make: 'Nissan', brand: 'Leaf', year: 2022 }
    ],
    totalBookings: 9,
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
    services: [],
    currentSubscription: {
      id: 'sub_001',
      planId: 'plan_3m',
      planName: '3 Months Premium',
      startDate: '2024-01-15',
      endDate: '2024-04-15',
      status: 'active' as const,
      amount: 15000,
      autoRenew: true
    },
    subscriptionHistory: [
      {
        id: 'sub_001',
        planId: 'plan_3m',
        planName: '3 Months Premium',
        startDate: '2024-01-15',
        endDate: '2024-04-15',
        status: 'active' as const,
        amount: 15000,
        autoRenew: true
      },
      {
        id: 'sub_002',
        planId: 'plan_1m',
        planName: '1 Month Basic',
        startDate: '2023-12-15',
        endDate: '2024-01-15',
        status: 'expired' as const,
        amount: 5000,
        autoRenew: false
      }
    ]
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
    services: [],
    currentSubscription: {
      id: 'sub_003',
      planId: 'plan_1y',
      planName: '1 Year Premium',
      startDate: '2024-02-01',
      endDate: '2025-02-01',
      status: 'active' as const,
      amount: 50000,
      autoRenew: true
    },
    subscriptionHistory: [
      {
        id: 'sub_003',
        planId: 'plan_1y',
        planName: '1 Year Premium',
        startDate: '2024-02-01',
        endDate: '2025-02-01',
        status: 'active' as const,
        amount: 50000,
        autoRenew: true
      }
    ]
  },
  {
    id: '3',
    businessName: 'Royal Auto Services',
    email: 'royal@autoservices.lk',
    phoneNumber: '+94 66 456 7890',
    userType: 'service_center' as const,
    status: 'active' as const,
    dateJoined: '2024-02-10',
    businessLogo: null,
    location: 'Kurunegala',
    contactPersonName: 'Ms. Fernando',
    operatingHours: '7:00 AM - 8:00 PM',
    totalServices: 102,
    completedServices: 28,
    averageRating: 4.0,
    services: [],
    currentSubscription: {
      id: 'sub_005',
      planId: 'plan_6m',
      planName: '6 Months Premium',
      startDate: '2024-03-01',
      endDate: '2024-09-01',
      status: 'active' as const,
      amount: 30000,
      autoRenew: false
    },
    subscriptionHistory: [
      {
        id: 'sub_005',
        planId: 'plan_6m',
        planName: '6 Months Premium',
        startDate: '2024-03-01',
        endDate: '2024-09-01',
        status: 'active' as const,
        amount: 30000,
        autoRenew: false
      },
      {
        id: 'sub_006',
        planId: 'plan_3m',
        planName: '3 Months Basic',
        startDate: '2023-12-05',
        endDate: '2024-03-01',
        status: 'expired' as const,
        amount: 12000,
        autoRenew: false
      }
    ]
  },
  {
    id: '4',
    businessName: 'Elite Service Hub',
    email: 'hello@eliteservice.com',
    phoneNumber: '+94 91 345 6789',
    userType: 'service_center' as const,
    status: 'inactive' as const,
    dateJoined: '2024-01-05',
    businessLogo: null,
    location: 'Galle',
    contactPersonName: 'Mr. Bandara',
    operatingHours: '8:00 AM - 7:00 PM',
    totalServices: 67,
    completedServices: 58,
    averageRating: 3.8,
    services: [],
    currentSubscription: null,
    subscriptionHistory: [
      {
        id: 'sub_004',
        planId: 'plan_1m',
        planName: '1 Month Basic',
        startDate: '2024-01-05',
        endDate: '2024-02-05',
        status: 'expired' as const,
        amount: 5000,
        autoRenew: false
      }
    ]
  },
  {
    id: '5',
    businessName: 'Express Car Care',
    email: 'support@expresscarcare.com',
    phoneNumber: '+94 31 678 1234',
    userType: 'service_center' as const,
    status: 'suspended' as const,
    dateJoined: '2023-10-03',
    businessLogo: null,
    location: 'Negombo',
    contactPersonName: 'Mr. Kumar',
    operatingHours: '9:00 AM - 6:00 PM',
    totalServices: 58,
    completedServices: 45,
    averageRating: 3.9,
    services: [],
    currentSubscription: {
      id: 'sub_007',
      planId: 'plan_1m',
      planName: '1 Month Basic',
      startDate: '2024-02-15',
      endDate: '2024-03-15',
      status: 'active' as const,
      amount: 5000,
      autoRenew: true
    },
    subscriptionHistory: [
      {
        id: 'sub_007',
        planId: 'plan_1m',
        planName: '1 Month Basic',
        startDate: '2024-02-15',
        endDate: '2024-03-15',
        status: 'active' as const,
        amount: 5000,
        autoRenew: true
      }
    ]
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
    parts: [],
    currentSubscription: {
      id: 'sub_008',
      planId: 'plan_1y',
      planName: '1 Year Premium',
      startDate: '2024-01-01',
      endDate: '2025-01-01',
      status: 'active' as const,
      amount: 45000,
      autoRenew: true
    },
    subscriptionHistory: [
      {
        id: 'sub_008',
        planId: 'plan_1y',
        planName: '1 Year Premium',
        startDate: '2024-01-01',
        endDate: '2025-01-01',
        status: 'active' as const,
        amount: 45000,
        autoRenew: true
      },
      {
        id: 'sub_009',
        planId: 'plan_6m',
        planName: '6 Months Basic',
        startDate: '2023-07-10',
        endDate: '2024-01-01',
        status: 'expired' as const,
        amount: 25000,
        autoRenew: false
      }
    ]
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
    parts: [],
    currentSubscription: {
      id: 'sub_010',
      planId: 'plan_3m',
      planName: '3 Months Basic',
      startDate: '2024-02-01',
      endDate: '2024-05-01',
      status: 'active' as const,
      amount: 15000,
      autoRenew: true
    },
    subscriptionHistory: [
      {
        id: 'sub_010',
        planId: 'plan_3m',
        planName: '3 Months Basic',
        startDate: '2024-02-01',
        endDate: '2024-05-01',
        status: 'active' as const,
        amount: 15000,
        autoRenew: true
      },
      {
        id: 'sub_011',
        planId: 'plan_1m',
        planName: '1 Month Basic',
        startDate: '2024-01-01',
        endDate: '2024-02-01',
        status: 'expired' as const,
        amount: 5000,
        autoRenew: false
      }
    ]
  },
  {
    id: '3',
    businessName: 'Genuine Parts Co.',
    email: 'contact@genuineparts.com',
    phoneNumber: '+94 47 234 5678',
    userType: 'spare_parts_seller' as const,
    status: 'inactive' as const,
    dateJoined: '2023-12-05',
    businessLogo: null,
    shopLocation: 'Matara',
    contactPersonName: 'Mr. Silva',
    operatingHours: '8:00 AM - 6:00 PM',
    totalPartsListed: 567,
    parts: [],
    currentSubscription: null,
    subscriptionHistory: [
      {
        id: 'sub_012',
        planId: 'plan_1m',
        planName: '1 Month Basic',
        startDate: '2023-12-05',
        endDate: '2024-01-05',
        status: 'expired' as const,
        amount: 5000,
        autoRenew: false
      }
    ]
  },
  {
    id: '4',
    businessName: 'Spare Hub Lanka',
    email: 'sales@sparehublk.com',
    phoneNumber: '+94 21 345 6789',
    userType: 'spare_parts_seller' as const,
    status: 'active' as const,
    dateJoined: '2024-01-15',
    businessLogo: null,
    shopLocation: 'Jaffna',
    contactPersonName: 'Ms. Kumar',
    operatingHours: '9:00 AM - 7:00 PM',
    totalPartsListed: 745,
    parts: [],
    currentSubscription: {
      id: 'sub_013',
      planId: 'plan_6m',
      planName: '6 Months Premium',
      startDate: '2024-01-15',
      endDate: '2024-07-15',
      status: 'active' as const,
      amount: 28000,
      autoRenew: false
    },
    subscriptionHistory: [
      {
        id: 'sub_013',
        planId: 'plan_6m',
        planName: '6 Months Premium',
        startDate: '2024-01-15',
        endDate: '2024-07-15',
        status: 'active' as const,
        amount: 28000,
        autoRenew: false
      }
    ]
  },
  {
    id: '5',
    businessName: 'Auto Parts Express',
    email: 'info@autopartsexpress.lk',
    phoneNumber: '+94 38 567 8901',
    userType: 'spare_parts_seller' as const,
    status: 'suspended' as const,
    dateJoined: '2023-11-02',
    businessLogo: null,
    shopLocation: 'Kalutara',
    contactPersonName: 'Mr. Perera',
    operatingHours: '8:30 AM - 6:30 PM',
    totalPartsListed: 620,
    parts: [],
    currentSubscription: {
      id: 'sub_014',
      planId: 'plan_1m',
      planName: '1 Month Basic',
      startDate: '2024-02-20',
      endDate: '2024-03-20',
      status: 'active' as const,
      amount: 5000,
      autoRenew: true
    },
    subscriptionHistory: [
      {
        id: 'sub_014',
        planId: 'plan_1m',
        planName: '1 Month Basic',
        startDate: '2024-02-20',
        endDate: '2024-03-20',
        status: 'active' as const,
        amount: 5000,
        autoRenew: true
      }
    ]
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
    switch (status) {
      case 'active':
        return 'status-badge active';
      case 'suspended':
        return 'status-badge suspended';
      case 'inactive':
        return 'status-badge inactive';
      default:
        return 'status-badge suspended';
    }
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
                {user.status === 'active' ? 'Active' : user.status === 'suspended' ? 'Suspended' : 'Inactive'}
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

  const renderSubscriptionInfo = () => {
    if (!user || user.userType === 'car_user') return null;

    const businessUser = user as ServiceCenter | SparePartsSeller;
    const currentSubscription = businessUser.currentSubscription;
    const subscriptionHistory = businessUser.subscriptionHistory;

    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };

    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('en-LK', {
        style: 'currency',
        currency: 'LKR'
      }).format(amount);
    };

    const getDaysRemaining = (endDate: string) => {
      const end = new Date(endDate);
      const today = new Date();
      const diffTime = end.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    };

    return (
      <div className="profile-section subscription-info">
        <h2 className="section-title">Subscription Information</h2>
        
        {currentSubscription ? (
          <div className="current-subscription">
            <div className="subscription-header">
              <div className="subscription-status">
                <CheckCircle size={20} className="status-icon active" />
                <span className="status-text">Active Subscription</span>
              </div>
              <button 
                className="view-history-btn"
                onClick={() => onViewDetails('subscription-history', user.id)}
              >
                View History <Eye size={16} />
              </button>
            </div>
            
            <div className="subscription-details">
              <div className="plan-info">
                <h3>{currentSubscription.planName}</h3>
                <span className="plan-price">{formatCurrency(currentSubscription.amount)}</span>
              </div>
              
              <div className="subscription-dates">
                <div className="date-item">
                  <Calendar size={16} />
                  <div>
                    <label>Started</label>
                    <span>{formatDate(currentSubscription.startDate)}</span>
                  </div>
                </div>
                <div className="date-item">
                  <ClockIcon size={16} />
                  <div>
                    <label>Expires</label>
                    <span>{formatDate(currentSubscription.endDate)}</span>
                  </div>
                </div>
                <div className="date-item">
                  <ClockIcon size={16} />
                  <div>
                    <label>Days Remaining</label>
                    <span className={getDaysRemaining(currentSubscription.endDate) <= 7 ? 'warning' : ''}>
                      {getDaysRemaining(currentSubscription.endDate)} days
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="subscription-features">
                <div className="feature-item">
                  <CreditCard size={16} />
                  <span>Auto-renewal: {currentSubscription.autoRenew ? 'Enabled' : 'Disabled'}</span>
                </div>
                <div className="feature-item">
                  <Package size={16} />
                  <span>Total Subscriptions: {subscriptionHistory.length}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="no-subscription">
            <div className="no-subscription-header">
              <XCircle size={24} className="status-icon inactive" />
              <span className="status-text">No Active Subscription</span>
            </div>
            
            <div className="no-subscription-content">
              <p>This user does not have an active subscription plan.</p>
              
              {subscriptionHistory.length > 0 && (
                <div className="subscription-history-preview">
                  <p>Previous subscription expired on {formatDate(subscriptionHistory[subscriptionHistory.length - 1].endDate)}</p>
                  <button 
                    className="view-history-btn"
                    onClick={() => onViewDetails('subscription-history', user.id)}
                  >
                    View Subscription History <Eye size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
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
        {renderSubscriptionInfo()}
        {renderActivityEngagement()}
      </div>
    </>
     
    
  );
};

export default UserProfile;