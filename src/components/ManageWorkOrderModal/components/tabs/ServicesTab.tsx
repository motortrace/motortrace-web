import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../hooks/useAuth';
import type { WorkOrderService, WorkOrderLaborItem } from '../../types';
import { getTechnicianDisplayName } from '../../utils/helpers';
import { useTechnicians } from '../../hooks/useTechnicians';
import AssignTechnicianToServiceModal from '../modals/AssignTechnicianToServiceModal';
import AssignTechnicianToLaborModal from '../modals/AssignTechnicianToLaborModal';
import AddServiceToWorkOrderModal from '../modals/AddServiceToWorkOrderModal';

interface ServicesTabProps {
  workOrderId: string;
}

/**
 * ServicesTab Component
 * Displays work order services and their associated labor items
 */
const ServicesTab: React.FC<ServicesTabProps> = ({ workOrderId }) => {
  const { token } = useAuth();
  const [services, setServices] = useState<WorkOrderService[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedServiceIds, setExpandedServiceIds] = useState<Set<string>>(new Set());
  
  // Technician assignment state
  const { technicians, assignTechnicianToService, assignTechnicianToLabor, fetchTechnicians } = useTechnicians();
  const [showServiceAssignModal, setShowServiceAssignModal] = useState(false);
  const [showLaborAssignModal, setShowLaborAssignModal] = useState(false);
  const [selectedService, setSelectedService] = useState<WorkOrderService | null>(null);
  const [selectedLabor, setSelectedLabor] = useState<WorkOrderLaborItem | null>(null);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Add service modal state
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);

  useEffect(() => {
    if (workOrderId && token) {
      fetchServices();
    }
  }, [workOrderId, token]);

  /**
   * Fetch services for the work order
   */
  const fetchServices = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `http://localhost:3000/work-orders/${workOrderId}/services`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch services');
      }

      const result = await response.json();
      const servicesData = result.success ? result.data : [];
      setServices(Array.isArray(servicesData) ? servicesData : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching services:', err);
      setServices([]);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Toggle service expansion to show/hide labor items
   */
  const toggleServiceExpansion = (serviceId: string) => {
    setExpandedServiceIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(serviceId)) {
        newSet.delete(serviceId);
      } else {
        newSet.add(serviceId);
      }
      return newSet;
    });
  };

  /**
   * Get status badge class
   */
  const getStatusBadgeClass = (status: string) => {
    const statusMap: Record<string, string> = {
      ESTIMATED: 'status-badge--estimated',
      PENDING: 'status-badge--pending',
      IN_PROGRESS: 'status-badge--in-progress',
      COMPLETED: 'status-badge--completed',
      CANCELLED: 'status-badge--cancelled',
    };
    return statusMap[status] || 'status-badge--pending';
  };

  /**
   * Get approval status badge
   */
  const getApprovalBadge = (service: WorkOrderService) => {
    if (service.customerApproved) {
      return (
        <span className="status-badge status-badge--completed">
          <i className="bx bx-check-circle"></i> Approved
        </span>
      );
    }
    if (service.customerRejected) {
      return (
        <span className="status-badge status-badge--cancelled">
          <i className="bx bx-x-circle"></i> Rejected
        </span>
      );
    }
    return (
      <span className="status-badge status-badge--pending">
        <i className="bx bx-time-five"></i> Pending Approval
      </span>
    );
  };

  /**
   * Calculate total labor time
   */
  const calculateTotalLaborTime = (laborItems?: WorkOrderLaborItem[]) => {
    if (!laborItems || laborItems.length === 0) return { estimated: 0, actual: 0 };
    
    const estimated = laborItems.reduce((sum, item) => sum + (item.estimatedMinutes || 0), 0);
    const actual = laborItems.reduce((sum, item) => sum + (item.actualMinutes || 0), 0);
    
    return { estimated, actual };
  };

  /**
   * Format minutes to hours and minutes
   */
  const formatMinutes = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  /**
   * Show toast notification
   */
  const showToast = (type: 'success' | 'error', message: string) => {
    setToastMessage({ type, message });
    setTimeout(() => setToastMessage(null), 5000);
  };

  /**
   * Handle service assignment button click
   */
  const handleServiceAssignClick = (service: WorkOrderService) => {
    setSelectedService(service);
    setShowServiceAssignModal(true);
  };

  /**
   * Handle labor assignment button click
   */
  const handleLaborAssignClick = (labor: WorkOrderLaborItem) => {
    setSelectedLabor(labor);
    setShowLaborAssignModal(true);
  };

  /**
   * Handle service technician assignment
   */
  const handleServiceAssignment = async (technicianId: string) => {
    if (!selectedService) return;
    
    try {
      await assignTechnicianToService(selectedService.id, technicianId);
      showToast('success', 'Technician successfully assigned to all labor items under this service');
      await fetchServices(); // Refresh services to show updated assignments
      await fetchTechnicians(); // Refresh technician status
    } catch (error) {
      showToast('error', error instanceof Error ? error.message : 'Failed to assign technician');
      throw error;
    }
  };

  /**
   * Handle labor technician assignment
   */
  const handleLaborAssignment = async (technicianId: string) => {
    if (!selectedLabor) return;
    
    try {
      await assignTechnicianToLabor(selectedLabor.id, technicianId);
      showToast('success', 'Technician successfully assigned to labor item');
      await fetchServices(); // Refresh services to show updated assignments
      await fetchTechnicians(); // Refresh technician status
    } catch (error) {
      showToast('error', error instanceof Error ? error.message : 'Failed to assign technician');
      throw error;
    }
  };

  if (isLoading) {
    return (
      <div className="tab-content" style={{ padding: '40px', textAlign: 'center' }}>
        <i className="bx bx-loader-alt bx-spin" style={{ fontSize: '32px', color: '#6366f1' }}></i>
        <p style={{ marginTop: '16px', color: '#6b7280' }}>Loading services...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tab-content" style={{ padding: '40px', textAlign: 'center' }}>
        <i className="bx bx-error-circle" style={{ fontSize: '32px', color: '#ef4444' }}></i>
        <p style={{ marginTop: '16px', color: '#ef4444' }}>{error}</p>
        <button className="btn btn--secondary" onClick={fetchServices} style={{ marginTop: '16px' }}>
          Retry
        </button>
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="tab-content" style={{ padding: '24px' }}>
        {/* Add Service Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
          <button
            onClick={() => setShowAddServiceModal(true)}
            className="btn btn--primary"
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <i className="bx bx-plus"></i>
            Add Service
          </button>
        </div>

        <div style={{ padding: '40px', textAlign: 'center' }}>
          <i className="bx bx-wrench" style={{ fontSize: '48px', color: '#d1d5db' }}></i>
          <p style={{ marginTop: '16px', color: '#6b7280', fontSize: '16px' }}>No services added yet</p>
          <p style={{ marginTop: '8px', color: '#9ca3af', fontSize: '14px' }}>
            Services will appear here once they are added to this work order
          </p>
        </div>

        {/* Add Service Modal */}
        <AddServiceToWorkOrderModal
          open={showAddServiceModal}
          onClose={() => setShowAddServiceModal(false)}
          workOrderId={workOrderId}
          onServiceAdded={fetchServices}
        />
      </div>
    );
  }

  return (
    <div className="tab-content" style={{ padding: '24px' }}>
      {/* Services Summary */}
      <div className="services-summary-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 20, marginBottom: 24, width: '100%' }}>
        <div className="services-summary-card" style={{ background: '#f9fafb', borderRadius: 12, padding: '18px 24px', minWidth: 0, boxShadow: '0 1px 4px #0001', border: '1px solid #e5e7eb', width: '100%' }}>
          <div style={{ color: '#6b7280', fontWeight: 600, fontSize: 15, marginBottom: 4 }}>Total Services</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#1f2937' }}>{services.length}</div>
        </div>
        <div className="services-summary-card" style={{ background: '#f9fafb', borderRadius: 12, padding: '18px 24px', minWidth: 0, boxShadow: '0 1px 4px #0001', border: '1px solid #e5e7eb', width: '100%' }}>
          <div style={{ color: '#6b7280', fontWeight: 600, fontSize: 15, marginBottom: 4 }}>Completed</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#1f2937' }}>
            {services.filter(s => s.status === 'COMPLETED').length}
          </div>
        </div>
        <div className="services-summary-card" style={{ background: '#f9fafb', borderRadius: 12, padding: '18px 24px', minWidth: 0, boxShadow: '0 1px 4px #0001', border: '1px solid #e5e7eb', width: '100%' }}>
          <div style={{ color: '#6b7280', fontWeight: 600, fontSize: 15, marginBottom: 4 }}>Total Amount</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#1f2937' }}>
            LKR {services.reduce((sum, s) => sum + Number(s.subtotal), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      {/* Add Service Button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <button
          onClick={() => setShowAddServiceModal(true)}
          className="btn btn--primary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <i className="bx bx-plus"></i>
          Add Service
        </button>
      </div>

      {/* Services Table */}
      <div className="services-table-container full-width-table">
        <table className="services-table styled-table" style={{ width: '100%', minWidth: 900, fontSize: 13, borderCollapse: 'collapse', border: '1px solid #e5e7eb', background: '#fff' }}>
          <thead>
            <tr style={{ background: '#f9fafb' }}>
              <th style={{ padding: '6px 10px', border: '1px solid #e5e7eb' }}>Service Description</th>
              <th style={{ padding: '6px 10px', border: '1px solid #e5e7eb' }}>Subtotal</th>
              <th style={{ padding: '6px 10px', border: '1px solid #e5e7eb' }}>Status</th>
              <th style={{ padding: '6px 10px', border: '1px solid #e5e7eb' }}>Approval</th>
              <th style={{ padding: '6px 10px', border: '1px solid #e5e7eb', width: '150px' }} title="Labor items and assignment">Labor</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => {
              const isExpanded = expandedServiceIds.has(service.id);
              const hasLaborItems = service.laborItems && service.laborItems.length > 0;
              const laborTime = calculateTotalLaborTime(service.laborItems);

              return (
                <React.Fragment key={service.id}>
                  {/* Service Row */}
                  <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '6px 10px', border: '1px solid #e5e7eb', textAlign: 'left', verticalAlign: 'middle' }}>
                      <div style={{ fontWeight: '500', color: '#111827', marginBottom: '4px' }}>
                        {service.description}
                      </div>
                      {service.cannedService && (
                        <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>
                          <i className="bx bx-package" style={{ fontSize: '14px' }}></i> {service.cannedService.name}
                        </div>
                      )}
                      {service.notes && (
                        <div style={{ fontSize: '13px', color: '#6b7280', fontStyle: 'italic', marginTop: '4px' }}>
                          {service.notes}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '6px 10px', border: '1px solid #e5e7eb', textAlign: 'center', verticalAlign: 'middle' }}>
                      <span style={{ fontWeight: '600', color: '#111827', fontSize: '15px' }}>
                        LKR {Number(service.subtotal).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td style={{ padding: '6px 10px', border: '1px solid #e5e7eb', textAlign: 'center', verticalAlign: 'middle' }}>
                      <span className={`status-badge ${getStatusBadgeClass(service.status)}`}>
                        {service.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td style={{ padding: '6px 10px', border: '1px solid #e5e7eb', textAlign: 'center', verticalAlign: 'middle' }}>
                      {getApprovalBadge(service)}
                    </td>
                    <td style={{ padding: '6px 10px', border: '1px solid #e5e7eb', textAlign: 'center', verticalAlign: 'middle' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        {hasLaborItems && (
                          <button
                            onClick={() => handleServiceAssignClick(service)}
                            style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 6, padding: '6px', fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', transition: 'all 0.2s ease' }}
                            title="Assign technician to all labor items"
                          >
                            <i className="bx bx-user-check" style={{ fontSize: '16px' }}></i>
                          </button>
                        )}
                        {hasLaborItems ? (
                        <button
                          onClick={() => toggleServiceExpansion(service.id)}
                          style={{ background: '#10b981', color: '#fff', border: 'none', borderRadius: 6, padding: '6px', fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', transition: 'all 0.2s ease' }}
                          title="Toggle labor items"
                        >
                          <i className={`bx bx-chevron-${isExpanded ? 'up' : 'down'}`} style={{ fontSize: '18px' }}></i>
                        </button>
                      ) : (
                        <span style={{ color: '#9ca3af', fontSize: '13px' }}>—</span>
                      )}
                      </div>
                    </td>
                  </tr>

                  {/* Expanded Labor Items */}
                  {isExpanded && hasLaborItems && (
                    <tr style={{ backgroundColor: '#f9fafb' }}>
                      <td colSpan={6} style={{ padding: '0', border: '1px solid #e5e7eb' }}>
                        <div style={{ padding: '16px 24px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                            <i className="bx bx-wrench" style={{ fontSize: '16px', color: '#6b7280' }}></i>
                            <span style={{ fontSize: '13px', fontWeight: '600', color: '#374151', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                              Labor Items ({service.laborItems!.length})
                            </span>
                            <span style={{ fontSize: '13px', color: '#6b7280', marginLeft: 'auto' }}>
                              Est: {formatMinutes(laborTime.estimated)}
                              {laborTime.actual > 0 && ` • Actual: ${formatMinutes(laborTime.actual)}`}
                            </span>
                          </div>

                          {/* Labor Items Table */}
                          <div className="labor-table-container" style={{ backgroundColor: '#ffffff', borderRadius: '6px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                            <table className="labor-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                              <thead>
                                <tr style={{ backgroundColor: '#fafafa' }}>
                                  <th style={{ padding: '6px 10px', border: '1px solid #e5e7eb', textAlign: 'left' }}>Description</th>
                                  <th style={{ padding: '6px 10px', border: '1px solid #e5e7eb', textAlign: 'center' }}>Technician</th>
                                  <th style={{ padding: '6px 10px', border: '1px solid #e5e7eb', textAlign: 'center' }}>Estimated</th>
                                  <th style={{ padding: '6px 10px', border: '1px solid #e5e7eb', textAlign: 'center' }}>Actual</th>
                                  <th style={{ padding: '6px 10px', border: '1px solid #e5e7eb', textAlign: 'center' }}>Status</th>
                                  <th style={{ padding: '6px 10px', border: '1px solid #e5e7eb', textAlign: 'center', width: '100px' }}>Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {service.laborItems!.map((labor, index) => (
                                  <tr key={labor.id} style={{ borderBottom: index < service.laborItems!.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                                    <td style={{ padding: '6px 10px', border: '1px solid #e5e7eb', textAlign: 'left', verticalAlign: 'middle' }}>
                                      <div style={{ fontSize: '14px', color: '#111827', fontWeight: '500', marginBottom: '4px' }}>
                                        {labor.description}
                                      </div>
                                      {labor.notes && (
                                        <div style={{ fontSize: '12px', color: '#6b7280', fontStyle: 'italic' }}>
                                          {labor.notes}
                                        </div>
                                      )}
                                      {labor.startTime && labor.endTime && (
                                        <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
                                          <i className="bx bx-time-five"></i> {new Date(labor.startTime).toLocaleTimeString()} - {new Date(labor.endTime).toLocaleTimeString()}
                                        </div>
                                      )}
                                    </td>
                                    <td style={{ padding: '6px 10px', border: '1px solid #e5e7eb', textAlign: 'center', verticalAlign: 'middle' }}>
                                      {labor.technician ? (
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                          {labor.technician.userProfile?.profileImage ? (
                                            <img 
                                              src={labor.technician.userProfile.profileImage} 
                                              alt={getTechnicianDisplayName(labor.technician)} 
                                              style={{ width: 26, height: 26, borderRadius: '50%', objectFit: 'cover', border: '1px solid #e5e7eb' }} 
                                            />
                                          ) : (
                                            <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '600', color: '#6366f1' }}>
                                              {getTechnicianDisplayName(labor.technician).charAt(0)}
                                            </div>
                                          )}
                                          <span style={{ fontSize: '14px', color: '#111827' }}>
                                            {getTechnicianDisplayName(labor.technician)}
                                          </span>
                                        </div>
                                      ) : (
                                        <span style={{ fontSize: '13px', color: '#9ca3af' }}>Not assigned</span>
                                      )}
                                    </td>
                                    <td style={{ padding: '6px 10px', border: '1px solid #e5e7eb', textAlign: 'center', verticalAlign: 'middle' }}>
                                      {labor.estimatedMinutes ? (
                                        <span style={{ fontSize: '14px', color: '#6b7280' }}>
                                          {formatMinutes(labor.estimatedMinutes)}
                                        </span>
                                      ) : (
                                        <span style={{ color: '#9ca3af' }}>—</span>
                                      )}
                                    </td>
                                    <td style={{ padding: '6px 10px', border: '1px solid #e5e7eb', textAlign: 'center', verticalAlign: 'middle' }}>
                                      {labor.actualMinutes ? (
                                        <span style={{ fontSize: '14px', color: '#10b981', fontWeight: '500' }}>
                                          {formatMinutes(labor.actualMinutes)}
                                        </span>
                                      ) : (
                                        <span style={{ color: '#9ca3af' }}>—</span>
                                      )}
                                    </td>
                                    <td style={{ padding: '6px 10px', border: '1px solid #e5e7eb', textAlign: 'center', verticalAlign: 'middle' }}>
                                      <span className={`status-badge ${getStatusBadgeClass(labor.status)}`} style={{ fontSize: '11px' }}>
                                        {labor.status.replace('_', ' ')}
                                      </span>
                                    </td>
                                    <td style={{ padding: '6px 10px', border: '1px solid #e5e7eb', textAlign: 'center', verticalAlign: 'middle' }}>
                                      <button
                                        onClick={() => handleLaborAssignClick(labor)}
                                        style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 6, padding: '6px', fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', transition: 'all 0.2s ease' }}
                                        title="Assign technician to this labor item"
                                      >
                                        <i className="bx bx-user-plus" style={{ fontSize: '14px' }}></i>
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className={`toast-notification ${toastMessage.type}`}>
          <i className={`bx ${toastMessage.type === 'success' ? 'bx-check-circle' : 'bx-error-circle'}`}></i>
          <div className="toast-content">
            <div className="toast-title">
              {toastMessage.type === 'success' ? 'Success' : 'Error'}
            </div>
            <div className="toast-message">{toastMessage.message}</div>
          </div>
          <button className="toast-close" onClick={() => setToastMessage(null)}>
            <i className="bx bx-x"></i>
          </button>
        </div>
      )}

      {/* Assignment Modals */}
      {selectedService && (
        <AssignTechnicianToServiceModal
          open={showServiceAssignModal}
          onClose={() => {
            setShowServiceAssignModal(false);
            setSelectedService(null);
          }}
          service={selectedService}
          technicians={technicians}
          onAssign={handleServiceAssignment}
        />
      )}

      {selectedLabor && (
        <AssignTechnicianToLaborModal
          open={showLaborAssignModal}
          onClose={() => {
            setShowLaborAssignModal(false);
            setSelectedLabor(null);
          }}
          laborItem={selectedLabor}
          technicians={technicians}
          onAssign={handleLaborAssignment}
        />
      )}

      {/* Add Service Modal */}
      <AddServiceToWorkOrderModal
        open={showAddServiceModal}
        onClose={() => setShowAddServiceModal(false)}
        workOrderId={workOrderId}
        onServiceAdded={fetchServices}
      />
    </div>
  );
};

export default ServicesTab;
