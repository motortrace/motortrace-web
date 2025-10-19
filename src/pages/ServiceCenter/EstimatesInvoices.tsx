import React, { useState } from 'react';
import DashboardHeader from '../../layouts/DashboardHeader/DashboardHeader';
import MetricCard from '../../components/MetricCard/MetricCard';
import Table, { type TableColumn } from '../../components/Table/Table';
import './EstimatesInvoices.scss';

interface EstimateInvoice {
  id: string;
  documentNumber: string;
  type: 'estimate' | 'invoice';
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  vehicleInfo: string;
  vehicleYear: number;
  licensePlate: string;
  totalAmount: number;
  taxAmount: number;
  grandTotal: number;
  status: 'draft' | 'sent' | 'confirmed' | 'declined' | 'in-progress' | 'completed' | 'paid' | 'overdue' | 'cancelled';
  paymentStatus?: 'pending' | 'partial' | 'paid' | 'overdue';
  paymentMethod?: string;
  paymentDate?: string;
  dueDate?: string;
  createdDate: string;
  sentDate?: string;
  confirmedDate?: string;
  completedDate?: string;
  technician?: string;
  services: Array<{
    service: string;
    description: string;
    quantity: number;
    rate: number;
    amount: number;
  }>;
  notes?: string;
  isActive: boolean;
}

const getStatusBadge = (status: EstimateInvoice['status'], type: 'estimate' | 'invoice') => {
  const statusConfig = {
    draft: { class: 'status-draft', text: 'Draft' },
    sent: { class: 'status-sent', text: type === 'estimate' ? 'Sent' : 'Sent' },
    confirmed: { class: 'status-confirmed', text: 'Confirmed' },
    declined: { class: 'status-declined', text: 'Declined' },
    'in-progress': { class: 'status-in-progress', text: 'In Progress' },
    completed: { class: 'status-completed', text: 'Completed' },
    paid: { class: 'status-paid', text: 'Paid' },
    overdue: { class: 'status-overdue', text: 'Overdue' },
    cancelled: { class: 'status-cancelled', text: 'Cancelled' }
  };

  const config = statusConfig[status];
  return <span className={`status-badge ${config.class}`}>{config.text}</span>;
};

const getPaymentStatusBadge = (paymentStatus?: EstimateInvoice['paymentStatus']) => {
  if (!paymentStatus) return null;
  
  const paymentConfig = {
    pending: { class: 'payment-pending', text: 'Pending' },
    partial: { class: 'payment-partial', text: 'Partial' },
    paid: { class: 'payment-paid', text: 'Paid' },
    overdue: { class: 'payment-overdue', text: 'Overdue' }
  };

  const config = paymentConfig[paymentStatus];
  return <span className={`payment-badge ${config.class}`}>{config.text}</span>;
};

