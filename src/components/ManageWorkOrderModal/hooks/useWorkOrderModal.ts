import { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { getTechnicianDisplayName } from '../utils/helpers';
import type { InspectionTemplate, TechnicianProfile } from '../types';

interface UseWorkOrderModalProps {
  workOrderId: number;
  onSuccess?: () => void;
}

export const useWorkOrderModal = ({ workOrderId, onSuccess }: UseWorkOrderModalProps) => {
  const { token } = useAuth();

  // Modal visibility states
  const [showAddInspectionModal, setShowAddInspectionModal] = useState(false);
  const [showAssignTechnicianModal, setShowAssignTechnicianModal] = useState(false);

  // Form states for Add Inspection Modal
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [inspectionNotes, setInspectionNotes] = useState('');

  // Form states for Assign Technician Modal
  const [selectedInspectionId, setSelectedInspectionId] = useState<string>('');
  const [selectedTechnicianId, setSelectedTechnicianId] = useState<string>('');

  // Form states for Generate Invoice (used for defaults)
  const [invoiceDueDate, setInvoiceDueDate] = useState<string>('');
  const [invoiceTerms, setInvoiceTerms] = useState('Net 14');
  const [invoiceNotes, setInvoiceNotes] = useState('Payment due within 14 days');
  const [isGeneratingInvoice, setIsGeneratingInvoice] = useState(false);

  // Data states
  const [inspectionTemplates, setInspectionTemplates] = useState<InspectionTemplate[]>([]);
  const [technicians, setTechnicians] = useState<TechnicianProfile[]>([]);

  /**
   * Open Add Inspection Modal
   */
  const openAddInspectionModal = (templateId?: string) => {
    if (templateId) {
      setSelectedTemplateId(templateId);
    }
    setShowAddInspectionModal(true);
  };

  /**
   * Close Add Inspection Modal and reset form
   */
  const closeAddInspectionModal = () => {
    setShowAddInspectionModal(false);
    setSelectedTemplateId('');
    setInspectionNotes('');
  };

  /**
   * Open Assign Technician Modal
   */
  const openAssignTechnicianModal = (inspectionId: string) => {
    setSelectedInspectionId(inspectionId);
    setShowAssignTechnicianModal(true);
  };

  /**
   * Close Assign Technician Modal and reset form
   */
  const closeAssignTechnicianModal = () => {
    setShowAssignTechnicianModal(false);
    setSelectedInspectionId('');
    setSelectedTechnicianId('');
  };

  /**
   * Handle assigning a technician to an inspection
   */
  const handleAssignInspector = async () => {
    console.log('=== Assign Inspector Debug ===');
    console.log('Selected Inspection ID:', selectedInspectionId);
    console.log('Selected Technician ID:', selectedTechnicianId);
    console.log('Token:', token ? 'Present' : 'Missing');

    if (!selectedInspectionId || !selectedTechnicianId) {
      console.error('Missing required IDs');
      return;
    }

    if (!token) {
      console.error('No authentication token');
      return;
    }

    try {
      const payload = {
        inspectorId: selectedTechnicianId,
      };

      console.log('Request Payload:', payload);

      const response = await fetch(
        `http://localhost:3000/inspection-templates/inspections/${selectedInspectionId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      console.log('Response Status:', response.status);
      const data = await response.json();
      console.log('Response Data:', data);

      if (response.ok) {
        console.log('Successfully assigned technician');
        closeAssignTechnicianModal();
        if (onSuccess) {
          onSuccess();
        } else {
          window.location.reload();
        }
      } else {
        console.error('Failed to assign technician:', data);
      }
    } catch (error) {
      console.error('Error assigning technician:', error);
    }
  };

  /**
   * Handle assigning an inspection template to the work order
   */
  const handleAssignInspectionTemplate = async () => {
    console.log('=== Assign Inspection Template Debug ===');
    console.log('Selected Template ID:', selectedTemplateId);
    console.log('Work Order ID:', workOrderId);
    console.log('Inspection Notes:', inspectionNotes);
    console.log('Token:', token ? 'Present' : 'Missing');

    if (!selectedTemplateId) {
      console.error('No template selected');
      return;
    }

    if (!workOrderId) {
      console.error('No work order ID');
      return;
    }

    if (!token) {
      console.error('No authentication token');
      return;
    }

    try {
      const payload = {
        workOrderId,
        templateId: selectedTemplateId,
        notes: inspectionNotes || undefined,
      };

      console.log('Request Payload:', payload);

      const response = await fetch(
        'http://localhost:3000/inspection-templates/work-orders/assign-template',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      console.log('Response Status:', response.status);
      const data = await response.json();
      console.log('Response Data:', data);

      if (response.ok) {
        console.log('Successfully assigned template');
        closeAddInspectionModal();
        if (onSuccess) {
          onSuccess();
        } else {
          window.location.reload();
        }
      } else {
        console.error('Failed to assign template:', data);
      }
    } catch (error) {
      console.error('Error assigning template:', error);
    }
  };

  /**
   * Handle generating an invoice for the work order
   */
  const handleGenerateInvoice = async () => {
    console.log('=== Generate Invoice Debug ===');
    console.log('Work Order ID:', workOrderId);
    console.log('Token:', token ? 'Present' : 'Missing');

    if (!workOrderId) {
      console.error('No work order ID');
      return;
    }

    if (!token) {
      console.error('No authentication token');
      return;
    }

    setIsGeneratingInvoice(true);

    try {
      // No payload needed - all info derived from workOrderId
      console.log('Request Payload: None (workOrderId in URL)');

      const response = await fetch(`http://localhost:3000/work-orders/${workOrderId}/generate-invoice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Response Status:', response.status);
      const data = await response.json();
      console.log('Response Data:', data);

      if (response.ok) {
        console.log('Successfully generated invoice');
        if (onSuccess) {
          onSuccess();
        } else {
          window.location.reload();
        }
      } else {
        console.error('Failed to generate invoice:', data);
        // Don't show alert, just log the error
      }
    } catch (error) {
      console.error('Error generating invoice:', error);
    } finally {
      setIsGeneratingInvoice(false);
    }
  };

  return {
    // Modal visibility states
    showAddInspectionModal,
    showAssignTechnicianModal,

    // Form states
    selectedTemplateId,
    setSelectedTemplateId,
    inspectionNotes,
    setInspectionNotes,
    selectedInspectionId,
    selectedTechnicianId,
    setSelectedTechnicianId,
    invoiceDueDate,
    setInvoiceDueDate,
    invoiceTerms,
    setInvoiceTerms,
    invoiceNotes,
    setInvoiceNotes,
    isGeneratingInvoice,

    // Data states
    inspectionTemplates,
    setInspectionTemplates,
    technicians,
    setTechnicians,

    // Modal control functions
    openAddInspectionModal,
    closeAddInspectionModal,
    openAssignTechnicianModal,
    closeAssignTechnicianModal,

    // Handler functions
    handleAssignInspector,
    handleAssignInspectionTemplate,
    handleGenerateInvoice,

    // Helper functions
    getTechnicianDisplayName,
  };
};
