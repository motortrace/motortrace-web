import React, { useState, useEffect } from 'react';
import Table, { type TableColumn } from '../../components/Table/Table';
import CreateCannedServiceModal from '../../components/CreateCannedServiceModal';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const getCategoryColor = (category: string) => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];
    const index = category ? category.split('').reduce((a, b) => a + b.charCodeAt(0), 0) % colors.length : 0;
    return colors[index];
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
              handleToggleAvailability(row.id);
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
          <button className="btn-icon" title="View" onClick={e => { e.stopPropagation(); console.log('View service details:', row.name); }}>
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
          <button className="action-btn primary" onClick={() => setIsCreateModalOpen(true)}>
            <i className="bx bx-plus"></i>
            Create Service
          </button>
        </div>
      </div>

      {/* Service Analytics Charts */}
      <div className="services-analytics">
        <div className="analytics-row">
          <ServicePopularityChart className="analytics-chart" />
          <ServiceCategoriesChart className="analytics-chart" />
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
            data={filteredServices}
            onRowClick={(service) => console.log('View service details:', service.name)}
            emptyMessage="No services found matching your search criteria."
          />
        )}
      </div>

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