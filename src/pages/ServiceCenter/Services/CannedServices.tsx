import React, { useState } from 'react';
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

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

interface CannedService {
  id: string;
  name: string;
  description: string;
  category: string;
  laborHours: number;
  laborCharge: number;
  isActive: boolean;
  groupId?: string;
  serviceCount?: number; // Number of services in the package
  packageServices?: string[]; // List of services in the package
}

const CannedServices = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [services, setServices] = useState<CannedService[]>([
    // Canned Service Packages
    {
      id: '1',
      name: 'Basic Maintenance Package',
      description: 'Essential maintenance services for regular upkeep',
      category: 'Maintenance',
      laborHours: 2.0,
      laborCharge: 149.99,
      isActive: true,
      groupId: 'package1',
      serviceCount: 3,
      packageServices: ['Oil Change', 'Tire Rotation', 'Fluid Top-up']
    },
    {
      id: '2',
      name: 'Brake Service Package',
      description: 'Complete brake system maintenance',
      category: 'Brakes',
      laborHours: 2.5,
      laborCharge: 249.99,
      isActive: true,
      groupId: 'package2',
      serviceCount: 4,
      packageServices: ['Brake Pad Replacement', 'Brake Fluid Change', 'Brake Inspection', 'Rotor Resurfacing']
    },
    {
      id: '3',
      name: 'Seasonal Prep Package',
      description: 'Prepare your vehicle for seasonal changes',
      category: 'Maintenance',
      laborHours: 1.8,
      laborCharge: 199.99,
      isActive: true,
      groupId: 'package3',
      serviceCount: 5,
      packageServices: ['Battery Test', 'AC Check', 'Coolant System Check', 'Belt Inspection', 'Wiper Blade Replacement']
    },
    {
      id: '4',
      name: 'Premium Service Package',
      description: 'Comprehensive vehicle service package',
      category: 'Maintenance',
      laborHours: 4.0,
      laborCharge: 399.99,
      isActive: false,
      groupId: 'package4',
      serviceCount: 8,
      packageServices: ['Oil Change', 'Brake Inspection', 'Tire Rotation', 'Battery Test', 'AC Service', 'Transmission Check', 'Engine Diagnostic', 'Exhaust Inspection']
    },
    {
      id: '5',
      name: 'Electrical System Package',
      description: 'Complete electrical system diagnostics and service',
      category: 'Electrical',
      laborHours: 3.2,
      laborCharge: 299.99,
      isActive: true,
      groupId: 'package5',
      serviceCount: 6,
      packageServices: ['Battery Replacement', 'Alternator Test', 'Starter Check', 'Wiring Inspection', 'Fuse Box Check', 'Headlight Alignment']
    },
    
    // Individual Services
    {
      id: '6',
      name: 'Oil Change',
      description: 'Replace engine oil and filter',
      category: 'Maintenance',
      laborHours: 0.5,
      laborCharge: 49.99,
      isActive: true
    },
    {
      id: '7',
      name: 'Brake Pad Replacement',
      description: 'Replace front brake pads',
      category: 'Brakes',
      laborHours: 1.2,
      laborCharge: 129.99,
      isActive: true
    },
    {
      id: '8',
      name: 'Tire Rotation',
      description: 'Rotate all four tires',
      category: 'Tires',
      laborHours: 0.4,
      laborCharge: 29.99,
      isActive: true
    },
    {
      id: '9',
      name: 'Battery Replacement',
      description: 'Replace car battery',
      category: 'Electrical',
      laborHours: 0.3,
      laborCharge: 39.99,
      isActive: false
    },
    {
      id: '10',
      name: 'AC Recharge',
      description: 'Recharge air conditioning system',
      category: 'HVAC',
      laborHours: 1.0,
      laborCharge: 99.99,
      isActive: true
    },
    {
      id: '11',
      name: 'Transmission Service',
      description: 'Change transmission fluid and filter',
      category: 'Transmission',
      laborHours: 1.5,
      laborCharge: 159.99,
      isActive: true
    },
    {
      id: '12',
      name: 'Engine Diagnostic',
      description: 'Comprehensive engine diagnostic scan',
      category: 'Diagnostic',
      laborHours: 1.0,
      laborCharge: 89.99,
      isActive: true
    }
  ]);
  const [showPackageModal, setShowPackageModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [selectedService, setSelectedService] = useState<undefined | {
    id?: string;
    name: string;
    description: string;
    category: string;
    laborHours: number;
    laborCharge: number;
    tax: number;
    isActive: boolean;
  }>(undefined);
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

  // Metrics
  const totalServices = services.length;
  const totalLaborHours = services.reduce((sum, s) => sum + s.laborHours, 0);
  const avgLaborCharge = services.length > 0 ? (services.reduce((sum, s) => sum + s.laborCharge, 0) / services.length) : 0;
  const inactiveServices = services.filter(s => !s.isActive).length;

  // Filtered services
  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || service.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const uniqueCategories = [...new Set(services.map(s => s.category))];

  // Grouped and individual services
  const cannedServices = services.filter(s => s.groupId);
  const individualServices = services.filter(s => !s.groupId);

  // Handler to toggle active status for individual services
  const handleToggleActive = (serviceId: string) => {
    setServices(prevServices =>
      prevServices.map(s =>
        s.id === serviceId ? { ...s, isActive: !s.isActive } : s
      )
    );
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
              handleToggleActive(row.id);
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
      key: 'laborHours',
      label: 'Labor Hours',
      sortable: true,
      align: 'center',
      render: (value) => typeof value === 'number' ? value.toFixed(2) : '',
    },
    {
      key: 'laborCharge',
      label: 'Labor Charge (LKR)',
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
              handleToggleActive(row.id);
            }}
          />
          <span className="slider round"></span>
        </label>
      ),
    },
  ];

  return (
    <div className="canned-services-page">
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
          onSave={(service) => {
            // TODO: handle save logic
            setShowAddServiceModal(false);
          }}
        />
      )}
      {showPackageModal && (
        <PackageModal
          packageData={selectedPackage}
          individualServices={individualServices}
          onClose={() => setShowPackageModal(false)}
          onSave={(pkg) => {
            // TODO: handle save logic
            setShowPackageModal(false);
          }}
        />
      )}
    </div>
  );
};

export default CannedServices;