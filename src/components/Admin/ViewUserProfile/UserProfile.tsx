import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
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
  XCircle,
  Users,
  Wrench,
  Award,
  Briefcase,
  Target
} from 'lucide-react';
import './UserProfile.scss';

// Updated interfaces for your system
export interface BaseUser {
  id: string;
  userType: 'car_user' | 'service_advisor' | 'technician';
  status: 'active' | 'suspended' | 'inactive' | 'available' | 'on_work' | 'unavailable' | 'resigned';
  dateJoined: string;
  email: string;
  phoneNumber: string;
}

export interface CarUser extends BaseUser {
  userType: 'car_user';
  name: string;
  profilePicture?: string | null;
  vehicles: Vehicle[];
  totalBookings: number;
  totalPosts: number;
}

export interface Employee extends BaseUser {
  userType: 'service_advisor' | 'technician';
  name: string;
  profilePicture?: string | null;
  role: 'Service Advisor' | 'Technician';
  department: string;
  totalServices: number;
  // Service Advisor specific fields
  bookingsHandled?: number;
  jobCardsCreated?: number;
  // Technician specific fields
  specialization?: string;
  jobsParticipated?: number;
  // Common employee fields
  employeeId?: string;
  shiftTiming?: string;
  supervisor?: string;
  performanceRating?: number;
}

export interface Vehicle {
  id: string;
  make: string;
  brand: string;
  year: number;
  model?: string;
}

export type User = CarUser | Employee;

// Mock data for employees
const mockServiceAdvisors: Employee[] = [
  {
    id: '1',
    name: 'A. Fernando',
    email: 'a.fernando@mt.com',
    phoneNumber: '+94 77 123 4567',
    userType: 'service_advisor',
    role: 'Service Advisor',
    department: 'Customer Service',
    totalServices: 45,
    status: 'available',
    dateJoined: '2023-06-15',
    bookingsHandled: 156,
    jobCardsCreated: 89,
    employeeId: 'SA001',
    shiftTiming: '8:00 AM - 5:00 PM',
    supervisor: 'Manager Silva',
    performanceRating: 4.5
  },
  {
    id: '2',
    name: 'M. Perera',
    email: 'm.perera@mt.com',
    phoneNumber: '+94 71 234 5678',
    userType: 'service_advisor',
    role: 'Service Advisor',
    department: 'Customer Service',
    totalServices: 38,
    status: 'on_work',
    dateJoined: '2023-08-22',
    bookingsHandled: 142,
    jobCardsCreated: 67,
    employeeId: 'SA002',
    shiftTiming: '9:00 AM - 6:00 PM',
    supervisor: 'Manager Silva',
    performanceRating: 4.2
  },
  {
    id: '3',
    name: 'S. Silva',
    email: 's.silva@mt.com',
    phoneNumber: '+94 76 345 6789',
    userType: 'service_advisor',
    role: 'Service Advisor',
    department: 'Customer Service',
    totalServices: 52,
    status: 'unavailable',
    dateJoined: '2023-05-10',
    bookingsHandled: 203,
    jobCardsCreated: 124,
    employeeId: 'SA003',
    shiftTiming: '8:00 AM - 5:00 PM',
    supervisor: 'Manager Silva',
    performanceRating: 4.7
  },
  {
    id: '4',
    name: 'R. Mendis',
    email: 'r.mendis@mt.com',
    phoneNumber: '+94 78 456 7890',
    userType: 'service_advisor',
    role: 'Service Advisor',
    department: 'Customer Service',
    totalServices: 29,
    status: 'available',
    dateJoined: '2024-01-15',
    bookingsHandled: 78,
    jobCardsCreated: 45,
    employeeId: 'SA004',
    shiftTiming: '10:00 AM - 7:00 PM',
    supervisor: 'Manager Silva',
    performanceRating: 4.0
  },
  {
    id: '5',
    name: 'L. Bandara',
    email: 'l.bandara@mt.com',
    phoneNumber: '+94 72 567 8901',
    userType: 'service_advisor',
    role: 'Service Advisor',
    department: 'Customer Service',
    totalServices: 41,
    status: 'suspended',
    dateJoined: '2023-09-03',
    bookingsHandled: 134,
    jobCardsCreated: 78,
    employeeId: 'SA005',
    shiftTiming: '8:00 AM - 5:00 PM',
    supervisor: 'Manager Silva',
    performanceRating: 3.8
  }
];

