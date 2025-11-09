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
  licensePlate?: string;
  vin?: string;
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
  }
  // ... rest of your mock data
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
  }
  // ... rest of your mock data
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
  }
  // ... rest of your mock data
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
  const [statistics, setStatistics] = useState<any>(null);
  const [loadingStats, setLoadingStats] = useState(false);

  // Helper function to map status
  const mapStatus = (status: string): any => {
    const statusMap: Record<string, any> = {
      'active': 'active',
      'available': 'available',
      'on_work': 'on_work',
      'suspended': 'suspended',
      'inactive': 'inactive',
      'unavailable': 'unavailable',
      'resigned': 'resigned'
    };
    return statusMap[status] || 'active';
  };

  // Transform API response to User interface
  const transformApiResponseToUser = (apiData: any, userType: string, employeeType?: string): User => {
    if (userType === 'employees') {
      if (employeeType === 'serviceAdvisors') {
        return {
          id: apiData.id,
          userType: 'service_advisor',
          status: mapStatus(apiData.userProfile?.status || 'active'),
          dateJoined: apiData.createdAt,
          email: apiData.userProfile?.email || '',
          phoneNumber: apiData.userProfile?.phone || '',
          name: apiData.userProfile?.name || 'Unknown',
          profilePicture: apiData.userProfile?.profileImage,
          role: 'Service Advisor',
          department: apiData.department || 'Unassigned',
          totalServices: apiData._count?.advisorWorkOrders || 0,
          bookingsHandled: apiData._count?.assignedAppointments || 0,
          jobCardsCreated: apiData._count?.advisorWorkOrders || 0,
          employeeId: apiData.employeeId,
          shiftTiming: '8:00 AM - 5:00 PM',
          supervisor: 'Manager',
          performanceRating: 4.5
        };
      } else if (employeeType === 'technicians') {
        return {
          id: apiData.id,
          userType: 'technician',
          status: mapStatus(apiData.userProfile?.status || 'active'),
          dateJoined: apiData.createdAt,
          email: apiData.userProfile?.email || '',
          phoneNumber: apiData.userProfile?.phone || '',
          name: apiData.userProfile?.name || 'Unknown',
          profilePicture: apiData.userProfile?.profileImage,
          role: 'Technician',
          department: 'Technical',
          totalServices: apiData._count?.laborItems || 0,
          specialization: apiData.specialization || 'General',
          jobsParticipated: apiData._count?.laborItems || 0,
          employeeId: apiData.employeeId,
          shiftTiming: '8:00 AM - 5:00 PM',
          supervisor: 'Lead Technician',
          performanceRating: 4.5
        };
      }
    } else if (userType === 'carUsers') {
      // Transform customer API response to CarUser interface
      return {
        id: apiData.id,
        userType: 'car_user',
        status: mapStatus(apiData.userProfile?.status || 'active'),
        dateJoined: apiData.createdAt,
        email: apiData.userProfile?.email || apiData.email || '',
        phoneNumber: apiData.userProfile?.phone || apiData.phone || '',
        name: apiData.userProfile?.name || apiData.name || 'Unknown',
        profilePicture: apiData.userProfile?.profileImage || apiData.profileImage,
        vehicles: apiData.vehicles || [],
        totalBookings: apiData._count?.workOrders || apiData.workOrders?.length || 0,
        totalPosts: 0
      };
    }

    // Fallback
    return mockCarUsers[0];
  };

  // Fetch customer statistics
  const fetchCustomerStatistics = async (customerId: string) => {
    try {
      setLoadingStats(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/customers/${customerId}/statistics`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setStatistics(result.data);
        }
      }
    } catch (error) {
      console.error('Failed to fetch customer statistics:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  // Fetch user data based on URL parameters
  useEffect(() => {
    const fetchUserData = async () => {
      if (!userType || !userId) {
        navigate('/admin/userManagement/carUsers');
        return;
      }

      try {
        setLoading(true);
        const token = localStorage.getItem('token');

        if (!token) {
          throw new Error('No authentication token found');
        }

        let endpoint = '';

        if (userType === 'employees') {
          if (employeeType === 'serviceAdvisors') {
            endpoint = `http://localhost:3000/service-advisors/${userId}`;
          } else if (employeeType === 'technicians') {
            endpoint = `http://localhost:3000/technicians/${userId}`;
          }
        } else if (userType === 'carUsers') {
          endpoint = `http://localhost:3000/customers/${userId}`;
        }

        if (!endpoint) {
          throw new Error('Invalid user type');
        }

        const response = await fetch(endpoint, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const result = await response.json();

        if (result.success) {
          // Transform the API response to match your frontend interface
          const userData = transformApiResponseToUser(result.data, userType, employeeType);
          setUser(userData);

          // Fetch statistics for car users
          if (userType === 'carUsers') {
            fetchCustomerStatistics(userId);
          }
        } else {
          throw new Error(result.error || 'Failed to fetch user data');
        }
      } catch (error: any) {
        console.error('Error fetching user data:', error);
        // Fallback to mock data if API fails
        fallbackToMockData();
      } finally {
        setLoading(false);
      }
    };

    const fallbackToMockData = () => {
      let foundUser: User | null = null;

      if (userType === 'employees') {
        if (employeeType === 'serviceAdvisors') {
          foundUser = mockServiceAdvisors.find(u => u.id === userId) || null;
        } else if (employeeType === 'technicians') {
          foundUser = mockTechnicians.find(u => u.id === userId) || null;
        }
      } else if (userType === 'carUsers') {
        foundUser = mockCarUsers.find(u => u.id === userId) || null;
      }

      if (!foundUser) {
        navigate(`/admin/userManagement/${userType === 'employees' ? `employees/${employeeType || 'serviceAdvisors'}` : userType}`);
        return;
      }

      setUser(foundUser);
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

  const handleToggleStatus = async () => {
    if (!user) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      let endpoint = '';
      let payload = {};

      if (user.userType === 'service_advisor') {
        endpoint = `http://localhost:3000/service-advisors/${user.id}/status`;
      } else if (user.userType === 'technician') {
        endpoint = `http://localhost:3000/technicians/${user.id}/status`;
      } else if (user.userType === 'car_user') {
        // For car users, we need to update the user profile status
        endpoint = `http://localhost:3000/users/${user.id}/status`;
      }

      const newStatus = (user.status === 'active' || user.status === 'available') ? 'suspended' : 'active';
      payload = { status: newStatus };

      const response = await fetch(endpoint, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Failed to update user status');
      }

      const result = await response.json();

      if (result.success) {
        // Update local state
        setUser(prev => prev ? { ...prev, status: newStatus } : null);
        onToggleUserStatus(user.id, user.status);
      } else {
        throw new Error(result.error || 'Failed to update status');
      }
    } catch (error: any) {
      console.error('Error updating user status:', error);
      alert('Failed to update user status: ' + error.message);
    } finally {
      setShowConfirmation(false);
    }
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

  const renderCustomerStatistics = () => {
    if (!user || user.userType !== 'car_user') return null;

    if (loadingStats) {
      return (
        <div className="profile-section customer-statistics">
          <h2 className="section-title">Customer Statistics</h2>
          <div className="loading">Loading statistics...</div>
        </div>
      );
    }

    if (!statistics) return null;

    return (
      <div className="profile-section customer-statistics">
        <h2 className="section-title">Customer Statistics</h2>
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-value">${statistics.financials?.totalSpent?.toLocaleString() || '0'}</div>
            <div className="stat-label">Total Spent</div>
          </div>
          
          <div className="stat-item">
            <div className="stat-value">{statistics.visits?.totalWorkOrders || 0}</div>
            <div className="stat-label">Total Services</div>
          </div>
          
          <div className="stat-item">
            <div className="stat-value">{statistics.vehicles?.totalVehicles || 0}</div>
            <div className="stat-label">Vehicles</div>
          </div>
          
          <div className="stat-item">
            <div className="stat-value">
              {statistics.customerProfile?.loyaltyScore ? `${statistics.customerProfile.loyaltyScore}/100` : 'N/A'}
            </div>
            <div className="stat-label">Loyalty Score</div>
          </div>
        </div>

        {/* Additional statistics details */}
        <div className="stats-details">
          <div className="stats-row">
            <span className="stats-label">Customer Since:</span>
            <span className="stats-value">
              {new Date(statistics.customer?.customerSince).toLocaleDateString()}
            </span>
          </div>
          
          {/* <div className="stats-row">
            <span className="stats-label">Last Visit:</span>
            <span className="stats-value">
              {statistics.visits?.lastVisit 
                ? new Date(statistics.visits.lastVisit).toLocaleDateString()
                : 'Never'
              }
            </span>
          </div> */}
          
          {/* <div className="stats-row">
            <span className="stats-label">Status:</span>
            <span className={`stats-value ${statistics.customerProfile?.isActiveCustomer ? 'active' : 'inactive'}`}>
              {statistics.customerProfile?.isActiveCustomer ? 'Active' : 'Inactive'}
            </span>
          </div> */}
        </div>
      </div>
    );
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
                        <div className="vehicle-details">
                          <strong>{vehicle.year} {vehicle.make} {vehicle.brand}</strong>
                          {vehicle.licensePlate && (
                            <span className="license-plate">Plate: {vehicle.licensePlate}</span>
                          )}
                          {vehicle.vin && (
                            <span className="vin">VIN: {vehicle.vin}</span>
                          )}
                        </div>
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
                {/* <span className="view-details">View Service History <Eye size={16} /></span> */}
              </div>
            </div>
            
            <div className="activity-item clickable" onClick={() => onViewDetails('appointments', user.id)}>
              <Calendar size={24} />
              <div className="activity-details">
                <h3>Appointments</h3>
                <span className="activity-count">
                  {carUser.totalBookings > 0 ? carUser.totalBookings : 'No appointments yet'}
                </span>
                {/* <span className="view-details">View All Appointments <Eye size={16} /></span> */}
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
                    {/* <span className="view-details">View All <Eye size={16} /></span> */}
                  </div>
                </div>
                <div className="activity-item clickable" onClick={() => onViewDetails('jobcards', user.id)}>
                  <Package size={24} />
                  <div className="activity-details">
                    <h3>Job Cards Created</h3>
                    <span className="activity-count">{employee.jobCardsCreated || 0}</span>
                    {/* <span className="view-details">View All <Eye size={16} /></span> */}
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
      {user.userType === 'car_user' && renderCustomerStatistics()}
      {renderActivityEngagement()}
    </div>
  );
};

export default UserProfile;