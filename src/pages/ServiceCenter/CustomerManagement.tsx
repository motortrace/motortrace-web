import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CustomerManagement.scss';

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
}

interface Appointment {
  id: string;
  status: string;
  startTime: string;
}

interface WorkOrder {
  id: string;
  workOrderNumber: string;
  status: string;
}

interface UserProfile {
  id: string;
  name: string;
  phone: string;
  profileImage: string | null;
  role: string;
  isRegistrationComplete: boolean;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  createdAt?: string;
  userProfile?: UserProfile;
  vehicles?: Vehicle[];
  appointments?: Appointment[];
  workOrders?: WorkOrder[];
}

const CustomerManagement: React.FC = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Search, sort, filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('Name (A-Z)');
  
  // Pagination
  const [limit] = useState(50);
  const [offset] = useState(0);

  // Modal form state
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [formError, setFormError] = useState('');

  // Fetch customers from API with debounce for search
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchCustomers();
    }, 300); // 300ms debounce

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, limit, offset]);

  const fetchCustomers = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString(),
      });
      
      if (searchTerm) {
        params.append('search', searchTerm);
      }

      const response = await fetch(`http://localhost:3000/customers?${params}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch customers');
      }

      const result = await response.json();
      // Handle the response structure: { success, data: [...], message, pagination }
      setCustomers(result.data || []);
    } catch (err) {
      console.error('Error fetching customers:', err);
      setError('Failed to load customers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => setIsAddModalOpen(true);
  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    setForm({
      name: '',
      email: '',
      phone: '',
      address: '',
    });
    setFormError('');
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone) {
      setFormError('Please fill in all required fields.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/customers', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          address: form.address,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add customer');
      }

      // Refresh the customer list
      await fetchCustomers();
      handleCloseAddModal();
    } catch (err) {
      console.error('Error adding customer:', err);
      setFormError('Failed to add customer. Please try again.');
    }
  };

  const handleViewCustomer = (customerId: string) => {
    // Get the base path from current location (either /serviceadvisor or /manager)
    const currentPath = window.location.pathname;
    const basePath = currentPath.includes('/serviceadvisor') ? '/serviceadvisor' : '/manager';
    navigate(`${basePath}/customer/${customerId}`);
  };

  // --- Sorting Logic ---
  const sortedCustomers = [...customers].sort((a, b) => {
    switch (sortOption) {
      case 'Name (A-Z)':
        return a.name.localeCompare(b.name);
      case 'Name (Z-A)':
        return b.name.localeCompare(a.name);
      case 'Email (A-Z)':
        return a.email.localeCompare(b.email);
      case 'Email (Z-A)':
        return b.email.localeCompare(a.email);
      default:
        return 0;
    }
  });

  return (
    <div className="customer-management">
      {/* Add Boxicons CSS */}
      <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet' />
      
      {/* Page Header */}
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">Customer Management</h1>
          <p className="page-subtitle">Manage customer profiles and information</p>
        </div>
        <div className="header-actions">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <button className="action-btn primary" onClick={handleOpenAddModal}>
            <i className="bx bx-plus"></i>
            Add Customer
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-bar" style={{ display: 'flex', gap: 12, marginBottom: 18 }}>
        <select
          value={sortOption}
          onChange={e => setSortOption(e.target.value)}
          style={{ padding: '10px 12px', border: '2px solid #e5e7eb', borderRadius: 8, fontSize: 14, color: '#374151', background: 'white', fontFamily: 'Poppins' }}
        >
          <option value="Name (A-Z)">Sort by Name (A-Z)</option>
          <option value="Name (Z-A)">Sort by Name (Z-A)</option>
          <option value="Email (A-Z)">Sort by Email (A-Z)</option>
          <option value="Email (Z-A)">Sort by Email (Z-A)</option>
        </select>
      </div>

      {/* Loading and Error States */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '40px', fontFamily: 'Poppins', color: '#6b7280' }}>
          Loading customers...
        </div>
      )}
      {error && (
        <div style={{ textAlign: 'center', padding: '20px', fontFamily: 'Poppins', color: '#dc2626', background: '#fee2e2', borderRadius: 8, marginBottom: 18 }}>
          {error}
        </div>
      )}

      {/* Customer Table */}
      {!loading && !error && (
        <div className="customer-management__table" style={{ width: '100%', border: '2px solid #e5e7eb', borderRadius: 12, overflow: 'hidden' }}>
          <div className="customer-management__table-header" style={{ display: 'grid', gridTemplateColumns: '1.8fr 2.2fr 1.5fr 1fr 1fr 1fr 0.8fr', background: '#f8f9fa', padding: '16px 20px', gap: 16, fontWeight: 600, color: '#656970', fontFamily: 'Poppins', fontSize: 13 }}>
            <div>Name</div>
            <div>Email</div>
            <div>Phone</div>
            <div style={{ textAlign: 'center' }}>Vehicles</div>
            <div style={{ textAlign: 'center' }}>Appointments</div>
            <div style={{ textAlign: 'center' }}>Work Orders</div>
            <div style={{ textAlign: 'center' }}>Actions</div>
          </div>
          <div className="customer-management__table-body" style={{ display: 'flex', flexDirection: 'column' }}>
            {sortedCustomers.length > 0 ? (
              sortedCustomers.map(customer => (
                <div key={customer.id} className="customer-management__row" style={{ display: 'grid', gridTemplateColumns: '1.8fr 2.2fr 1.5fr 1fr 1fr 1fr 0.8fr', gap: 16, alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #f1f3f5', fontFamily: 'Poppins', fontSize: 14, color: '#374151' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      overflow: 'hidden',
                      flexShrink: 0,
                      background: customer.userProfile?.profileImage ? 'transparent' : '#e5e7eb',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      {customer.userProfile?.profileImage ? (
                        <img 
                          src={customer.userProfile.profileImage} 
                          alt={customer.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <i className="bx bx-user" style={{ fontSize: 22, color: '#9ca3af' }}></i>
                      )}
                    </div>
                    <span style={{ fontWeight: 600 }}>{customer.name}</span>
                  </div>
                  <div style={{ fontSize: 13, color: '#6b7280' }}>{customer.email}</div>
                  <div>{customer.phone}</div>
                  <div style={{ textAlign: 'center', fontWeight: 600, color: '#0ea5e9' }}>
                    {customer.vehicles?.length || 0}
                  </div>
                  <div style={{ textAlign: 'center', fontWeight: 600, color: '#8b5cf6' }}>
                    {customer.appointments?.length || 0}
                  </div>
                  <div style={{ textAlign: 'center', fontWeight: 600, color: '#10b981' }}>
                    {customer.workOrders?.length || 0}
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <button
                      onClick={() => handleViewCustomer(customer.id)}
                      style={{
                        background: '#f3f4f6',
                        border: 'none',
                        borderRadius: 6,
                        padding: '6px 10px',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'background 0.2s',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#e5e7eb'}
                      onMouseLeave={(e) => e.currentTarget.style.background = '#f3f4f6'}
                      title="View Details"
                    >
                      <i className="bx bx-box" style={{ fontSize: 18, color: '#374151' }}></i>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', fontFamily: 'Poppins', color: '#9ca3af' }}>
                No customers found
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Customer Modal */}
      {isAddModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.2)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'white', borderRadius: 12, padding: 36, minWidth: 420, maxWidth: 520, width: '100%', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', maxHeight: '90vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
            <h2 style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 22, marginBottom: 18 }}>Add New Customer</h2>
            <form onSubmit={handleAddCustomer} style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              <input name="name" value={form.name} onChange={handleFormChange} placeholder="Full Name *" style={inputStyle} required />
              <input name="email" value={form.email} onChange={handleFormChange} placeholder="Email *" style={inputStyle} type="email" required />
              <input name="phone" value={form.phone} onChange={handleFormChange} placeholder="Phone Number *" style={inputStyle} required />
              <input name="address" value={form.address} onChange={handleFormChange} placeholder="Address (optional)" style={inputStyle} />
              {formError && <div style={{ color: '#dc2626', fontSize: 13, marginTop: 8 }}>{formError}</div>}
              <div style={{ display: 'flex', gap: 12, marginTop: 18, justifyContent: 'flex-end' }}>
                <button type="button" onClick={handleCloseAddModal} style={{ ...buttonStyle, background: '#f3f4f6', color: '#374151' }}>Cancel</button>
                <button type="submit" style={{ ...buttonStyle, background: '#0ea5e9', color: 'white' }}>Add Customer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const inputStyle: React.CSSProperties = {
  padding: '10px 12px',
  border: '2px solid #e5e7eb',
  borderRadius: 8,
  fontSize: 15,
  fontFamily: 'Poppins',
  outline: 'none',
  marginBottom: 8,
};

const buttonStyle: React.CSSProperties = {
  border: 'none',
  borderRadius: 8,
  padding: '10px 20px',
  fontFamily: 'Poppins',
  fontWeight: 600,
  fontSize: 15,
  cursor: 'pointer',
};

export default CustomerManagement;
