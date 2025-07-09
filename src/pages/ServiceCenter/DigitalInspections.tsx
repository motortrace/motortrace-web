import React, { useState } from 'react';
import DashboardHeader from '../../layouts/DashboardHeader/DashboardHeader';
import MetricCard from '../../components/MetricCard/MetricCard';
import Table, { type TableColumn } from '../../components/Table/Table';
import InspectionModal from '../../components/InspectionModal/InspectionModal';
import TemplateModal from '../../components/TemplateModal/TemplateModal';
import type { DigitalInspection, InspectionTemplate, InspectionSummary } from '../../types/Inspection';
import './DigitalInspections.scss';

const DigitalInspections = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'draft' | 'in-progress' | 'completed' | 'cancelled'>('all');
  const [filterOverallStatus, setFilterOverallStatus] = useState<'all' | 'pass' | 'fail' | 'warning' | 'pending'>('all');
  const [filterTechnician, setFilterTechnician] = useState('all');
  const [selectedInspection, setSelectedInspection] = useState<DigitalInspection | null>(null);
  const [showInspectionModal, setShowInspectionModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<InspectionTemplate | null>(null);

  // Sample inspection templates
  const [templates] = useState<InspectionTemplate[]>([
    {
      id: 'template-1',
      name: 'Pre-Delivery Inspection',
      description: 'Comprehensive pre-delivery inspection checklist for all vehicles',
      category: 'pre-delivery',
      items: [
        { id: 'item-1', title: 'Exterior Body Inspection', description: 'Check for dents, scratches, paint issues', category: 'exterior', status: 'pending', required: true, priority: 'high' },
        { id: 'item-2', title: 'Interior Inspection', description: 'Check seats, dashboard, controls', category: 'interior', status: 'pending', required: true, priority: 'high' },
        { id: 'item-3', title: 'Engine Bay Inspection', description: 'Check engine components, fluids, belts', category: 'engine', status: 'pending', required: true, priority: 'critical' },
        { id: 'item-4', title: 'Test Drive', description: 'Road test for performance and handling', category: 'test-drive', status: 'pending', required: true, priority: 'critical' }
      ],
      estimatedDuration: 45,
      isActive: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
      createdBy: 'John Smith'
    },
    {
      id: 'template-2',
      name: 'Safety Inspection',
      description: 'Critical safety systems inspection',
      category: 'safety',
      items: [
        { id: 'item-5', title: 'Brake System', description: 'Check brake pads, rotors, fluid', category: 'brakes', status: 'pending', required: true, priority: 'critical' },
        { id: 'item-6', title: 'Tire Condition', description: 'Check tire tread, pressure, wear', category: 'tires', status: 'pending', required: true, priority: 'critical' },
        { id: 'item-7', title: 'Lighting System', description: 'Check all lights and signals', category: 'lighting', status: 'pending', required: true, priority: 'high' },
        { id: 'item-8', title: 'Steering System', description: 'Check steering response and alignment', category: 'steering', status: 'pending', required: true, priority: 'high' }
      ],
      estimatedDuration: 30,
      isActive: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
      createdBy: 'Sarah Lee'
    }
  ]);

  // Sample digital inspections data
  const [inspections, setInspections] = useState<DigitalInspection[]>([
    {
      id: 'insp-001',
      workOrderId: 'WO-2024-001',
      templateId: 'template-1',
      templateName: 'Pre-Delivery Inspection',
      status: 'completed',
      overallStatus: 'pass',
      items: [
        { id: 'item-1', title: 'Exterior Body Inspection', description: 'Check for dents, scratches, paint issues', category: 'exterior', status: 'pass', required: true, priority: 'high', technician: 'Mike Johnson', completedAt: '2024-06-25T10:30:00Z' },
        { id: 'item-2', title: 'Interior Inspection', description: 'Check seats, dashboard, controls', category: 'interior', status: 'pass', required: true, priority: 'high', technician: 'Mike Johnson', completedAt: '2024-06-25T10:35:00Z' },
        { id: 'item-3', title: 'Engine Bay Inspection', description: 'Check engine components, fluids, belts', category: 'engine', status: 'pass', required: true, priority: 'critical', technician: 'Mike Johnson', completedAt: '2024-06-25T10:45:00Z' },
        { id: 'item-4', title: 'Test Drive', description: 'Road test for performance and handling', category: 'test-drive', status: 'pass', required: true, priority: 'critical', technician: 'Mike Johnson', completedAt: '2024-06-25T11:00:00Z' }
      ],
      technician: 'Mike Johnson',
      customerName: 'Sarah Johnson',
      vehicleInfo: '2020 Toyota Camry',
      licensePlate: 'ABC-1234',
      startedAt: '2024-06-25T10:00:00Z',
      completedAt: '2024-06-25T11:15:00Z',
      totalItems: 4,
      passedItems: 4,
      failedItems: 0,
      warningItems: 0,
      naItems: 0,
      isActive: true,
      createdAt: '2024-06-25T09:00:00Z',
      updatedAt: '2024-06-25T11:15:00Z'
    },
    {
      id: 'insp-002',
      workOrderId: 'WO-2024-002',
      templateId: 'template-2',
      templateName: 'Safety Inspection',
      status: 'in-progress',
      overallStatus: 'warning',
      items: [
        { id: 'item-5', title: 'Brake System', description: 'Check brake pads, rotors, fluid', category: 'brakes', status: 'pass', required: true, priority: 'critical', technician: 'Sarah Lee', completedAt: '2024-06-26T09:15:00Z' },
        { id: 'item-6', title: 'Tire Condition', description: 'Check tire tread, pressure, wear', category: 'tires', status: 'warning', required: true, priority: 'critical', technician: 'Sarah Lee', completedAt: '2024-06-26T09:25:00Z', notes: 'Front tires showing wear, recommend replacement soon' },
        { id: 'item-7', title: 'Lighting System', description: 'Check all lights and signals', category: 'lighting', status: 'pending', required: true, priority: 'high' },
        { id: 'item-8', title: 'Steering System', description: 'Check steering response and alignment', category: 'steering', status: 'pending', required: true, priority: 'high' }
      ],
      technician: 'Sarah Lee',
      customerName: 'Benjamin Clarke',
      vehicleInfo: '2021 Ford F-150 Lariat',
      licensePlate: 'XYZ-5678',
      startedAt: '2024-06-26T09:00:00Z',
      totalItems: 4,
      passedItems: 1,
      failedItems: 0,
      warningItems: 1,
      naItems: 0,
      isActive: true,
      createdAt: '2024-06-26T08:45:00Z',
      updatedAt: '2024-06-26T09:25:00Z'
    },
    {
      id: 'insp-003',
      workOrderId: 'WO-2024-003',
      templateId: 'template-1',
      templateName: 'Pre-Delivery Inspection',
      status: 'draft',
      overallStatus: 'pending',
      items: [
        { id: 'item-1', title: 'Exterior Body Inspection', description: 'Check for dents, scratches, paint issues', category: 'exterior', status: 'pending', required: true, priority: 'high' },
        { id: 'item-2', title: 'Interior Inspection', description: 'Check seats, dashboard, controls', category: 'interior', status: 'pending', required: true, priority: 'high' },
        { id: 'item-3', title: 'Engine Bay Inspection', description: 'Check engine components, fluids, belts', category: 'engine', status: 'pending', required: true, priority: 'critical' },
        { id: 'item-4', title: 'Test Drive', description: 'Road test for performance and handling', category: 'test-drive', status: 'pending', required: true, priority: 'critical' }
      ],
      technician: 'John Smith',
      customerName: 'Olivia Martinez',
      vehicleInfo: '2019 Honda CR-V',
      licensePlate: 'DEF-9012',
      startedAt: '2024-06-27T14:00:00Z',
      totalItems: 4,
      passedItems: 0,
      failedItems: 0,
      warningItems: 0,
      naItems: 0,
      isActive: true,
      createdAt: '2024-06-27T13:30:00Z',
      updatedAt: '2024-06-27T14:00:00Z'
    }
  ]);

  // Calculate summary metrics
  const summary: InspectionSummary = {
    totalInspections: inspections.length,
    completedInspections: inspections.filter(insp => insp.status === 'completed').length,
    pendingInspections: inspections.filter(insp => insp.status === 'draft' || insp.status === 'in-progress').length,
    failedInspections: inspections.filter(insp => insp.overallStatus === 'fail').length,
    averageCompletionTime: 45,
    passRate: Math.round((inspections.filter(insp => insp.overallStatus === 'pass').length / inspections.length) * 100),
    mostCommonIssues: [
      { issue: 'Tire Wear', count: 3 },
      { issue: 'Brake Pad Wear', count: 2 },
      { issue: 'Light Bulb Replacement', count: 1 }
    ]
  };

  // Filter inspections based on search and filters
  const filteredInspections = inspections.filter(inspection => {
    const matchesSearch = inspection.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inspection.workOrderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inspection.vehicleInfo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inspection.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inspection.templateName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || inspection.status === filterStatus;
    const matchesOverallStatus = filterOverallStatus === 'all' || inspection.overallStatus === filterOverallStatus;
    const matchesTechnician = filterTechnician === 'all' || inspection.technician === filterTechnician;
    
    return matchesSearch && matchesStatus && matchesOverallStatus && matchesTechnician;
  });

  const getStatusBadge = (status: DigitalInspection['status']) => {
    const statusConfig = {
      draft: { class: 'status-draft', text: 'Draft' },
      'in-progress': { class: 'status-in-progress', text: 'In Progress' },
      completed: { class: 'status-completed', text: 'Completed' },
      cancelled: { class: 'status-cancelled', text: 'Cancelled' }
    };

    const config = statusConfig[status];
    return <span className={`status-badge ${config.class}`}>{config.text}</span>;
  };

  const getOverallStatusBadge = (status: DigitalInspection['overallStatus']) => {
    const statusConfig = {
      pass: { class: 'overall-pass', text: 'Pass', icon: '✓' },
      fail: { class: 'overall-fail', text: 'Fail', icon: '✗' },
      warning: { class: 'overall-warning', text: 'Warning', icon: '⚠' },
      pending: { class: 'overall-pending', text: 'Pending', icon: '⏳' }
    };

    const config = statusConfig[status];
    return <span className={`overall-status-badge ${config.class}`}>{config.icon} {config.text}</span>;
  };

  const getProgressPercentage = (inspection: DigitalInspection) => {
    const completedItems = inspection.passedItems + inspection.failedItems + inspection.warningItems + inspection.naItems;
    return Math.round((completedItems / inspection.totalItems) * 100);
  };

  const handleViewInspection = (inspection: DigitalInspection) => {
    setSelectedInspection(inspection);
    setShowInspectionModal(true);
  };

  const handleEditInspection = (inspection: DigitalInspection) => {
    setSelectedInspection(inspection);
    setShowInspectionModal(true);
  };

  const handleCreateInspection = () => {
    setSelectedInspection(null);
    setShowInspectionModal(true);
  };

  const handleViewTemplate = (template: InspectionTemplate) => {
    setSelectedTemplate(template);
    setShowTemplateModal(true);
  };

  const handleCreateTemplate = () => {
    setSelectedTemplate(null);
    setShowTemplateModal(true);
  };

  const handleDeleteInspection = (inspectionId: string) => {
    setInspections(inspections.filter(insp => insp.id !== inspectionId));
  };

  const columns: TableColumn<DigitalInspection>[] = [
    { 
      key: 'workOrderId', 
      label: 'Work Order', 
      sortable: true,
      render: (value: any, row: DigitalInspection) => (
        <div className="work-order-cell">
          <div className="work-order-id">{String(value)}</div>
          <div className="template-name">{row.templateName}</div>
        </div>
      )
    },
    { 
      key: 'customerName', 
      label: 'Customer & Vehicle', 
      sortable: true,
      render: (value: any, row: DigitalInspection) => (
        <div className="customer-vehicle-cell">
          <div className="customer-name">{String(value)}</div>
          <div className="vehicle-info">{row.vehicleInfo} • {row.licensePlate}</div>
        </div>
      )
    },
    { 
      key: 'technician', 
      label: 'Technician', 
      sortable: true,
      render: (value: any) => <span className="technician-name">{String(value)}</span>
    },
    { 
      key: 'progress', 
      label: 'Progress', 
      sortable: false,
      render: (_: any, row: DigitalInspection) => (
        <div className="progress-cell">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${getProgressPercentage(row)}%` }}
            ></div>
          </div>
          <div className="progress-text">{getProgressPercentage(row)}%</div>
        </div>
      )
    },

    { 
      key: 'status', 
      label: 'Status', 
      sortable: true, 
      align: 'center',
      render: (status: any) => getStatusBadge(status as DigitalInspection['status'])
    },
    { 
      key: 'startedAt', 
      label: 'Started', 
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
      render: (_: any, row: DigitalInspection) => (
        <div className="action-buttons-cell">
          <button 
            className="btn-icon" 
            title="View Inspection" 
            onClick={() => handleViewInspection(row)}
          >
            <i className='bx bx-show'></i>
          </button>
          <button 
            className="btn-icon" 
            title="Edit Inspection" 
            onClick={() => handleEditInspection(row)}
          >
            <i className='bx bx-edit'></i>
          </button>
          <button 
            className="btn-icon btn-danger" 
            title="Delete Inspection" 
            onClick={() => handleDeleteInspection(row.id)}
          >
            <i className='bx bx-trash'></i>
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="digital-inspections-page">
      <div className="page-header">
        <div className="page-actions" style={{ marginLeft: 'auto', display: 'flex', gap: '12px' }}>
          <button className="btn btn--carbon" onClick={handleCreateTemplate}>
            <i className='bx bx-plus'></i>
            New Template
          </button>
          <button className="btn btn--carbon" onClick={handleCreateInspection}>
            <i className='bx bx-plus'></i>
            New Inspection
          </button>
        </div>
      </div>

      <div className="metric-cards-row">
        <MetricCard
          title="Total Inspections"
          amount={summary.totalInspections.toString()}
          change={`${summary.completedInspections} completed`}
          changeType="positive"
          period="this month"
        />
        <MetricCard
          title="Pending Inspections"
          amount={summary.pendingInspections.toString()}
          change={`${summary.averageCompletionTime}min avg`}
          changeType="positive"
          period="completion time"
        />
        <MetricCard
          title="Active Templates"
          amount={templates.filter(t => t.isActive).length.toString()}
          change="available templates"
          changeType="positive"
          period="for use"
        />
      </div>


      <Table 
        columns={columns}
        data={filteredInspections}
        onRowClick={(inspection) => handleViewInspection(inspection)}
        emptyMessage="No inspections found matching your search criteria."
      />

      {/* Inspection Modal */}
      {showInspectionModal && (
        <InspectionModal
          inspection={selectedInspection}
          templates={templates}
          onClose={() => setShowInspectionModal(false)}
          onSave={(inspection) => {
            if (selectedInspection) {
              setInspections(inspections.map(insp => 
                insp.id === inspection.id ? inspection : insp
              ));
            } else {
              setInspections([...inspections, inspection]);
            }
            setShowInspectionModal(false);
          }}
        />
      )}

      {/* Template Modal */}
      {showTemplateModal && (
        <TemplateModal
          template={selectedTemplate}
          onClose={() => setShowTemplateModal(false)}
          onSave={(template) => {
            // Handle template save logic
            setShowTemplateModal(false);
          }}
        />
      )}
    </div>
  );
};

export default DigitalInspections; 