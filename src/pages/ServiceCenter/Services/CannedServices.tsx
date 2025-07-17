import React, { useState, useEffect } from 'react';
import MetricCard from '../../../components/MetricCard/MetricCard';
import Table, { type TableColumn } from '../../../components/Table/Table';
import './CannedServices.scss';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import PackageModal from '../../../components/PackageModal/PackageModal';
import AddServiceModal from '../../../components/AddServiceModal/AddServiceModal';
import * as servicesApi from '../../../utils/servicesApi';
import * as packagesApi from '../../../utils/packagesApi';
import { fetchUserStatus } from '../../../utils/fetchUserStatus';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

interface CannedService {
  id: number;
  name: string;
  description?: string;
  price: number;
  unit: string;
  duration?: number;
  discount?: number;
  isActive: boolean;
  serviceType?: {
    id: number;
    name: string;
    description?: string;
  };
  // legacy fields for packages, can be optional
  category?: string;
  laborHours?: number;
  laborCharge?: number;
  groupId?: string;
  serviceCount?: number;
  packageServices?: string[];
}

const CannedServices = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [services, setServices] = useState<CannedService[]>([]);
  const [centerId, setCenterId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPackageModal, setShowPackageModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(undefined);
  // const [showAddModal, setShowAddModal] = useState(false);
  // const [newService, setNewService] = useState<Omit<CannedService, 'id'>>({
  //   name: '',
  //   description: '',
  //   category: '',
  //   laborHours: 0,
  //   laborCharge: 0,
  //   isActive: true
  // });
  // const [showServiceModal, setShowServiceModal] = useState(false);
  // const [serviceForm, setServiceForm] = useState<Omit<CannedService, 'id'>>({
  //   name: '',
  //   description: '',
  //   category: '',
  //   laborHours: 0,
  //   laborCharge: 0,
  //   isActive: true
  // });
  // const [packageForm, setPackageForm] = useState({
  //   name: '',
  //   description: '',
  //   category: '',
  //   laborHours: 0,
  //   laborCharge: 0,
  //   isActive: true,
  //   selectedServiceIds: [] as string[],
  // });

  // Fetch centerId from user status on mount
  useEffect(() => {
    setLoading(true);
    fetchUserStatus()
      .then(status => {
        if (status.centerId) {
          setCenterId(status.centerId);
        } else {
          throw new Error('No service center ID found for user');
        }
      })
      .catch(err => setError(err.message || 'Failed to fetch user status'))
      .finally(() => setLoading(false));
  }, []);

  // Fetch services when centerId is available
  useEffect(() => {
    if (!centerId) return;
    setLoading(true);
    servicesApi.getServices(centerId.toString())
      .then(data => setServices(data))
      .catch(err => setError(err.message || 'Failed to fetch services'))
      .finally(() => setLoading(false));
  }, [centerId]);

  // Metrics
  const totalServices = services.length;
  // For legacy fields in metrics, use nullish coalescing
  const totalLaborHours = services.reduce((sum, s) => sum + (s.laborHours ?? 0), 0);
  const avgLaborCharge = services.length > 0 ? (services.reduce((sum, s) => sum + (s.laborCharge ?? 0), 0) / services.length) : 0;
  const inactiveServices = services.filter(s => !s.isActive).length;

  // Filtered services
  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || service.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const uniqueCategories = [...new Set(services.map(s => s.category))];

  // Grouped and individual services
  const cannedServices = services.filter(s => s.groupId);
  const individualServices = services.filter(s => !s.groupId);

  // Handler to toggle active status for individual services
  const handleToggleActive = async (serviceId: string) => {
    if (!centerId) return;
    setLoading(true);
    try {
      await servicesApi.toggleServiceActive(centerId.toString(), serviceId);
      const data = await servicesApi.getServices(centerId.toString());
      setServices(data);
    } catch (err: any) {
      setError(err.message || 'Failed to toggle service status');
    } finally {
      setLoading(false);
    }
  };

  // Handler to add a new service
  const handleAddService = async (serviceData: any) => {
    if (!centerId) return;
    setLoading(true);
    try {
      await servicesApi.createService(centerId.toString(), serviceData);
      const data = await servicesApi.getServices(centerId.toString());
      setServices(data);
      setShowAddServiceModal(false);
    } catch (err: any) {
      setError(err.message || 'Failed to add service');
    } finally {
      setLoading(false);
    }
  };

  // Handler to add a new package
  const handleAddPackage = async (packageData: any) => {
    if (!centerId) return;
    setLoading(true);
    try {
      await packagesApi.createPackage(centerId.toString(), packageData);
      const data = await servicesApi.getServices(centerId.toString());
      setServices(data);
      setShowPackageModal(false);
    } catch (err: any) {
      setError(err.message || 'Failed to add package');
    } finally {
      setLoading(false);
    }
  };

  // Handler to delete a service
  const handleDeleteService = async (serviceId: string) => {
    if (!centerId) return;
    setLoading(true);
    try {
      await servicesApi.deleteService(centerId.toString(), serviceId);
      const data = await servicesApi.getServices(centerId.toString());
      setServices(data);
    } catch (err: any) {
      setError(err.message || 'Failed to delete service');
    } finally {
      setLoading(false);
    }
  };

  // Handler to delete a package
  const handleDeletePackage = async (packageId: string) => {
    if (!centerId) return;
    setLoading(true);
    try {
      await packagesApi.deletePackage(centerId.toString(), packageId);
      const data = await servicesApi.getServices(centerId.toString());
      setServices(data);
    } catch (err: any) {
      setError(err.message || 'Failed to delete package');
    } finally {
      setLoading(false);
    }
  };

  // Chart Data
  // 1. Most Popular Services (Bar)
  const mostPopularServices = [
    { name: 'Oil Change', count: 120 },
    { name: 'Brake Pad Replacement', count: 90 },
    { name: 'Tire Rotation', count: 75 },
    { name: 'Battery Replacement', count: 60 },
    { name: 'AC Recharge', count: 45 },
  ];
  const barData = {
    labels: mostPopularServices.map(s => s.name),
    datasets: [
      {
        label: 'No. of Jobs',
        data: mostPopularServices.map(s => s.count),
        backgroundColor: '#38bdf8',
        borderRadius: 6,
      },
    ],
  };

  // 2. Revenue by Service (Pie)
  const revenueByService = [
    { name: 'Oil Change', revenue: 120 * 49.99 },
    { name: 'Brake Pad Replacement', revenue: 90 * 129.99 },
    { name: 'Tire Rotation', revenue: 75 * 29.99 },
    { name: 'Battery Replacement', revenue: 60 * 39.99 },
    { name: 'AC Recharge', revenue: 45 * 99.99 },
  ];
  const pieRevenueData = {
    labels: revenueByService.map(s => s.name),
    datasets: [
      {
        data: revenueByService.map(s => s.revenue),
        backgroundColor: [
          '#38bdf8', '#818cf8', '#fbbf24', '#f87171', '#34d399'
        ],
        borderWidth: 1,
      },
    ],
  };

  // 3. Active vs Inactive Services (Pie)
  const activeCount = services.filter(s => s.isActive).length;
  const inactiveCount = services.filter(s => !s.isActive).length;
  const pieActiveData = {
    labels: ['Active', 'Inactive'],
    datasets: [
      {
        data: [activeCount, inactiveCount],
        backgroundColor: ['#38bdf8', '#e5e7eb'],
        borderWidth: 1,
      },
    ],
  };

  // Table columns for Canned Services (packages)
  const cannedServiceColumns: TableColumn<CannedService>[] = [
    {
      key: 'name',
      label: 'Package Name',
      sortable: true,
      render: (value, row) => (
        <div className="service-name-cell">
          <strong>{value}</strong>
          <div className="service-category">{row.category}</div>
        </div>
      ),
    },
    // Description column removed
    {
      key: 'serviceCount',
      label: 'Services Count',
      sortable: true,
      align: 'center',
      render: (value, row) => (
        <div className="service-count-cell">
          <strong>{value || 0}</strong>
          <div className="service-count-label">services</div>
        </div>
      ),
    },
    {
      key: 'laborHours',
      label: 'Total Labor Hours',
      sortable: true,
      align: 'center',
      render: (value) => typeof value === 'number' ? value.toFixed(2) : '',
    },
    {
      key: 'laborCharge',
      label: 'Package Price (LKR)',
      sortable: true,
      align: 'right',
      render: (value) => typeof value === 'number' ? `LKR ${value.toLocaleString()}` : '',
    },
    {
      key: 'isActive',
      label: 'Status',
      align: 'center',
      render: (value, row) => (
        <label className="switch">
          <input
            type="checkbox"
            checked={!!value}
            onChange={e => {
              e.stopPropagation();
              handleToggleActive(row.id.toString());
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
      render: (_, row) => (
        <button
          className="btn-icon"
          title="Manage Services"
          onClick={e => {
            e.stopPropagation();
            alert(`Manage services for ${row.name}`);
          }}
        >
          <i className="bx bx-cog"></i>
        </button>
      ),
    },
  ];

  // Table columns for Individual Services
  const individualServiceColumns: TableColumn<CannedService>[] = [
    {
      key: 'name',
      label: 'Service Name',
      sortable: true,
      render: (value, row) => (
        <div className="service-name-cell">
          <strong>{value}</strong>
          <div className="service-category">{row.category}</div>
        </div>
      ),
    },
    {
      key: 'description',
      label: 'Description',
      sortable: false,
      render: (value) => <span className="service-description">{value}</span>,
    },
    {
      key: 'serviceType',
      label: 'Service Type',
      sortable: true,
      render: (_value, row) => row.serviceType?.name || '',
    },
    {
      key: 'price',
      label: 'Price (LKR)',
      sortable: true,
      align: 'right',
      render: (value) => typeof value === 'number' ? `LKR ${value.toLocaleString()}` : '',
    },
    {
      key: 'unit',
      label: 'Unit',
      sortable: true,
      render: (value) => typeof value === 'string' ? value : '',
    },
    {
      key: 'duration',
      label: 'Duration (hrs)',
      sortable: true,
      render: (value) => typeof value === 'number' ? value.toFixed(2) : '',
    },
    {
      key: 'discount',
      label: 'Discount',
      sortable: true,
      render: (value) => typeof value === 'number' && value > 0 ? `LKR ${value}` : '—',
    },
    // Move Status column to the rightmost position
    {
      key: 'isActive',
      label: 'Status',
      align: 'center',
      render: (value, row) => (
        <label className="switch switch--dark">
          <input
            type="checkbox"
            checked={!!value}
            onChange={e => {
              e.stopPropagation();
              handleToggleActive(row.id.toString());
            }}
          />
          <span className="slider round"></span>
        </label>
      ),
    },
  ];

  return (
    <div className="canned-services-page">
      {loading && <div className="loading">Loading...</div>}
      {error && <div className="error-message">{error}</div>}
      <div className="page-header">
        <div className="page-actions">
          <button className="btn btn--primary" onClick={() => setShowPackageModal(true)}>
            <i className='bx bx-package'></i>
            Add New Package
          </button>
          <button className="btn btn--primary" onClick={() => setShowAddServiceModal(true)}>
            <i className='bx bx-plus'></i>
            Add New Service
          </button>
        </div>
      </div>



      <div className="metric-cards-row">
        <MetricCard
          title="Total Services"
          amount={services.length.toString()}
          change={`${services.reduce((sum, s) => sum + s.laborHours, 0).toFixed(2)} total hours`}
          changeType="positive"
          period="in library"
        />
        <MetricCard
          title="Service Packages"
          amount={cannedServices.length.toString()}
          change={`${cannedServices.reduce((sum, s) => sum + (s.serviceCount || 0), 0)} total services`}
          changeType="positive"
          period="in packages"
        />

        <MetricCard
          title="Inactive Services"
          amount={services.filter(s => !s.isActive).length.toString()}
          change="Not available"
          changeType={services.filter(s => !s.isActive).length > 0 ? 'negative' : 'positive'}
          period="hidden from work order"
        />
      </div>

            {/* Charts Row */}
            <div className="charts-row">
        <div className="chart-card">
          <h4>Most Popular Services</h4>
          <div style={{ width: '100%', height: 220 }}>
            <Bar
              data={barData}
              options={{
                plugins: { legend: { display: false } },
                scales: { x: { grid: { display: false } }, y: { beginAtZero: true } },
                maintainAspectRatio: false,
                responsive: true,
              }}
            />
          </div>
        </div>
        <div className="chart-card">
          <h4>Revenue by Service</h4>
          <div style={{ width: '100%', height: 220 }}>
            <Pie
              data={pieRevenueData}
              options={{
                plugins: { legend: { position: 'bottom' } },
                responsive: true,
                maintainAspectRatio: false,
              }}
            />
          </div>
        </div>
        <div className="chart-card">
          <h4>Active vs Inactive Services</h4>
          <div style={{ width: '100%', height: 220 }}>
            <Pie
              data={pieActiveData}
              options={{
                plugins: { legend: { position: 'bottom' } },
                responsive: true,
                maintainAspectRatio: false,
              }}
            />
          </div>
        </div>
      </div>

      {/* Canned Services Table */}
      <div className="services-table-container">
        <div className="table-header">
          <h3>Canned Service Packages</h3>
        </div>
        <Table
          columns={cannedServiceColumns}
          data={cannedServices}
          onRowClick={service => {
            console.log('View package details:', service.name);
            if (service.packageServices) {
              console.log('Services in package:', service.packageServices);
            }
          }}
          emptyMessage="No canned service packages found."
        />
      </div>

      {/* Individual Services Table */}
      <div className="services-table-container">
        <div className="table-header">
          <h3>Individual Services</h3>
        </div>
        <Table
          columns={individualServiceColumns}
          data={individualServices}
          onRowClick={service => console.log('View service details:', service.name)}
          emptyMessage="No individual services found."
        />
      </div>

      {/* Remove all modal JSX blocks for New Service and New Canned Service Package */}
      {showAddServiceModal && (
        <AddServiceModal
          service={selectedService}
          onClose={() => setShowAddServiceModal(false)}
          onSave={handleAddService}
        />
      )}
      {showPackageModal && (
        <PackageModal
          packageData={selectedPackage}
          individualServices={individualServices}
          onClose={() => setShowPackageModal(false)}
          onSave={handleAddPackage}
        />
      )}
    </div>
  );
};

export default CannedServices;