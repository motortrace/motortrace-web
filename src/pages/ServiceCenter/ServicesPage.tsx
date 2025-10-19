import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Table, { type TableColumn } from '../../components/Table/Table';
import CreateCannedServiceModal from '../../components/CreateCannedServiceModal';
import ConfirmationDialog from '../../components/ConfirmationDialog';
import ServicePopularityChart from '../../components/ServicePopularityChart/ServicePopularityChart';
import ServiceCategoriesChart from '../../components/ServiceCategoriesChart/ServiceCategoriesChart';
import './ServicesPage.scss';
import { cannedServiceService } from '../../services/cannedServiceService';

interface Service {
  id: string;
  code: string;
  name: string;
  description: string;
  duration: number;
  price: string;
  isAvailable: boolean;
  variantLabel: string;
  vehicleType: string;
  hasOptionalParts: boolean;
  hasOptionalLabor: boolean;
  category: string;
  minVehicleAge: number | null;
  maxVehicleMileage: number | null;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  laborOperations: any[];
  serviceIds: string[];
}

const ServicesPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isToggleConfirmOpen, setIsToggleConfirmOpen] = useState(false);
  const [toggleServiceId, setToggleServiceId] = useState<string | null>(null);
  const [toggleServiceName, setToggleServiceName] = useState<string>('');
  const [toggleToAvailable, setToggleToAvailable] = useState<boolean>(false);

  const getCategoryColor = (category: string) => {
    return categoryColorMap[category] || '#CCCCCC'; // default color if not found
  };

  useEffect(() => {
    setLoading(true);
    cannedServiceService.getPackages()
      .then(data => {
        setServices(data);
        setLoading(false);
      })
      .catch((err: any) => {
        setError(err.message || 'Failed to fetch services');
        setLoading(false);
      });
  }, []);

  // Handler to toggle availability
  const handleToggleAvailability = async (serviceId: string) => {
    try {
      await cannedServiceService.toggleAvailability(serviceId);
      // Refresh the services list
      const data = await cannedServiceService.getPackages();
      setServices(data);
    } catch (err: any) {
      setError(err.message || 'Failed to toggle service availability');
    }
  };

  // Handler for successful service creation
  const handleServiceCreated = async () => {
    try {
      // Refresh the services list
      const data = await cannedServiceService.getPackages();
      setServices(data);
    } catch (err: any) {
      setError(err.message || 'Failed to refresh services list');
    }
  };

  // Filtering logic
  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = filterCategory === 'all' || service.category === filterCategory;

    return matchesSearch && matchesCategory;
  });

  // Unique filter values
  const uniqueCategories = [...new Set(services.map(s => s.category).filter(Boolean))];

  // Color map for distinct categories
  const categoryColorMap: { [key: string]: string } = {};
  const colors = [
    '#6FCFB5', // balanced aqua
    '#5DDAD3', // mint teal
    '#5EC2E3', // ocean blue
    '#8ED1A5', // leafy green
    '#FFE37E', // warm yellow
    '#CC88D9', // lilac purple
    '#8EDFC9', // soft seafoam
  ];
  uniqueCategories.forEach((category, index) => {
    categoryColorMap[category] = colors[index % colors.length];
  });

  const columns: TableColumn<Service>[] = [
    {
      key: 'name',
      label: 'Service Name',
      sortable: true,
      render: (value: any) => (
        <strong style={{ marginRight: '12px' }}>{value}</strong>
      )
    },
    {
      key: 'category',
      label: 'Category',
      sortable: true,
      align: 'center',
      render: (value: any) => (
        <span className="category-badge" style={{ backgroundColor: getCategoryColor(value) }}>{value || 'N/A'}</span>
      )
    },
    {
      key: 'price',
      label: 'Price (LKR)',
      sortable: true,
      align: 'right',
      render: (value: any) => (
        <span>LKR {value?.toLocaleString() || '0'}</span>
      )
    },
    {
      key: 'duration',
      label: 'Duration (min)',
      sortable: true,
      align: 'center',
      render: (value: any) => (
        <span>{value ? value : 'N/A'}</span>
      )
    },
    {
      key: 'isAvailable',
      label: 'Status',
      align: 'center',
      render: (value: any, row: Service) => (
        <label className="switch switch--dark">
          <input
            type="checkbox"
            checked={!!value}
            onChange={e => {
              e.stopPropagation();
              setToggleServiceId(row.id);
              setToggleServiceName(row.name);
              setToggleToAvailable(!value);
              setIsToggleConfirmOpen(true);
            }}
          />
          <span className="slider round"></span>
        </label>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      align: 'center',
      render: (_: any, row: Service) => (
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
          <button className="btn-icon" title="View" onClick={e => { e.stopPropagation(); console.log('Navigating to service:', row.id); navigate(`/${location.pathname.split('/')[1]}/service/${row.id}`); }}>
            <i className='bx bx-show'></i>
          </button>
        </div>
      )
    },
  ];

  return (
    <div className="services-page">
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">Canned Services</h1>
          <p className="page-subtitle">Create and manage canned services</p>
        </div>
        <div className="header-actions">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="category-filter">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Categories</option>
              {uniqueCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <button className="action-btn secondary" onClick={() => navigate(`/${location.pathname.split('/')[1]}/labor-catalog`)}>
            <i className="bx bx-list-ul"></i>
            View Labor Catalog
          </button>
          <button className="action-btn primary" onClick={() => setIsConfirmDialogOpen(true)}>
            <i className="bx bx-plus"></i>
            Create Service
          </button>
        </div>
      </div>

      {/* Service Analytics Charts - Only show when no filters applied */}
      {filterCategory === 'all' && !searchTerm && (
        <div className="services-analytics">
          <div className="analytics-row">
            <ServicePopularityChart className="analytics-chart" />
            <ServiceCategoriesChart className="analytics-chart" services={services} categoryColorMap={categoryColorMap} />
          </div>
        </div>
      )}

      <div className="parts-table-container">
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div style={{ color: 'red' }}>{error}</div>
        ) : (
          <Table
            columns={columns}
            data={filteredServices}
            onRowClick={(service) => navigate(`/${location.pathname.split('/')[1]}/service/${service.id}`)}
            emptyMessage="No services found matching your search criteria."
          />
        )}
      </div>

      {/* Confirmation Dialog for Create Service */}
      <ConfirmationDialog
        isOpen={isConfirmDialogOpen}
        message="Are you sure you want to create a new service?"
        onConfirm={() => {
          setIsConfirmDialogOpen(false);
          setIsCreateModalOpen(true);
        }}
        onCancel={() => {
          setIsConfirmDialogOpen(false);
        }}
      />

      {/* Confirmation Dialog for Toggle Availability */}
      <ConfirmationDialog
        isOpen={isToggleConfirmOpen}
        message={`Are you sure you want to ${toggleToAvailable ? 'enable' : 'disable'} "${toggleServiceName}"?`}
        onConfirm={() => {
          if (toggleServiceId) {
            handleToggleAvailability(toggleServiceId);
          }
          setIsToggleConfirmOpen(false);
          setToggleServiceId(null);
        }}
        onCancel={() => {
          setIsToggleConfirmOpen(false);
          setToggleServiceId(null);
        }}
      />

      {/* Create Canned Service Modal */}
      <CreateCannedServiceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleServiceCreated}
      />
    </div>
  );
};

export default ServicesPage;