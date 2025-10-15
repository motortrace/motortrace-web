import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DetailsTab, StatsTab, CurrentWorkTab, WorkOrdersTab } from './TechnicianProfileTabs/index';
import './TechnicianProfile.scss';
import './TechnicianProfileTabs/TechnicianProfileTabs.scss';

interface TechnicianDetails {
  id: string;
  userProfileId: string;
  employeeId: string;
  specialization: string;
  certifications: string[];
  createdAt: string;
  updatedAt: string;
  userProfile: {
    id: string;
    name: string;
    phone: string;
    profileImage?: string;
    role: string;
  };
  inspectionsCount: number;
  qcChecksCount: number;
  laborItemsCount: number;
  partInstallationsCount: number;
  stats: {
    totalTasksCompleted: { count: number }[];
    totalHoursWorked: number;
    totalRevenueGenerated: number;
    averageTaskTime: number;
    efficiencyRating: number | null;
    currentWorkingStatus: boolean;
    activeTasksCount: { count: number }[];
    last30DaysTasks: { count: number }[];
    last30DaysHours: number;
    last30DaysRevenue: number;
  };
  currentWork: {
    activeLaborItems: any[];
    activeInspections: any[];
    activeParts: any[];
  };
  recentWorkOrders: any[];
}

type TabType = 'details' | 'stats' | 'current-work' | 'work-orders';

interface TabConfig {
  id: TabType;
  label: string;
  badge?: number;
  component: React.ComponentType<any>;
}

const TechnicianProfile: React.FC = () => {
  const { technicianId } = useParams<{ technicianId: string }>();
  const navigate = useNavigate();
  const [technician, setTechnician] = useState<TechnicianDetails | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('details');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTechnicianDetails();
  }, [technicianId]);

  const fetchTechnicianDetails = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`http://localhost:3000/technicians/${technicianId}/details`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch technician details');
      }

      const result = await response.json();
      setTechnician(result.data);
    } catch (err) {
      console.error('Error fetching technician details:', err);
      setError('Failed to load technician details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Tab configuration
  const tabs: TabConfig[] = [
    {
      id: 'details',
      label: 'Details',
      component: DetailsTab
    },
    {
      id: 'stats',
      label: 'Statistics',
      component: StatsTab
    },
    {
      id: 'current-work',
      label: 'Current Work',
      component: CurrentWorkTab
    },
    {
      id: 'work-orders',
      label: 'Work Orders',
      component: WorkOrdersTab
    },
  ];

  const getTabProps = (tabId: TabType) => {
    if (!technician) return {};
    switch (tabId) {
      case 'details':
        return { technician };
      case 'stats':
        return { stats: technician.stats };
      case 'current-work':
        return { currentWork: technician.currentWork };
      case 'work-orders':
        return { workOrders: technician.recentWorkOrders };
      default:
        return {};
    }
  };

  const ActiveTabComponent = tabs.find(tab => tab.id === activeTab)?.component;

  if (loading) {
    return (
      <div className="technician-profile-loading">
        <div className="loading-spinner"></div>
        <p>Loading technician profile...</p>
      </div>
    );
  }

  if (error || !technician) {
    return (
      <div className="technician-profile-error">
        <p>{error || 'Technician not found'}</p>
        <button onClick={handleBack} className="btn-back">Go Back</button>
      </div>
    );
  }

  return (
    <div className="technician-profile">
      {/* Header Section */}
      <div className="technician-profile__header">
        <div className="header-left">
          <button className="btn-back" onClick={handleBack}>
            <i className="bx bx-arrow-back"></i>
          </button>
          <div className="technician-avatar">
            {technician.userProfile.profileImage ? (
              <img src={technician.userProfile.profileImage} alt={technician.userProfile.name} />
            ) : (
              <div className="avatar-placeholder">{getInitials(technician.userProfile.name)}</div>
            )}
          </div>
          <div className="technician-info">
            <h1 className="technician-name">{technician.userProfile.name}</h1>
            <div className="technician-meta">
              <span className="badge badge-primary">{technician.specialization || 'Technician'}</span>
              <span className="employee-id">ID: {technician.employeeId}</span>
            </div>
          </div>
        </div>
        <div className="header-right">
          <button className="btn-secondary">
            <i className="bx bx-edit"></i>
            Edit
          </button>
          <button className="btn-primary">
            <i className="bx bx-phone"></i>
            Contact
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="technician-profile__tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
            {tab.badge && tab.badge > 0 && (
              <span className="tab-badge">{tab.badge}</span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="technician-profile__content">
        {ActiveTabComponent && <ActiveTabComponent {...getTabProps(activeTab)} />}
      </div>
    </div>
  );
};

export default TechnicianProfile;