const EstimatesInvoices = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'estimates' | 'invoices'>('estimates');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPaymentStatus, setFilterPaymentStatus] = useState('all');
  const [filterDateRange, setFilterDateRange] = useState('all');

  // Get user role from localStorage
  const getUserRole = () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      return user?.role || 'serviceadvisor';
    } catch {
      return 'serviceadvisor';
    }
  };

  const userRole = getUserRole();
  const isServiceAdvisor = userRole === 'serviceadvisor' || userRole === 'service_advisor' || userRole === 'advisor';


  // Sample data with realistic estimates and invoices
  const [documents, setDocuments] = useState<EstimateInvoice[]>([
    {
      id: 'EST-2024-001',
      documentNumber: 'EST-2024-001',
      type: 'estimate',
      customerName: 'Sarah Johnson',
      customerPhone: '(555) 123-4567',
      customerEmail: 'sarah.johnson@email.com',
      vehicleInfo: '2020 Toyota Camry',
      vehicleYear: 2020,
      licensePlate: 'ABC-1234',
      totalAmount: 275.00,
      taxAmount: 22.00,
      grandTotal: 297.00,
      status: 'confirmed',
      createdDate: '2024-06-25',
      sentDate: '2024-06-25',
      confirmedDate: '2024-06-26',
      services: [
        { service: 'Brake Inspection', description: 'Comprehensive brake system inspection', quantity: 1, rate: 45.00, amount: 45.00 },
        { service: 'Front Brake Pad Replacement', description: 'Replace front brake pads with premium ceramic pads', quantity: 1, rate: 189.99, amount: 189.99 },
        { service: 'Brake Fluid Flush', description: 'Complete brake fluid replacement and system flush', quantity: 1, rate: 89.99, amount: 89.99 }
      ],
      isActive: true
    },
    {
      id: 'INV-2024-001',
      documentNumber: 'INV-2024-001',
      type: 'invoice',
      customerName: 'Benjamin Clarke',
      customerPhone: '(555) 234-5678',
      customerEmail: 'benjamin.clarke@email.com',
      vehicleInfo: '2021 Ford F-150 Lariat',
      vehicleYear: 2021,
      licensePlate: 'XYZ-5678',
      totalAmount: 147.80,
      taxAmount: 11.82,
      grandTotal: 159.62,
      status: 'paid',
      paymentStatus: 'paid',
      paymentMethod: 'Credit Card',
      paymentDate: '2024-06-28',
      dueDate: '2024-07-05',
      createdDate: '2024-06-28',
      completedDate: '2024-06-28',
      technician: 'Mike Johnson',
      services: [
        { service: 'Premium Oil Change', description: 'Full synthetic oil change with filter', quantity: 1, rate: 89.99, amount: 89.99 },
        { service: 'Air Filter Replacement', description: 'Replace engine air filter', quantity: 1, rate: 35.00, amount: 35.00 },
        { service: 'Multi-Point Inspection', description: 'Comprehensive vehicle inspection', quantity: 1, rate: 22.81, amount: 22.81 }
      ],
      isActive: true
    },
    {
      id: 'EST-2024-002',
      documentNumber: 'EST-2024-002',
      type: 'estimate',
      customerName: 'Olivia Martinez',
      customerPhone: '(555) 345-6789',
      customerEmail: 'olivia.martinez@email.com',
      vehicleInfo: '2019 Honda CR-V',
      vehicleYear: 2019,
      licensePlate: 'DEF-9012',
      totalAmount: 85.00,
      taxAmount: 6.80,
      grandTotal: 91.80,
      status: 'sent',
      createdDate: '2024-06-29',
      sentDate: '2024-06-29',
      services: [
        { service: 'Check Engine Light Diagnosis', description: 'Diagnostic scan and analysis', quantity: 1, rate: 85.00, amount: 85.00 }
      ],
      isActive: true
    },
    {
      id: 'INV-2024-002',
      documentNumber: 'INV-2024-002',
      type: 'invoice',
      customerName: 'Liam Garcia',
      customerPhone: '(555) 456-7890',
      customerEmail: 'liam.garcia@email.com',
      vehicleInfo: '2017 Chevrolet Malibu',
      vehicleYear: 2017,
      licensePlate: 'GHI-3456',
      totalAmount: 350.50,
      taxAmount: 28.04,
      grandTotal: 378.54,
      status: 'overdue',
      paymentStatus: 'overdue',
      dueDate: '2024-06-20',
      createdDate: '2024-06-15',
      completedDate: '2024-06-15',
      technician: 'Sarah Lee',
      services: [
        { service: 'Brake Pad Replacement', description: 'Replace all brake pads', quantity: 1, rate: 250.00, amount: 250.00 },
        { service: 'Brake Rotor Resurfacing', description: 'Resurface front brake rotors', quantity: 1, rate: 100.50, amount: 100.50 }
      ],
      isActive: true
    },
    {
      id: 'EST-2024-003',
      documentNumber: 'EST-2024-003',
      type: 'estimate',
      customerName: 'Sophia Rodriguez',
      customerPhone: '(555) 567-8901',
      customerEmail: 'sophia.rodriguez@email.com',
      vehicleInfo: '2022 Hyundai Palisade',
      vehicleYear: 2022,
      licensePlate: 'JKL-7890',
      totalAmount: 150.00,
      taxAmount: 12.00,
      grandTotal: 162.00,
      status: 'draft',
      createdDate: '2024-06-30',
      services: [
        { service: 'Full Vehicle Inspection', description: 'Comprehensive safety and performance inspection', quantity: 1, rate: 150.00, amount: 150.00 }
      ],
      isActive: true
    },
    {
      id: 'INV-2024-003',
      documentNumber: 'INV-2024-003',
      type: 'invoice',
      customerName: 'Zoe Stewart',
      customerPhone: '(555) 678-9012',
      customerEmail: 'zoe.stewart@email.com',
      vehicleInfo: '2020 Toyota Tacoma TRD Sport',
      vehicleYear: 2020,
      licensePlate: 'MNO-1234',
      totalAmount: 1095.84,
      taxAmount: 87.67,
      grandTotal: 1183.51,
      status: 'completed',
      paymentStatus: 'partial',
      paymentMethod: 'Cash',
      paymentDate: '2024-06-25',
      dueDate: '2024-07-02',
      createdDate: '2024-06-20',
      completedDate: '2024-06-22',
      technician: 'John Smith',
      services: [
        { service: 'ABS System Inspection', description: 'Anti-lock brake system diagnostic and repair', quantity: 1, rate: 150.00, amount: 150.00 },
        { service: 'Wheel Bearing Replacement', description: 'Replace front wheel bearings', quantity: 2, rate: 200.00, amount: 400.00 },
        { service: 'Suspension Repair', description: 'Front suspension component replacement', quantity: 1, rate: 545.84, amount: 545.84 }
      ],
      isActive: true
    }
  ]);

  // Calculate metrics based on active tab
  const estimates = documents.filter(doc => doc.type === 'estimate');
  const invoices = documents.filter(doc => doc.type === 'invoice');
  
  const totalEstimates = estimates.length;
  const totalInvoices = invoices.length;
  const pendingEstimates = estimates.filter(doc => doc.status === 'sent').length;
  const overdueInvoices = invoices.filter(doc => doc.paymentStatus === 'overdue').length;
  const totalRevenue = invoices
    .filter(doc => doc.paymentStatus === 'paid')
    .reduce((sum, doc) => sum + doc.grandTotal, 0);
  const pendingRevenue = invoices
    .filter(doc => doc.paymentStatus === 'pending')
    .reduce((sum, doc) => sum + doc.grandTotal, 0);

  // Filter documents based on search and filters
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.documentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.vehicleInfo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.licensePlate.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTab = activeTab === 'estimates' ? doc.type === 'estimate' : doc.type === 'invoice';
    const matchesStatus = filterStatus === 'all' || doc.status === filterStatus;
    const matchesPaymentStatus = filterPaymentStatus === 'all' || doc.paymentStatus === filterPaymentStatus;
    
    return matchesSearch && matchesTab && matchesStatus && matchesPaymentStatus;
  });

  const handleViewDocument = (docId: string) => {
    console.log('View document:', docId);
  };

  const handleEditDocument = (docId: string) => {
    console.log('Edit document:', docId);
  };

  const handleSendDocument = (docId: string) => {
    console.log('Send document:', docId);
  };

  const handleDeleteDocument = (docId: string) => {
    setDocuments(documents.filter(doc => doc.id !== docId));
  };

  const handleRecordPayment = (docId: string) => {
    console.log('Record payment for:', docId);
  };

  const columns: TableColumn<EstimateInvoice>[] = [
    { 
      key: 'documentNumber', 
      label: 'Document #', 
      sortable: true,
      render: (value: any, row: EstimateInvoice) => (
        <div className="document-number-cell">
          <div className="doc-type-badge">{row.type === 'estimate' ? 'EST' : 'INV'}</div>
          <div className="doc-number">{String(value)}</div>
        </div>
      )
    },
    { 
      key: 'customerName', 
      label: 'Customer', 
      sortable: true,
      render: (value: any, row: EstimateInvoice) => (
        <div className="customer-cell">
          <div className="customer-name">{String(value)}</div>
          <div className="customer-contact">{row.customerPhone}</div>
        </div>
      )
    },
    { 
      key: 'vehicleInfo', 
      label: 'Vehicle', 
      sortable: true,
      render: (value: any, row: EstimateInvoice) => (
        <div className="vehicle-cell">
          <div className="vehicle-info">{String(value)}</div>
          <div className="license-plate">{row.licensePlate}</div>
        </div>
      )
    },
    { 
      key: 'grandTotal', 
      label: 'Total Amount', 
      sortable: true, 
      align: 'right',
      render: (value: any) => `LKR${Number(value).toFixed(2)}`
    },
    { 
      key: 'status', 
      label: 'Status', 
      sortable: true, 
      align: 'center',
      render: (status: any, row: EstimateInvoice) => {
        // Show only one status badge - prioritize payment status for invoices
        if (row.type === 'invoice' && row.paymentStatus) {
          return (
            <div className="status-cell">
              {getPaymentStatusBadge(row.paymentStatus)}
            </div>
          );
        }
        return (
          <div className="status-cell">
            {getStatusBadge(status as EstimateInvoice['status'], row.type)}
          </div>
        );
      }
    },
    { 
      key: 'createdDate', 
      label: 'Created', 
      sortable: true, 
      align: 'center',
      render: (value: any) => {
        if (typeof value === 'string') {
          return new Date(value).toLocaleDateString();
        }
        return String(value);
      }
    },
    { 
      key: 'actions', 
      label: 'Actions', 
      align: 'center',
      render: (_: any, row: EstimateInvoice) => (
        <div className="action-buttons-cell">
          <button 
            className="btn-icon" 
            title="View" 
            onClick={() => handleViewDocument(row.id)}
          >
            <i className='bx bx-show'></i>
          </button>
          <button 
            className="btn-icon" 
            title="Edit" 
            onClick={() => handleEditDocument(row.id)}
          >
            <i className='bx bx-edit'></i>
          </button>
          {row.type === 'invoice' && row.paymentStatus === 'pending' && !isServiceAdvisor && (
            <button 
              className="btn-icon" 
              title="Record Payment" 
              onClick={() => handleRecordPayment(row.id)}
            >
              <i className='bx bx-credit-card'></i>
            </button>
          )}
          <button 
            className="btn-icon" 
            title="Delete" 
            onClick={() => handleDeleteDocument(row.id)}
          >
            <i className='bx bx-trash'></i>
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="estimates-invoices-page">
      <div className="page-header">
        <div className="page-actions">
          <button className="btn btn--secondary">
            <i className='bx bx-import'></i>
            Import
          </button>
          <button className="btn btn--secondary">
            <i className='bx bx-export'></i>
            Export
          </button>
          <button className="btn btn--secondary">
            <i className='bx bx-printer'></i>
            Print Report
          </button>
        </div>
      </div>

      <div className="metric-cards-row">
        <MetricCard
          title="Total Estimates"
          amount={totalEstimates.toString()}
          change={`${pendingEstimates} pending`}
          changeType={pendingEstimates > 0 ? "negative" : "positive"}
          period="awaiting approval"
        />
        <MetricCard
          title="Total Invoices"
          amount={totalInvoices.toString()}
          change={`${overdueInvoices} overdue`}
          changeType={overdueInvoices > 0 ? "negative" : "positive"}
          period="payment status"
        />
        <MetricCard
          title="Total Revenue"
          amount={`LKR${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          change={`LKR${pendingRevenue.toLocaleString()} pending`}
          changeType="positive"
          period="collected payments"
        />
        <MetricCard
          title="Conversion Rate"
          amount={`${Math.round((totalInvoices / (totalEstimates + totalInvoices)) * 100)}%`}
          change="estimates to invoices"
          changeType="positive"
          period="success rate"
        />
      </div>

      <div className="document-controls">
        {/* Tabs */}
        <div className="tabs-container" style={{ marginBottom: 24 }}>
          <div className="tabs" style={{ 
            display: 'flex', 
            borderBottom: '2px solid #e5e7eb',
            background: '#f8fafc',
            borderRadius: '8px 8px 0 0',
            padding: '4px',
            gap: '4px'
          }}>
            <button
              className={`tab-button ${activeTab === 'estimates' ? 'active' : ''}`}
              onClick={() => setActiveTab('estimates')}
              style={{
                flex: 1,
                padding: '12px 20px',
                border: 'none',
                borderRadius: '6px',
                background: activeTab === 'estimates' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                color: activeTab === 'estimates' ? '#fff' : '#6b7280',
                fontWeight: activeTab === 'estimates' ? 600 : 500,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: activeTab === 'estimates' ? '0 2px 4px rgba(102, 126, 234, 0.3)' : 'none',
                fontSize: '14px'
              }}
            >
              <i className='bx bx-file' style={{ marginRight: 8 }}></i>
              Estimates ({documents.filter(doc => doc.type === 'estimate').length})
            </button>
            <button
              className={`tab-button ${activeTab === 'invoices' ? 'active' : ''}`}
              onClick={() => setActiveTab('invoices')}
              style={{
                flex: 1,
                padding: '12px 20px',
                border: 'none',
                borderRadius: '6px',
                background: activeTab === 'invoices' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                color: activeTab === 'invoices' ? '#fff' : '#6b7280',
                fontWeight: activeTab === 'invoices' ? 600 : 500,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: activeTab === 'invoices' ? '0 2px 4px rgba(102, 126, 234, 0.3)' : 'none',
                fontSize: '14px'
              }}
            >
              <i className='bx bx-receipt' style={{ marginRight: 8 }}></i>
              Invoices ({documents.filter(doc => doc.type === 'invoice').length})
            </button>
          </div>
        </div>

        <div className="search-filters">
          <div className="search-box">
            <i className='bx bx-search search-icon'></i>
            <input
              type="text"
              placeholder="Search by customer, document number, vehicle, or license plate..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="confirmed">Confirmed</option>
            <option value="declined">Declined</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
            <option value="cancelled">Cancelled</option>
          </select>
          {activeTab === 'invoices' && (
            <select
              value={filterPaymentStatus}
              onChange={(e) => setFilterPaymentStatus(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Payment Status</option>
              <option value="pending">Pending</option>
              <option value="partial">Partial</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
            </select>
          )}
        </div>
        <div className="quick-actions">
          <button className="btn btn--ghost">
            <i className='bx bx-filter'></i>
            Advanced Filters
          </button>
          <button className="btn btn--ghost">
            <i className='bx bx-refresh'></i>
            Refresh
          </button>
        </div>
      </div>

      {activeTab === 'estimates' ? (
        <div className="estimates-cards-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
          {filteredDocuments.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px 20px', color: '#6b7280' }}>
              No estimates found matching your search criteria.
            </div>
          ) : (
            filteredDocuments.map((estimate) => (
              <EstimateCard
                key={estimate.id}
                estimate={estimate}
                onView={handleViewDocument}
                onEdit={handleEditDocument}
                onSend={handleSendDocument}
                onDelete={handleDeleteDocument}
              />
            ))
          )}
        </div>
      ) : (
        <Table 
          columns={columns}
          data={filteredDocuments}
          onRowClick={(doc) => handleViewDocument(doc.id)}
          emptyMessage="No invoices found matching your search criteria."
        />
      )}
    </div>
  );
};

const EstimateCard: React.FC<{ estimate: EstimateInvoice; onView: (id: string) => void; onEdit: (id: string) => void; onSend: (id: string) => void; onDelete: (id: string) => void }> = ({ 
  estimate, 
  onView, 
  onEdit, 
  onSend, 
  onDelete
}) => {
  const getVehicleImage = (_vehicleInfo: string) => {
    // You can implement logic to get vehicle image based on vehicle info
    // For now, return a default car image
    return 'https://cdn.pixabay.com/photo/2012/05/29/00/43/car-49278_1280.jpg';
  };

  return (
    <div className="estimate-card" style={{ 
      background: '#fff', 
      borderRadius: 12, 
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)', 
      border: '1px solid #e5e7eb', 
      overflow: 'hidden',
      transition: 'all 0.2s ease',
      cursor: 'pointer'
    }}
    onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'}
    onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'}
    >
      <div style={{ height: 120, background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img src={getVehicleImage(estimate.vehicleInfo)} alt={estimate.vehicleInfo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      <div style={{ padding: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          <h4 style={{ fontSize: 16, fontWeight: 600, color: '#1f2937', margin: 0 }}>{estimate.documentNumber}</h4>
          {getStatusBadge(estimate.status, estimate.type)}
        </div>
        <div style={{ fontSize: 14, color: '#6b7280', marginBottom: 4 }}>{estimate.customerName}</div>
        <div style={{ fontSize: 14, color: '#6b7280', marginBottom: 12 }}>{estimate.vehicleInfo} - {estimate.licensePlate}</div>
        <div style={{ fontSize: 18, fontWeight: 700, color: '#1f2937', marginBottom: 16 }}>LKR{estimate.grandTotal.toFixed(2)}</div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            className="btn btn--primary" 
            style={{ 
              flex: 1, 
              padding: '10px 16px', 
              fontSize: 14,
              fontWeight: 500,
              borderRadius: 8,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              color: '#fff',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onClick={() => onView(estimate.id)}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <i className='bx bx-show' style={{ marginRight: 6 }}></i>
            View
          </button>
          <button 
            className="btn btn--secondary" 
            style={{ 
              flex: 1, 
              padding: '10px 16px', 
              fontSize: 14,
              fontWeight: 500,
              borderRadius: 8,
              background: '#f8fafc',
              border: '1px solid #d1d5db',
              color: '#374151',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onClick={() => onEdit(estimate.id)}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#e5e7eb';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#f8fafc';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <i className='bx bx-edit' style={{ marginRight: 6 }}></i>
            Edit
          </button>
          {estimate.status === 'draft' && (
            <button 
              className="btn btn--secondary" 
              style={{ 
                flex: 1, 
                padding: '10px 16px', 
                fontSize: 14,
                fontWeight: 500,
                borderRadius: 8,
                background: '#f8fafc',
                border: '1px solid #d1d5db',
                color: '#374151',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onClick={() => onSend(estimate.id)}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#e5e7eb';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#f8fafc';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <i className='bx bx-send' style={{ marginRight: 6 }}></i>
              Send
            </button>
          )}
          <button 
            className="btn-icon" 
            title="Delete" 
            onClick={() => onDelete(estimate.id)}
            style={{ 
              padding: '10px', 
              background: '#ef4444', 
              color: '#fff', 
              border: 'none', 
              borderRadius: 8, 
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <i className='bx bx-trash'></i>
          </button>
        </div>
      </div>
    </div>
  );
}; 