const mockTechnicians: Employee[] = [
  {
    id: '6',
    name: 'K. Jayasuriya',
    email: 'k.jayasuriya@mt.com',
    phoneNumber: '+94 77 678 9012',
    userType: 'technician',
    role: 'Technician',
    department: 'Mechanical',
    totalServices: 67,
    status: 'available',
    dateJoined: '2023-04-12',
    specialization: 'Engine Repair',
    jobsParticipated: 89,
    employeeId: 'T001',
    shiftTiming: '7:00 AM - 4:00 PM',
    supervisor: 'Lead Technician Perera',
    performanceRating: 4.6
  },
  {
    id: '7',
    name: 'D. Weerasinghe',
    email: 'd.weerasinghe@mt.com',
    phoneNumber: '+94 71 789 0123',
    userType: 'technician',
    role: 'Technician',
    department: 'Electrical',
    totalServices: 58,
    status: 'on_work',
    dateJoined: '2023-07-08',
    specialization: 'Electrical Systems',
    jobsParticipated: 76,
    employeeId: 'T002',
    shiftTiming: '8:00 AM - 5:00 PM',
    supervisor: 'Lead Technician Kumar',
    performanceRating: 4.3
  },
  {
    id: '8',
    name: 'N. Rathnayake',
    email: 'n.rathnayake@mt.com',
    phoneNumber: '+94 76 890 1234',
    userType: 'technician',
    role: 'Technician',
    department: 'Mechanical',
    totalServices: 73,
    status: 'available',
    dateJoined: '2023-03-25',
    specialization: 'Transmission',
    jobsParticipated: 94,
    employeeId: 'T003',
    shiftTiming: '6:00 AM - 3:00 PM',
    supervisor: 'Lead Technician Perera',
    performanceRating: 4.8
  },
  {
    id: '9',
    name: 'H. Ekanayake',
    email: 'h.ekanayake@mt.com',
    phoneNumber: '+94 78 901 2345',
    userType: 'technician',
    role: 'Technician',
    department: 'Electrical',
    totalServices: 44,
    status: 'resigned',
    dateJoined: '2023-10-18',
    specialization: 'Diagnostics',
    jobsParticipated: 58,
    employeeId: 'T004',
    shiftTiming: '8:00 AM - 5:00 PM',
    supervisor: 'Lead Technician Kumar',
    performanceRating: 4.1
  },
  {
    id: '10',
    name: 'P. Wijewardena',
    email: 'p.wijewardena@mt.com',
    phoneNumber: '+94 72 012 3456',
    userType: 'technician',
    role: 'Technician',
    department: 'Mechanical',
    totalServices: 61,
    status: 'on_work',
    dateJoined: '2023-11-30',
    specialization: 'Brake Systems',
    jobsParticipated: 82,
    employeeId: 'T005',
    shiftTiming: '9:00 AM - 6:00 PM',
    supervisor: 'Lead Technician Perera',
    performanceRating: 4.4
  }
];

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

