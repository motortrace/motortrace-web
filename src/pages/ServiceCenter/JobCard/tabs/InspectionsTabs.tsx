import React, { useState } from 'react';
import type { DigitalInspection, InspectionTemplate } from '../../../../types/Inspection';
import InspectionModal from '../../../../components/InspectionModal/InspectionModal';
import './InspectionsTabs.scss';

interface InspectionsTabProps {
  workOrderId?: string;
  customerName?: string;
  vehicleInfo?: string;
  licensePlate?: string;
  technician?: string;
}

const InspectionsTab: React.FC<InspectionsTabProps> = ({
  workOrderId = 'WO-2024-001',
  customerName = 'Amber Miller',
  vehicleInfo = '2020 Audi A4 Premium',
  licensePlate = 'ABC-1234',
  technician = 'Chuck Ivanes'
}) => {
  const [inspections, setInspections] = useState<DigitalInspection[]>([
    {
      id: 'insp-001',
      workOrderId: workOrderId,
      templateId: 'template-1',
      templateName: 'Pre-Delivery Inspection',
      status: 'completed',
      overallStatus: 'pass',
      items: [
        { id: 'item-1', title: 'Exterior Body Inspection', description: 'Check for dents, scratches, paint issues', category: 'exterior', status: 'pass', required: true, priority: 'high', technician, completedAt: '2024-06-25T10:30:00Z' },
        { id: 'item-2', title: 'Interior Inspection', description: 'Check seats, dashboard, controls', category: 'interior', status: 'pass', required: true, priority: 'high', technician, completedAt: '2024-06-25T10:35:00Z' },
        { id: 'item-3', title: 'Engine Bay Inspection', description: 'Check engine components, fluids, belts', category: 'engine', status: 'pass', required: true, priority: 'critical', technician, completedAt: '2024-06-25T10:45:00Z' },
        { id: 'item-4', title: 'Test Drive', description: 'Road test for performance and handling', category: 'test-drive', status: 'pass', required: true, priority: 'critical', technician, completedAt: '2024-06-25T11:00:00Z' }
      ],
      technician,
      customerName,
      vehicleInfo,
      licensePlate,
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
    }
  ]);

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

  const [selectedInspection, setSelectedInspection] = useState<DigitalInspection | null>(null);
  const [showInspectionModal, setShowInspectionModal] = useState(false);

  const handleCreateInspection = (template: InspectionTemplate) => {
    const newInspection: DigitalInspection = {
      id: `insp-${Date.now()}`,
      workOrderId,
      templateId: template.id,
      templateName: template.name,
      status: 'draft',
      overallStatus: 'pending',
      items: template.items.map(item => ({
        ...item,
        status: 'pending' as const,
        technician
      })),
      technician,
      customerName,
      vehicleInfo,
      licensePlate,
      startedAt: new Date().toISOString(),
      totalItems: template.items.length,
      passedItems: 0,
      failedItems: 0,
      warningItems: 0,
      naItems: 0,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setSelectedInspection(newInspection);
    setShowInspectionModal(true);
  };

  const handleViewInspection = (inspection: DigitalInspection) => {
    setSelectedInspection(inspection);
    setShowInspectionModal(true);
  };

  const handleSaveInspection = (inspection: DigitalInspection) => {
    if (selectedInspection) {
      setInspections(inspections.map(insp => 
        insp.id === inspection.id ? inspection : insp
      ));
    } else {
      setInspections([...inspections, inspection]);
    }
    setShowInspectionModal(false);
  };

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

  return (
    <div className="inspections-tab">
      <div className="inspections-header">
        <div className="header-content">
          <h3 className="section-title">Digital Inspections</h3>
          <p className="section-subtitle">Manage vehicle inspections for this work order</p>
        </div>
        <div className="header-actions">
          <button className="btn btn--primary" onClick={() => setShowInspectionModal(true)}>
            <i className='bx bx-plus'></i>
            New Inspection
          </button>
        </div>
      </div>

      {inspections.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <i className='bx bx-clipboard'></i>
          </div>
          <h4>No Inspections Yet</h4>
          <p>Create your first digital inspection to get started</p>
          <div className="template-options">
            <h5>Quick Start Templates</h5>
            <div className="template-grid">
              {templates.map(template => (
                <div key={template.id} className="template-card" onClick={() => handleCreateInspection(template)}>
                  <div className="template-icon">
                    <i className='bx bx-check-square'></i>
                  </div>
                  <div className="template-info">
                    <h6>{template.name}</h6>
                    <p>{template.description}</p>
                    <span className="template-meta">{template.items.length} items • {template.estimatedDuration} min</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="inspections-list">
          {inspections.map(inspection => (
            <div key={inspection.id} className="inspection-card" onClick={() => handleViewInspection(inspection)}>
              <div className="inspection-header">
                <div className="inspection-info">
                  <h4 className="inspection-title">{inspection.templateName}</h4>
                  <div className="inspection-meta">
                    <span className="template-category">{inspection.templateName}</span>
                    <span className="inspection-date">
                      {new Date(inspection.startedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="inspection-status">
                  {getOverallStatusBadge(inspection.overallStatus)}
                  {getStatusBadge(inspection.status)}
                </div>
              </div>
              
              <div className="inspection-progress">
                <div className="progress-header">
                  <span>Progress</span>
                  <span className="progress-percentage">{getProgressPercentage(inspection)}%</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${getProgressPercentage(inspection)}%` }}
                  ></div>
                </div>
                <div className="progress-stats">
                  <div className="stat-item">
                    <span className="stat-label">Passed</span>
                    <span className="stat-value passed">{inspection.passedItems}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Failed</span>
                    <span className="stat-value failed">{inspection.failedItems}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Warning</span>
                    <span className="stat-value warning">{inspection.warningItems}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">N/A</span>
                    <span className="stat-value na">{inspection.naItems}</span>
                  </div>
                </div>
              </div>

              <div className="inspection-actions">
                <button 
                  className="btn btn--secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewInspection(inspection);
                  }}
                >
                  <i className='bx bx-show'></i>
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Inspection Modal */}
      {showInspectionModal && (
        <InspectionModal
          inspection={selectedInspection}
          templates={templates}
          onClose={() => {
            setShowInspectionModal(false);
            setSelectedInspection(null);
          }}
          onSave={handleSaveInspection}
        />
      )}
    </div>
  );
};

export default InspectionsTab;
