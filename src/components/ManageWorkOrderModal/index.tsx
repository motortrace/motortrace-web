import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import TabNavigation from './components/TabNavigation';
import OverviewTab from './components/tabs/OverviewTab';
import InspectionsTab from './components/tabs/InspectionsTab';
import ServicesTab from './components/tabs/ServicesTab';
import AddInspectionModal from './components/modals/AddInspectionModal';
import AssignTechnicianModal from './components/modals/AssignTechnicianModal';
import GenerateInvoiceModal from './components/modals/GenerateInvoiceModal';
import { useWorkOrderModal } from './hooks/useWorkOrderModal';
import { useInspections } from './hooks/useInspections';
import { isServiceAdvisorRole } from './utils/helpers';
import type { ManageWorkOrderModalProps } from './types';
import '../WorkOrderModal/ManageWorkOrderModal.scss';

/**
 * ManageWorkOrderModal - Refactored Component
 * 
 * This is the main orchestration component that brings together all the
 * modular pieces of the work order management system.
 * 
 * Features:
 * - Tab-based navigation (Overview, Inspections)
 * - Role-based visibility
 * - Inspection management with templates
 * - Technician assignment
 * - Invoice generation
 */
const ManageWorkOrderModal: React.FC<ManageWorkOrderModalProps> = ({ open, onClose, workOrder, onUpdate }) => {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Initialize modal hook
  const modalHook = useWorkOrderModal({
    workOrderId: workOrder?.id || 0,
    onSuccess: () => {
      if (onUpdate) {
        onUpdate();
      }
      inspections.refetchInspections();
    },
  });

  // Initialize inspections hook
  const inspections = useInspections({
    workOrderId: workOrder?.id || 0,
  });

  // Fetch inspection templates on mount
  useEffect(() => {
    if (token && open) {
      fetchInspectionTemplates();
      fetchTechnicians();
    }
  }, [token, open]);

  /**
   * Fetch available inspection templates
   */
  const fetchInspectionTemplates = async () => {
    try {
      const response = await fetch('http://localhost:3000/inspection-templates/templates', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        modalHook.setInspectionTemplates(data);
      }
    } catch (error) {
      console.error('Error fetching inspection templates:', error);
    }
  };

  /**
   * Fetch available technicians
   */
  const fetchTechnicians = async () => {
    try {
      const response = await fetch('http://localhost:3000/technicians', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        modalHook.setTechnicians(data);
      }
    } catch (error) {
      console.error('Error fetching technicians:', error);
    }
  };

  /**
   * Handle modal close
   */
  const handleClose = () => {
    setActiveTab('overview');
    onClose();
  };

  /**
   * Handle backdrop click (close modal)
   */
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!open || !workOrder) {
    return null;
  }

  const isServiceAdvisor = isServiceAdvisorRole();

  return (
    <div className="manage-workorder-modal__overlay" onClick={handleBackdropClick}>
      <div className="manage-workorder-modal" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title">
            <h2>Manage Work Order</h2>
            <p className="modal-subtitle">
              Managing work order for {workOrder?.customer ? `${workOrder.customer.firstName} ${workOrder.customer.lastName}'s ${workOrder.vehicle ? `${workOrder.vehicle.year} ${workOrder.vehicle.make} ${workOrder.vehicle.model}` : 'vehicle'}` : 'customer'}
            </p>
            <div className="work-order-badges">
              <span className={`priority-badge priority-badge--${workOrder?.priority?.toLowerCase() || 'normal'}`}>
                <i className="bx bx-flag"></i> {workOrder?.priority || 'Normal'}
              </span>
              <span className={`status-badge status-badge--${workOrder?.status?.toLowerCase().replace('_', '-') || 'received'}`}>
                <i className="bx bx-check-circle"></i> {workOrder?.status?.replace('_', ' ') || 'Received'}
              </span>
              <span className="job-type-badge">
                <i className="bx bx-wrench"></i> {workOrder?.jobType || 'N/A'}
              </span>
            </div>
          </div>
          <div className="modal-header-actions">
            <button className="btn btn--secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <i className="bx bx-file-blank"></i>
              Publish Inspection Report
            </button>
            <button className="btn btn--primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <i className="bx bx-calculator"></i>
              Publish Estimate
            </button>
            {!isServiceAdvisor && (
              <button 
                className="btn btn--secondary" 
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                onClick={modalHook.openGenerateInvoiceModal}
              >
                <i className="bx bx-receipt"></i>
                Generate Invoice
              </button>
            )}
            <button className="close-btn" onClick={handleClose} title="Close">
              <i className="bx bx-x"></i>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Modal Body - Render active tab content */}
        <div className="modal-body">
          <div className="main-content" style={{ overflowY: 'auto', maxHeight: 'calc(95vh - 180px)' }}>
            {activeTab === 'overview' && <OverviewTab workOrder={workOrder} />}

            {activeTab === 'inspections' && (
              <InspectionsTab
                workOrderId={workOrder.id}
                onOpenAddInspectionModal={modalHook.openAddInspectionModal}
                onOpenAssignTechnicianModal={modalHook.openAssignTechnicianModal}
                isServiceAdvisor={isServiceAdvisor}
              />
            )}

            {/* Services tab */}
            {activeTab === 'services' && (
              <ServicesTab workOrderId={workOrder.id} />
            )}

            {/* Notes tab - Excluded per user request */}
            {activeTab === 'notes' && (
              <div className="tab-content">
                <p>Notes functionality coming soon...</p>
              </div>
            )}
          </div>
        </div>

        {/* Add Inspection Modal */}
        <AddInspectionModal
          show={modalHook.showAddInspectionModal}
          onClose={modalHook.closeAddInspectionModal}
          inspectionTemplates={modalHook.inspectionTemplates}
          selectedTemplateId={modalHook.selectedTemplateId}
          setSelectedTemplateId={modalHook.setSelectedTemplateId}
          inspectionNotes={modalHook.inspectionNotes}
          setInspectionNotes={modalHook.setInspectionNotes}
          onAssign={modalHook.handleAssignInspectionTemplate}
        />

        {/* Assign Technician Modal */}
        <AssignTechnicianModal
          show={modalHook.showAssignTechnicianModal}
          onClose={modalHook.closeAssignTechnicianModal}
          technicians={modalHook.technicians}
          selectedTechnicianId={modalHook.selectedTechnicianId}
          setSelectedTechnicianId={modalHook.setSelectedTechnicianId}
          onAssign={modalHook.handleAssignInspector}
          getTechnicianDisplayName={modalHook.getTechnicianDisplayName}
        />

        {/* Generate Invoice Modal */}
        <GenerateInvoiceModal
          show={modalHook.showGenerateInvoiceModal}
          onClose={modalHook.closeGenerateInvoiceModal}
          workOrder={workOrder}
          invoiceDueDate={modalHook.invoiceDueDate}
          setInvoiceDueDate={modalHook.setInvoiceDueDate}
          invoiceTerms={modalHook.invoiceTerms}
          setInvoiceTerms={modalHook.setInvoiceTerms}
          invoiceNotes={modalHook.invoiceNotes}
          setInvoiceNotes={modalHook.setInvoiceNotes}
          isGeneratingInvoice={modalHook.isGeneratingInvoice}
          onGenerate={modalHook.handleGenerateInvoice}
        />
      </div>
    </div>
  );
};

export default ManageWorkOrderModal;
