import React, { useState, useEffect } from 'react';
import Table, { type TableColumn } from '../../components/Table/Table';
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
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterVehicleType, setFilterVehicleType] = useState('all');
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  // Filtering logic
  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' ||
      (filterStatus === 'available' && service.isAvailable) ||
      (filterStatus === 'unavailable' && !service.isAvailable);
    
    const matchesCategory = filterCategory === 'all' || service.category === filterCategory;
    const matchesVehicleType = filterVehicleType === 'all' || service.vehicleType === filterVehicleType;
    
    return matchesSearch && matchesStatus && matchesCategory && matchesVehicleType;
  });

  // Unique filter values
  const uniqueCategories = [...new Set(services.map(s => s.category).filter(Boolean))];
  const uniqueVehicleTypes = [...new Set(services.map(s => s.vehicleType).filter(Boolean))];

  const columns: TableColumn<Service>[] = [
    {
      key: 'name',
      label: 'Service Name',
      sortable: true,
      render: (value: any) => (
        <strong>{value}</strong>
      )
    },
    {
      key: 'category',
      label: 'Category',
      sortable: true,
      render: (value: any) => (
        <span>{value || 'N/A'}</span>
      )
    },
    {
      key: 'description',
      label: 'Description',
      sortable: true,
      render: (value: any) => (
        <span>{value || 'No description'}</span>
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
        <h2 className="page-title">Canned Services</h2>
      </div>

      <div className="inventory-controls">
        <div className="search-filters">
          <div className="search-box">
            <i className='bx bx-search search-icon'></i>
            <input
              type="text"
              placeholder="Search by service name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
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
          <select
            value={filterVehicleType}
            onChange={(e) => setFilterVehicleType(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Vehicle Types</option>
            {uniqueVehicleTypes.map(vehicleType => (
              <option key={vehicleType} value={vehicleType}>{vehicleType}</option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Statuses</option>
            <option value="available">Available</option>
            <option value="unavailable">Unavailable</option>
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
            data={filteredServices}
            onRowClick={(service) => console.log('View service details:', service.name)}
            emptyMessage="No services found matching your search criteria."
          />
        )}
      </div>
    </div>
  );
};

export default ServicesPage;