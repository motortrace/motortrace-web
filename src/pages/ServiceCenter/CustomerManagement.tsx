import React, { useState } from 'react';
import './CustomerManagement.scss';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  vehicles: number;
  lastVisit: string;
  totalSpent: number;
  status: 'Active' | 'Inactive';
  address?: string;
}

const initialCustomers: Customer[] = [
  {
    id: 'cust1',
    name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+94 77 123 4567',
    vehicles: 2,
    lastVisit: '2024-10-05',
    totalSpent: 45000,
    status: 'Active',
    address: '123 Main St, Colombo',
  },
  {
    id: 'cust2',
    name: 'Jane Smith',
    email: 'jane.smith@email.com',
    phone: '+94 71 234 5678',
    vehicles: 1,
    lastVisit: '2024-09-28',
    totalSpent: 32000,
    status: 'Active',
    address: '456 Galle Rd, Colombo',
  },
  {
    id: 'cust3',
    name: 'Robert Johnson',
    email: 'robert.j@email.com',
    phone: '+94 76 345 6789',
    vehicles: 3,
    lastVisit: '2024-08-15',
    totalSpent: 78000,
    status: 'Active',
    address: '789 Kandy Rd, Kandy',
  },
  {
    id: 'cust4',
    name: 'Emily Davis',
    email: 'emily.davis@email.com',
    phone: '+94 70 456 7890',
    vehicles: 1,
    lastVisit: '2023-12-10',
    totalSpent: 15000,
    status: 'Inactive',
    address: '321 Negombo Rd, Negombo',
  },
];

const CustomerManagement: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Search, sort, filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('Name (A-Z)');
  const [statusFilter, setStatusFilter] = useState('All Statuses');

  // Modal form state
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    vehicles: '',
    status: 'Active',
    address: '',
  });
  const [error, setError] = useState('');

  const handleOpenAddModal = () => setIsAddModalOpen(true);
  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    setForm({
      name: '',
      email: '',
      phone: '',
      vehicles: '',
      status: 'Active',
      address: '',
    });
    setError('');
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone) {
      setError('Please fill in all required fields.');
      return;
    }
    const newCustomer: Customer = {
      id: Math.random().toString(36).substr(2, 9),
      name: form.name,
      email: form.email,
      phone: form.phone,
      vehicles: Number(form.vehicles) || 0,
      lastVisit: new Date().toISOString().split('T')[0],
      totalSpent: 0,
      status: form.status as Customer['status'],
      address: form.address,
    };
    setCustomers([...customers, newCustomer]);
    handleCloseAddModal();
  };

  // --- Filtering, Searching, Sorting Logic ---
  const filteredCustomers = customers.filter(customer => {
    // Status filter
    if (statusFilter !== 'All Statuses' && customer.status !== statusFilter) return false;
    // Search
    const search = searchTerm.toLowerCase();
    if (search) {
      const inName = customer.name.toLowerCase().includes(search);
      const inEmail = customer.email.toLowerCase().includes(search);
      const inPhone = customer.phone.toLowerCase().includes(search);
      const inAddress = (customer.address || '').toLowerCase().includes(search);
      return inName || inEmail || inPhone || inAddress;
    }
    return true;
  });

  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    switch (sortOption) {
      case 'Name (A-Z)':
        return a.name.localeCompare(b.name);
      case 'Name (Z-A)':
        return b.name.localeCompare(a.name);
      case 'Total Spent (High-Low)':
        return b.totalSpent - a.totalSpent;
      case 'Total Spent (Low-High)':
        return a.totalSpent - b.totalSpent;
      case 'Last Visit (Recent First)':
        return new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime();
      case 'Last Visit (Oldest First)':
        return new Date(a.lastVisit).getTime() - new Date(b.lastVisit).getTime();
      default:
        return 0;
    }
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const formatCurrency = (amount: number) => {
    return `Rs. ${amount.toLocaleString()}`;
  };

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
          <option value="Total Spent (High-Low)">Total Spent (High-Low)</option>
          <option value="Total Spent (Low-High)">Total Spent (Low-High)</option>
          <option value="Last Visit (Recent First)">Last Visit (Recent First)</option>
          <option value="Last Visit (Oldest First)">Last Visit (Oldest First)</option>
        </select>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          style={{ padding: '10px 12px', border: '2px solid #e5e7eb', borderRadius: 8, fontSize: 14, color: '#374151', background: 'white', fontFamily: 'Poppins' }}
        >
          <option value="All Statuses">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      {/* Customer Table */}
      <div className="customer-management__table" style={{ width: '100%', border: '2px solid #e5e7eb', borderRadius: 12, overflow: 'hidden' }}>
        <div className="customer-management__table-header" style={{ display: 'grid', gridTemplateColumns: '1.5fr 2fr 1.5fr 1fr 1fr 1.2fr 1fr', background: '#f8f9fa', padding: '16px 20px', gap: 16, fontWeight: 600, color: '#656970', fontFamily: 'Poppins', fontSize: 13 }}>
          <div>Name</div>
          <div>Email</div>
          <div>Phone</div>
          <div>Vehicles</div>
          <div>Last Visit</div>
          <div>Total Spent</div>
          <div>Status</div>
        </div>
        <div className="customer-management__table-body" style={{ display: 'flex', flexDirection: 'column' }}>
          {sortedCustomers.map(customer => (
            <div key={customer.id} className="customer-management__row" style={{ display: 'grid', gridTemplateColumns: '1.5fr 2fr 1.5fr 1fr 1fr 1.2fr 1fr', gap: 16, alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #f1f3f5', fontFamily: 'Poppins', fontSize: 14, color: '#374151' }}>
              <div style={{ fontWeight: 600 }}>{customer.name}</div>
              <div style={{ fontSize: 13, color: '#6b7280' }}>{customer.email}</div>
              <div>{customer.phone}</div>
              <div>{customer.vehicles}</div>
              <div>{formatDate(customer.lastVisit)}</div>
              <div style={{ fontWeight: 600, color: '#10b981' }}>{formatCurrency(customer.totalSpent)}</div>
              <div>
                <span style={{
                  fontWeight: 600,
                  padding: '4px 12px',
                  borderRadius: 12,
                  fontSize: 12,
                  backgroundColor: customer.status === 'Active' ? '#d1fae5' : '#f3f4f6',
                  color: customer.status === 'Active' ? '#10b981' : '#6b7280',
                }}>{customer.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Customer Modal */}
      {isAddModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.2)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'white', borderRadius: 12, padding: 36, minWidth: 420, maxWidth: 520, width: '100%', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', maxHeight: '90vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
            <h2 style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 22, marginBottom: 18 }}>Add New Customer</h2>
            <form onSubmit={handleAddCustomer} style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              <input name="name" value={form.name} onChange={handleFormChange} placeholder="Full Name *" style={inputStyle} required />
              <input name="email" value={form.email} onChange={handleFormChange} placeholder="Email *" style={inputStyle} type="email" required />
              <input name="phone" value={form.phone} onChange={handleFormChange} placeholder="Phone Number *" style={inputStyle} required />
              <input name="vehicles" value={form.vehicles} onChange={handleFormChange} placeholder="Number of Vehicles" style={inputStyle} type="number" min={0} />
              <input name="address" value={form.address} onChange={handleFormChange} placeholder="Address (optional)" style={inputStyle} />
              <select name="status" value={form.status} onChange={handleFormChange} style={inputStyle}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              {error && <div style={{ color: '#dc2626', fontSize: 13, marginTop: 8 }}>{error}</div>}
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
