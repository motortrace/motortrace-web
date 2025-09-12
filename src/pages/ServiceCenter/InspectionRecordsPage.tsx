import React, { useState, useEffect } from 'react';
import Table, { type TableColumn } from '../../components/Table/Table';
import './RecordsPage.scss';
import { getWorkOrderInspections } from '../../utils/workOrderInspectionsApi';
import type { WorkOrderInspection } from '../../types/WorkOrderInspection';

const getStatusBadge = (isCompleted: boolean) => {
  const badgeClass = isCompleted ? 'status-badge status-in-stock' : 'status-badge status-out-of-stock';
  const statusText = isCompleted ? 'Completed' : 'In Progress';
  return <span className={badgeClass}>{statusText}</span>;
};

const InspectionRecordsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterInspector, setFilterInspector] = useState('all');
  const [filterTemplate, setFilterTemplate] = useState('all');
  const [inspections, setInspections] = useState<WorkOrderInspection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');


  useEffect(() => {
    setLoading(true);
    getWorkOrderInspections()
      .then((response) => {
        // Handle the API response structure with success/data wrapper
        const data = response.success ? response.data : response;
        setInspections(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to fetch inspection records');
        setLoading(false);
      });
  }, []);

  // Unique filter values
  const uniqueInspectors = [...new Set(inspections.map((i: WorkOrderInspection) => 
    i.inspector?.userProfile?.name || i.inspectorId
  ))];
  const uniqueTemplates = [...new Set(inspections.map((i: WorkOrderInspection) => 
    i.template?.name || 'No Template'
  ))];

  // Filtering logic
  const filteredInspections = inspections.filter((inspection: WorkOrderInspection) => {
    const workOrderNumber = inspection.workOrderNumber || inspection.workOrder?.workOrderNumber || inspection.workOrderId;
    const inspectorName = inspection.inspector?.userProfile?.name || inspection.inspectorId;
    const templateName = inspection.template?.name || 'No Template';
    
    const matchesSearch = workOrderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inspectorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      templateName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'completed' && inspection.isCompleted) ||
      (filterStatus === 'in-progress' && !inspection.isCompleted);
    
    const matchesInspector = filterInspector === 'all' || inspectorName === filterInspector;
    const matchesTemplate = filterTemplate === 'all' || templateName === filterTemplate;
    
    return matchesSearch && matchesStatus && matchesInspector && matchesTemplate;
  });

  const handleView = (id: string) => {
    console.log('View inspection:', id);
    // TODO: Implement view functionality (could navigate to detail page, etc.)
  };

  const columns: TableColumn<WorkOrderInspection>[] = [
    {
      key: 'workOrderNumber',
      label: 'Work Order',
      sortable: true,
      render: (value: any, row: WorkOrderInspection) => (
        <strong>{row.workOrderNumber || row.workOrder?.workOrderNumber || row.workOrderId}</strong>
      )
    },
    {
      key: 'template',
      label: 'Template',
      sortable: true,
      render: (_: any, row: WorkOrderInspection) => (
        <span>{row.template?.name || 'No Template'}</span>
      )
    },
    {
      key: 'inspector',
      label: 'Inspector',
      sortable: true,
      render: (_: any, row: WorkOrderInspection) => {
        const inspectorName = row.inspector?.userProfile?.name;
        return inspectorName ? (
          <span>{inspectorName}</span>
        ) : (
          <span style={{ fontSize: 11, color: '#aaa', fontStyle: 'italic' }}>Unknown</span>
        );
      }
    },
    {
      key: 'date',
      label: 'Date',
      sortable: true,
      render: (value: any) => {
        const date = new Date(value);
        return <span>{date.toLocaleDateString()}</span>;
      }
    },
    {
      key: 'isCompleted',
      label: 'Status',
      sortable: true,
      align: 'center' as const,
      render: (isCompleted: any) => (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          {getStatusBadge(isCompleted)}
        </div>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      align: 'center' as const,
      render: (_: any, row: WorkOrderInspection) => (
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
          <button className="btn-icon" title="View" onClick={e => { e.stopPropagation(); handleView(row.id); }}>
            <i className='bx bx-show'></i>
          </button>
        </div>
      )
    },
  ];

  return (
    <div className="inspection-records-page">
      <div className="page-header">
        <h2 className="page-title">Inspection Records</h2>
        <button className="btn btn--primary" style={{ marginLeft: 'auto' }}>
          <i className='bx bx-plus'></i>
          Create Inspection
        </button>
      </div>

      <div className="inventory-controls">
        <div className="search-filters">
          <div className="search-box">
            <i className='bx bx-search search-icon'></i>
            <input
              type="text"
              placeholder="Search by work order, inspector, or template..."
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
            <option value="completed">Completed</option>
            <option value="in-progress">In Progress</option>
          </select>
          <select
            value={filterInspector}
            onChange={(e) => setFilterInspector(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Inspectors</option>
            {uniqueInspectors.map(inspector => (
              <option key={inspector} value={inspector}>{inspector}</option>
            ))}
          </select>
          <select
            value={filterTemplate}
            onChange={(e) => setFilterTemplate(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Templates</option>
            {uniqueTemplates.map(template => (
              <option key={template} value={template}>{template}</option>
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
            data={filteredInspections}
            onRowClick={(inspection) => handleView(inspection.id)}
            emptyMessage="No inspection records found matching your search criteria."
          />
        )}
      </div>

    </div>
  );
};

export default InspectionRecordsPage;
