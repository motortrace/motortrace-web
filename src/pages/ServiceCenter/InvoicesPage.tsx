import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Table, { type TableColumn } from '../../components/Table/Table';
import './InvoicesPage.scss';
import { useAuth } from '../../hooks/useAuth';

// Invoice interface based on the API response
interface Invoice {
  id: string;
  invoiceNumber: string;
  workOrderId: string;
  issueDate: string;
  dueDate: string;
  status: 'DRAFT' | 'SENT' | 'OVERDUE' | 'CANCELLED';
  subtotalServices: number;
  subtotalLabor: number;
  subtotalParts: number;
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  notes: string;
  terms: string | null;
  pdfUrl: string | null;
  createdAt: string;
  updatedAt: string;
  workOrder: {
    id: string;
    workOrderNumber: string;
    createdAt: string;
    updatedAt: string;
    customerId: string;
    vehicleId: string;
    appointmentId: string;
    advisorId: string;
    status: string;
    jobType: string;
    priority: string;
    source: string;
    complaint: string;
    odometerReading: number;
    warrantyStatus: string;
    estimatedTotal: number | null;
    estimateNotes: string | null;
    estimateApproved: boolean;
    subtotalLabor: string;
    subtotalParts: string;
    discountAmount: number | null;
    taxAmount: number | null;
    totalAmount: string;
    paidAmount: string;
    openedAt: string | null;
    promisedAt: string | null;
    closedAt: string | null;
    workflowStep: string;
    internalNotes: string;
    customerNotes: string;
    invoiceNumber: string | null;
    finalizedAt: string | null;
    paymentStatus: string;
    warrantyClaimNumber: string | null;
    thirdPartyApprovalCode: string | null;
    campaignId: string | null;
    servicePackageId: string | null;
    customerSignature: string | null;
    customerFeedback: string | null;
    customer: {
      id: string;
      name: string;
      email: string;
      phone: string;
    };
    vehicle: {
      id: string;
      make: string;
      model: string;
      year: number;
      licensePlate: string;
    };
  };
}

