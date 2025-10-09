import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DetailsTab, PaymentsTab } from './CustomerProfileTabs';
import './CustomerProfile.scss';

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  color?: string;
  vin?: string;
  mileage?: number;
  fuelType?: string;
  transmission?: string;
  imageUrl?: string;
  lastServiceDate?: string;
}

interface WorkOrder {
  id: string;
  workOrderNumber: string;
  status: 'open' | 'in-progress' | 'completed' | 'cancelled';
  requestedDate: string;
  amount: number;
  vehicle?: Vehicle;
}

interface Payment {
  id: string;
  date: string;
  amount: number;
  method: string;
  status: 'completed' | 'pending' | 'failed';
}

interface Conversation {
  id: string;
  date: string;
  subject: string;
  lastMessage: string;
  unread: boolean;
}

interface CustomerDetails {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  profileImage?: string | null;
  customerType?: string;
  location?: string;
  property?: string;
  joinedDate?: string;
  vehicles?: Vehicle[];
  workOrders?: WorkOrder[];
  payments?: Payment[];
  conversations?: Conversation[];
  totalSpent?: number;
  lastPaymentDate?: string;
  lastPaymentAmount?: number;
}

type TabType = 'details' | 'payments';

interface TabConfig {
  id: TabType;
  label: string;
  badge?: number;
  component: React.ComponentType<any>;
}

const CustomerProfile: React.FC = () => {
  const { customerId } = useParams<{ customerId: string }>();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<CustomerDetails | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('details');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCustomerDetails();
  }, [customerId]);

  const fetchCustomerDetails = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/customers/${customerId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch customer details');
      }

      const result = await response.json();
      setCustomer(result.data || result);
    } catch (err) {
      console.error('Error fetching customer details:', err);
      setError('Failed to load customer details. Please try again.');
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

  // Tab configuration - easy to extend with new tabs
  const tabs: TabConfig[] = [
    { 
      id: 'details', 
      label: 'Details',
      component: DetailsTab
    },
    { 
      id: 'payments', 
      label: 'Payments',
      component: PaymentsTab
    },
    // Add more tabs here as needed:
    // { id: 'workorders', label: 'Work Orders', component: WorkOrdersTab },
    // { id: 'history', label: 'Service History', component: ServiceHistoryTab },
    // { id: 'notes', label: 'Notes', component: NotesTab },
  ];

  const getTabProps = (tabId: TabType) => {
    if (!customer) return {};
    
    switch (tabId) {
      case 'details':
        return { customer };
      case 'payments':
        return { payments: customer.payments || [] };
      default:
        return {};
    }
  };

  const ActiveTabComponent = tabs.find(tab => tab.id === activeTab)?.component;

  if (loading) {
    return (
      <div className="customer-profile-loading">
        <div className="loading-spinner"></div>
        <p>Loading customer profile...</p>
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="customer-profile-error">
        <p>{error || 'Customer not found'}</p>
        <button onClick={handleBack} className="btn-back">Go Back</button>
      </div>
    );
  }

  return (
    <div className="customer-profile">
      {/* Header Section */}
      <div className="customer-profile__header">
        <div className="header-left">
          <button className="btn-back" onClick={handleBack}>
            <i className="bx bx-arrow-back"></i>
          </button>
          <div className="customer-avatar">
            {customer.profileImage ? (
              <img src={customer.profileImage} alt={customer.name} />
            ) : (
              <div className="avatar-placeholder">{getInitials(customer.name)}</div>
            )}
          </div>
          <div className="customer-info">
            <h1 className="customer-name">{customer.name}</h1>
            <div className="customer-meta">
              <span className="badge badge-primary">{customer.customerType || 'Current Customer'}</span>
            </div>
          </div>
        </div>
        <div className="header-right">
          <button className="btn-secondary">
            <i className="bx bx-edit"></i>
            Edit
          </button>
          <button className="btn-primary">
            <i className="bx bx-envelope"></i>
            Contact
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="customer-profile__tabs">
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
      <div className="customer-profile__content">
        {ActiveTabComponent && <ActiveTabComponent {...getTabProps(activeTab)} />}
      </div>
    </div>
  );
};

export default CustomerProfile;