interface UserProfileProps {
  onToggleUserStatus?: (userId: string, currentStatus: string) => void;
  onViewDetails?: (type: string, userId: string) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({
  onToggleUserStatus = () => { },
  onViewDetails = () => { }
}) => {
  const { userId, employeeType } = useParams<{ userId: string; employeeType?: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract userType from the current path
  const pathSegments = location.pathname.split('/');
  let userType: string;
  
  // Check if this is an employee profile
  if (pathSegments.includes('employees')) {
    userType = 'employees';
  } else {
    userType = pathSegments[pathSegments.indexOf('userManagement') + 1];
  }
  
  const [user, setUser] = useState<User | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [loading, setLoading] = useState(true);
  const [disableBtnVisibility, setDisableBtnVisibility] = useState('none');

  // Fetch user data based on URL parameters
  useEffect(() => {
    const fetchUserData = () => {
      if (!userType || !userId) {
        navigate('/admin/userManagement/carUsers');
        return;
      }

      let foundUser: User | null = null;

      if (userType === 'employees') {
        // Handle employee profiles
        if (employeeType === 'serviceAdvisors') {
          foundUser = mockServiceAdvisors.find(u => u.id === userId) || null;
        } else if (employeeType === 'technicians') {
          foundUser = mockTechnicians.find(u => u.id === userId) || null;
        }
      } else if (userType === 'carUsers') {
        foundUser = mockCarUsers.find(u => u.id === userId) || null;
      }

      if (!foundUser) {
        // User not found, redirect back to user management
        if (userType === 'employees') {
          navigate(`/admin/userManagement/employees/${employeeType || 'serviceAdvisors'}`);
        } else {
          navigate(`/admin/userManagement/${userType}`);
        }
        return;
      }

      setUser(foundUser);
      setLoading(false);
    };

    fetchUserData();
  }, [userType, userId, employeeType, navigate]);

  const handleGoBack = () => {
    if (userType === 'employees') {
      navigate(`/admin/userManagement/employees/${employeeType || 'serviceAdvisors'}`);
    } else {
      navigate(`/admin/userManagement/${userType}`);
    }
  };

  const handleToggleStatus = () => {
    if (user) {
      onToggleUserStatus(user.id, user.status);
      // Update local state
      const newStatus = user.status === 'active' || user.status === 'available' ? 'suspended' : 'active';
      setUser(prev => prev ? { ...prev, status: newStatus } : null);
    }
    setShowConfirmation(false);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'active':
      case 'available':
        return 'status-badge active';
      case 'on_work':
        return 'status-badge on-work';
      case 'suspended':
        return 'status-badge suspended';
      case 'inactive':
      case 'unavailable':
        return 'status-badge inactive';
      case 'resigned':
        return 'status-badge resigned';
      default:
        return 'status-badge suspended';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Active';
      case 'available': return 'Available';
      case 'on_work': return 'On Work';
      case 'suspended': return 'Suspended';
      case 'inactive': return 'Inactive';
      case 'unavailable': return 'Unavailable';
      case 'resigned': return 'Resigned';
      default: return status;
    }
  };

  const getUserTypeLabel = (user: User) => {
    if (user.userType === 'car_user') return 'Car User';
    return (user as Employee).role;
  };

  const renderBasicInfo = () => {
    if (!user) return null;

    const isCarUser = user.userType === 'car_user';
    const displayName = user.name;
    const profileImage = user.profilePicture;

    return (
      <div className="profile-section basic-info">
        <div className="profile-header">
          <div className="profile-image-container">
            {profileImage ? (
              <img src={profileImage} alt={displayName} className="profile-image" />
            ) : (
              <div className="profile-image placeholder">
                {isCarUser ? <User size={48} /> : 
                 user.userType === 'service_advisor' ? <Users size={48} /> : <Wrench size={48} />}
              </div>
            )}
          </div>
          <div className="profile-details">
            <h1 className="profile-name">{displayName}</h1>
            <p className="user-type">{getUserTypeLabel(user)}</p>
            {/* {!isCarUser && (
              <>
                <p className="employee-id">Employee ID: {(user as Employee).employeeId}</p>
                <p className="department">{(user as Employee).department} Department</p>
              </>
            )} */}
            <div className="status-container">
              <span className={getStatusBadgeClass(user.status)}>
                {getStatusText(user.status)}
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
              className={`toggle-status-btn ${(user.status === 'active' || user.status === 'available') ? 'disable' : 'enable'}`}
              onClick={() => setShowConfirmation(true)}
              style={{ display: disableBtnVisibility }}
            >
              {(user.status === 'active' || user.status === 'available') ? 'Disable User' : 'Enable User'}
            </button>
          </div>
        </div>

        {showConfirmation && (
          <div className="confirmation-modal">
            <div className="confirmation-content">
              <p>Are you sure you want to {(user.status === 'active' || user.status === 'available') ? 'disable' : 'enable'} this user?</p>
              <div className="confirmation-actions">
                <button onClick={handleToggleStatus} className="confirm-btn">
                  Yes, {(user.status === 'active' || user.status === 'available') ? 'Disable' : 'Enable'}
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

    return (
      <div className="profile-section contact-info">
        <h2 className="section-title">Contact Information</h2>
        <div className="contact-grid">
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
          {user.userType !== 'car_user' && (
            <>
              <div className="contact-item">
                <Clock size={20} />
                <div>
                  <label>Shift Timing</label>
                  <span>{(user as Employee).shiftTiming}</span>
                </div>
              </div>
              <div className="contact-item">
                <User size={20} />
                <div>
                  <label>Supervisor</label>
                  <span>{(user as Employee).supervisor}</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  const renderEmployeeInfo = () => {
    if (!user || user.userType === 'car_user') return null;

    const employee = user as Employee;
    const isServiceAdvisor = employee.userType === 'service_advisor';

    return (
      <div className="profile-section business-info">
        <h2 className="section-title">Professional Information</h2>
        <div className="business-grid">
          <div className="business-item">
            <Briefcase size={20} />
            <div>
              <label>Department</label>
              <span>{employee.department}</span>
            </div>
          </div>
          {isServiceAdvisor ? (
            <div className="business-item">
              <Target size={20} />
              <div>
                <label>Specialization</label>
                <span>Customer Service & Booking Management</span>
              </div>
            </div>
          ) : (
            <div className="business-item">
              <Target size={20} />
              <div>
                <label>Specialization</label>
                <span>{employee.specialization || 'General Repair'}</span>
              </div>
            </div>
          )}
          <div className="business-item">
            <Award size={20} />
            <div>
              <label>Performance Rating</label>
              <span className="rating-display">
                {employee.performanceRating?.toFixed(1) || 'N/A'}/5.0
                {employee.performanceRating && (
                  <div className="rating-stars">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        fill={i < Math.floor(employee.performanceRating!) ? '#ffd700' : 'none'}
                        color="#ffd700"
                      />
                    ))}
                  </div>
                )}
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
    } else {
      const employee = user as Employee;
      const isServiceAdvisor = employee.userType === 'service_advisor';
      
      return (
        <div className="profile-section activity-engagement">
          <h2 className="section-title">Work Performance</h2>
          <div className="activity-grid">
            <div className="activity-item">
              <Settings size={24} />
              <div className="activity-details">
                <h3>Total Services</h3>
                <span className="activity-count">{employee.totalServices}</span>
              </div>
            </div>
            {isServiceAdvisor ? (
              <>
                <div className="activity-item clickable" onClick={() => onViewDetails('bookings', user.id)}>
                  <FileText size={24} />
                  <div className="activity-details">
                    <h3>Bookings Handled</h3>
                    <span className="activity-count">{employee.bookingsHandled || 0}</span>
                    <span className="view-details">View All <Eye size={16} /></span>
                  </div>
                </div>
                <div className="activity-item clickable" onClick={() => onViewDetails('jobcards', user.id)}>
                  <Package size={24} />
                  <div className="activity-details">
                    <h3>Job Cards Created</h3>
                    <span className="activity-count">{employee.jobCardsCreated || 0}</span>
                    <span className="view-details">View All <Eye size={16} /></span>
                  </div>
                </div>
              </>
            ) : (
              <div className="activity-item clickable" onClick={() => onViewDetails('jobs', user.id)}>
                <Wrench size={24} />
                <div className="activity-details">
                  <h3>Jobs Participated</h3>
                  <span className="activity-count">{employee.jobsParticipated || 0}</span>
                  <span className="view-details">View All <Eye size={16} /></span>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }
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
    <div className="view-user-profile">
      <div className="profile-navigation">
        <button onClick={handleGoBack} className="back-button">
          <ArrowLeft size={20} />
          Back to {userType === 'employees' ? 'Employee Management' : 'User Management'}
        </button>
      </div>

      {renderBasicInfo()}
      {renderContactInfo()}
      {renderEmployeeInfo()}
      {renderActivityEngagement()}
    </div>
  );
};

export default UserProfile;