const getStatusBadge = (status: string) => {
  const statusConfig = {
    'DRAFT': { class: 'status-draft', text: 'Draft', color: '#6b7280' },
    'SENT': { class: 'status-sent', text: 'Sent', color: '#3b82f6' },
    'OVERDUE': { class: 'status-overdue', text: 'Overdue', color: '#ef4444' },
    'CANCELLED': { class: 'status-cancelled', text: 'Cancelled', color: '#6b7280' }
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['DRAFT'];
  
  return (
    <span 
      className={`status-badge ${config.class}`}
      style={{ 
        backgroundColor: `${config.color}20`, 
        color: config.color,
        border: `1px solid ${config.color}40`
      }}
    >
      {config.text}
    </span>
  );
};

const InvoicesPage = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCustomer, setFilterCustomer] = useState('all');
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Get the base path from current location (e.g., '/serviceadvisor', '/manager', etc.)
  const getBasePath = () => {
    const pathSegments = window.location.pathname.split('/');
    return `/${pathSegments[1]}`; // Gets the first segment after the root
  };

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:3000/invoices', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then((response) => {
        // Handle the API response structure with success/data wrapper
        const data = response.success ? response.data : response;
        setInvoices(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching invoices:', err);
        setError('Failed to fetch invoices');
        setLoading(false);
      });
  }, [token]);

  // Unique filter values
  const uniqueCustomers = [...new Set(invoices.map((invoice: Invoice) => 
    invoice.workOrder?.customer?.name || 'Unknown Customer'
  ))];

  // Filtering logic
  const filteredInvoices = invoices.filter((invoice: Invoice) => {
    const invoiceNumber = invoice.invoiceNumber || '';
    const workOrderNumber = invoice.workOrder?.workOrderNumber || '';
    const customerName = invoice.workOrder?.customer?.name || 'Unknown Customer';
    const vehicleInfo = `${invoice.workOrder?.vehicle?.make} ${invoice.workOrder?.vehicle?.model}` || '';
    
    const matchesSearch = invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workOrderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicleInfo.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || invoice.status === filterStatus;
    const matchesCustomer = filterCustomer === 'all' || customerName === filterCustomer;
    
    return matchesSearch && matchesStatus && matchesCustomer;
  });

  const handleView = (invoice: Invoice) => {
    // If pdfUrl exists, open it in a new tab
    if (invoice.pdfUrl) {
      window.open(invoice.pdfUrl, '_blank', 'noopener,noreferrer');
    } else {
      // Fallback to detail page if no PDF exists
      const basePath = getBasePath();
      navigate(`${basePath}/invoice-detail/${invoice.id}`);
    }
  };

  const formatCurrency = (amount: number) => {
    return `LKR ${Number(amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const columns: TableColumn<Invoice>[] = [
    {
      key: 'invoiceNumber',
      label: 'Invoice #',
      sortable: true,
      render: (_: any, row: Invoice) => (
        <strong>{row.invoiceNumber}</strong>
      )
    },
    {
      key: 'workOrder',
      label: 'Work Order',
      sortable: true,
      render: (_: any, row: Invoice) => (
        <span>{row.workOrder?.workOrderNumber || 'N/A'}</span>
      )
    },
    {
      key: 'customer',
      label: 'Customer',
      sortable: true,
      render: (_: any, row: Invoice) => (
        <div>
          <div style={{ fontWeight: '500' }}>{row.workOrder?.customer?.name || 'Unknown'}</div>
          {/* <div style={{ fontSize: '12px', color: '#6b7280' }}>
            {row.workOrder?.vehicle?.make} {row.workOrder?.vehicle?.model} ({row.workOrder?.vehicle?.year})
          </div> */}
        </div>
      )
    },
    {
      key: 'issueDate',
      label: 'Issue Date',
      sortable: true,
      render: (value: any) => (
        <span>{formatDate(value)}</span>
      )
    },
    {
      key: 'dueDate',
      label: 'Due Date',
      sortable: true,
      render: (value: any) => (
        <span>{formatDate(value)}</span>
      )
    },
    {
      key: 'totalAmount',
      label: 'Total Amount',
      sortable: true,
      align: 'right' as const,
      render: (value: any) => (
        <span style={{ fontWeight: '600' }}>{formatCurrency(value)}</span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      align: 'center' as const,
      render: (status: any) => (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          {getStatusBadge(status)}
        </div>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      align: 'center' as const,
      render: (_: any, row: Invoice) => (
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
          <button 
            className="btn-icon" 
            title="View" 
            onClick={(e) => { 
              e.stopPropagation(); 
              e.preventDefault();
              console.log('View button clicked');
              console.log('Invoice pdfUrl:', row.pdfUrl);
              console.log('Full invoice:', row);
              if (row.pdfUrl) {
                console.log('Opening PDF:', row.pdfUrl);
                window.open(row.pdfUrl, '_blank', 'noopener,noreferrer');
              } else {
                console.log('No pdfUrl found for this invoice');
              }
            }}
          >
            <i className='bx bx-show'></i>
          </button>
          <button 
            className="btn-icon" 
            title="Download" 
            onClick={(e) => { 
              e.stopPropagation(); 
              e.preventDefault();
              if (row.pdfUrl) {
                window.open(row.pdfUrl, '_blank', 'noopener,noreferrer');
              }
            }}
          >
            <i className='bx bx-download'></i>
          </button>
        </div>
      )
    },
  ];

  return (
    <div className="invoices-page">
      <div className="page-header">
        <h2 className="page-title">Invoices</h2>
      </div>

      <div className="inventory-controls">
        <div className="search-filters">
          <div className="search-box">
            <i className='bx bx-search search-icon'></i>
            <input
              type="text"
              placeholder="Search by invoice number, work order, customer, or vehicle..."
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
            <option value="all">All Statuses</option>
            <option value="DRAFT">Draft</option>
            <option value="SENT">Sent</option>
            <option value="OVERDUE">Overdue</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
          <select
            value={filterCustomer}
            onChange={(e) => setFilterCustomer(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Customers</option>
            {uniqueCustomers.map(customer => (
              <option key={customer} value={customer}>{customer}</option>
            ))}
          </select>
        </div>
        <div className="quick-actions">
          <button className="btn btn--ghost">
            <i className='bx bx-filter'></i>
            Advanced Filters
          </button>
          <button className="btn btn--ghost" onClick={() => window.location.reload()}>
            <i className='bx bx-refresh'></i>
            Refresh
          </button>
        </div>
      </div>

      <div className="parts-table-container">
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div style={{ color: 'red' }}>{error}</div>
        ) : (
          <Table
            columns={columns}
            data={filteredInvoices}
            onRowClick={(invoice) => handleView(invoice)}
            emptyMessage="No invoices found matching your search criteria."
          />
        )}
      </div>
    </div>
  );
};

export default InvoicesPage;
