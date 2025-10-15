import React, { useState, useEffect } from 'react';
import Table, { type TableColumn } from '../../components/Table/Table';
import { useAuth } from '../../hooks/useAuth';
import './EmployeeManagement.scss';
import TechnicianTaskDistributionChart from '../../components/TechnicianTaskDistributionChart/TechnicianTaskDistributionChart';
import TechnicianWorkingStatusChart from '../../components/TechnicianWorkingStatusChart/TechnicianWorkingStatusChart';

interface Technician {
  id: string;
  userProfileId: string;
  employeeId: string;
  specialization: string;
  certifications: string[];
  createdAt: string;
  updatedAt: string;
  userProfile: {
    id: string;
    name: string;
    phone: string;
    profileImage?: string;
    role: string;
  };
  inspectionsCount: number;
  qcChecksCount: number;
  laborItemsCount: number;
  partInstallationsCount: number;
}

const EmployeeManagement: React.FC = () => {
  const { token, loading: authLoading } = useAuth();
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Search, sort, filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpecialization, setFilterSpecialization] = useState('all');

  // Fetch technicians from backend
  const fetchTechnicians = async () => {
    if (!token) {
      setError('No access token available');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3000/technicians', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch technicians: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success) {
        setTechnicians(data.data);
      } else {
        throw new Error(data.message || 'Failed to fetch technicians');
      }
    } catch (err) {
      console.error('Error fetching technicians:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch technicians');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && token) {
      fetchTechnicians();
    }
  }, [token, authLoading]);

  // Filtering logic
  const filteredTechnicians = technicians.filter(technician => {
    const matchesSearch = technician.userProfile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      technician.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      technician.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialization = filterSpecialization === 'all' || technician.specialization === filterSpecialization;
    return matchesSearch && matchesSpecialization;
  });

  // Unique filter values
  const uniqueSpecializations = [...new Set(technicians.map(t => t.specialization).filter(Boolean))];

  const columns: TableColumn<Technician>[] = [
    {
      key: 'userProfile',
      label: 'Technician',
      sortable: true,
      render: (_: any, row: Technician) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {row.userProfile.profileImage ? (
            <img 
              src={row.userProfile.profileImage} 
              alt={row.userProfile.name}
              style={{ 
                width: '32px', 
                height: '32px', 
                borderRadius: '50%', 
                objectFit: 'cover' 
              }}
            />
          ) : (
            <div style={{ 
              width: '32px', 
              height: '32px', 
              borderRadius: '50%', 
              backgroundColor: '#e5e7eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              fontWeight: '500',
              color: '#6b7280'
            }}>
              {row.userProfile.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <div style={{ fontWeight: '500' }}>
              {row.userProfile.name}
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'employeeId',
      label: 'Employee ID',
      sortable: true,
      render: (value: any) => (
        <span>{value || 'N/A'}</span>
      )
    },
    {
      key: 'specialization',
      label: 'Specialization',
      sortable: true,
      render: (value: any) => (
        <span>{value || 'N/A'}</span>
      )
    },
    {
      key: 'inspectionsCount',
      label: 'Inspections',
      sortable: true,
      align: 'center',
      render: (value: any) => (
        <span>{value || 0}</span>
      )
    },
    {
      key: 'laborItemsCount',
      label: 'Labor Items',
      sortable: true,
      align: 'center',
      render: (value: any) => (
        <span>{value || 0}</span>
      )
    },
    {
      key: 'partInstallationsCount',
      label: 'Part Installations',
      sortable: true,
      align: 'center',
      render: (value: any) => (
        <span>{value || 0}</span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      align: 'center',
      render: (_: any, row: Technician) => (
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
          <button className="btn-icon" title="View" onClick={e => { e.stopPropagation(); console.log('View technician details:', row.userProfile.name); }}>
            <i className='bx bx-show'></i>
          </button>
        </div>
      )
    },
  ];

  return (
    <div className="employee-management">
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">Technicians</h1>
          <p className="page-subtitle">Manage and view technician information</p>
        </div>
        <div className="header-actions">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search technicians by name, specialization, or employee ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="category-filter">
            <select
              value={filterSpecialization}
              onChange={(e) => setFilterSpecialization(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Specializations</option>
              {uniqueSpecializations.map(specialization => (
                <option key={specialization} value={specialization}>{specialization}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="chart-container" style={{ marginBottom: '24px', display: 'flex', gap: '24px' }}>
        <div style={{ flex: 3 }}>
          <TechnicianTaskDistributionChart className="analytics-chart" />
        </div>
        <div style={{ flex: 1 }}>
          <TechnicianWorkingStatusChart className="analytics-chart" />
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
            data={filteredTechnicians}
            onRowClick={(technician) => console.log('View technician details:', technician.userProfile.name)}
            emptyMessage="No technicians found matching your search criteria."
          />
        )}
      </div>
    </div>
  );
};

export default EmployeeManagement; 