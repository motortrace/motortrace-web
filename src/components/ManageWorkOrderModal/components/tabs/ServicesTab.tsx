import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../hooks/useAuth';
import type { WorkOrderService, WorkOrderLaborItem } from '../../types';
import { getTechnicianDisplayName } from '../../utils/helpers';
import { useTechnicians } from '../../hooks/useTechnicians';
import AssignTechnicianToServiceModal from '../modals/AssignTechnicianToServiceModal';
import AssignTechnicianToLaborModal from '../modals/AssignTechnicianToLaborModal';

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
        <span className="approval-badge approval-badge--approved">
          <i className="bx bx-check-circle"></i> Approved
        </span>
      );
    }
    if (service.customerRejected) {
      return (
        <span className="approval-badge approval-badge--rejected">
          <i className="bx bx-x-circle"></i> Rejected
        </span>
      );
    }
    return (
      <span className="approval-badge approval-badge--pending">
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
      <div className="tab-content" style={{ padding: '40px', textAlign: 'center' }}>
        <i className="bx bx-wrench" style={{ fontSize: '48px', color: '#d1d5db' }}></i>
        <p style={{ marginTop: '16px', color: '#6b7280', fontSize: '16px' }}>No services added yet</p>
        <p style={{ marginTop: '8px', color: '#9ca3af', fontSize: '14px' }}>
          Services will appear here once they are added to this work order
        </p>
      </div>
    );
  }

  return (
    <div className="tab-content" style={{ padding: '24px' }}>
      {/* Services Summary */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
        <div style={{ flex: 1, padding: '20px', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Total Services</div>
          <div style={{ fontSize: '32px', fontWeight: '600', color: '#111827' }}>{services.length}</div>
        </div>
        <div style={{ flex: 1, padding: '20px', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <div style={{ fontSize: '14px', color: '#6c806bff', marginBottom: '8px' }}>Completed</div>
          <div style={{ fontSize: '32px', fontWeight: '600', color: '#10b981' }}>
            {services.filter(s => s.status === 'COMPLETED').length}
          </div>
        </div>
        <div style={{ flex: 1, padding: '20px', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Total Amount</div>
          <div style={{ fontSize: '32px', fontWeight: '600', color: '#111827' }}>
            LKR {services.reduce((sum, s) => sum + Number(s.subtotal), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      {/* Services Table */}
      <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Service Description
              </th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Subtotal
              </th>
              <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Status
              </th>
              <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Approval
              </th>
              <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', width: '150px' }} title="Labor items and assignment">
                Labor
              </th>
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
                    <td style={{ padding: '16px', verticalAlign: 'top' }}>
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
                    <td style={{ padding: '16px', textAlign: 'right', verticalAlign: 'top' }}>
                      <span style={{ fontWeight: '600', color: '#111827', fontSize: '15px' }}>
                        LKR {Number(service.subtotal).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center', verticalAlign: 'top' }}>
                      <span className={`status-badge ${getStatusBadgeClass(service.status)}`}>
                        {service.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center', verticalAlign: 'top' }}>
                      {getApprovalBadge(service)}
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center', verticalAlign: 'top' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        {hasLaborItems && (
                          <button
                            onClick={() => handleServiceAssignClick(service)}
                            style={{
                              background: 'none',
                              border: '1px solid #e5e7eb',
                              cursor: 'pointer',
                              padding: '6px 10px',
                              borderRadius: '6px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              color: '#6366f1',
                              fontSize: '13px',
                              fontWeight: '500',
                              transition: 'all 0.2s'
                            }}
                            title="Assign technician to all labor items"
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = '#eff6ff';
                              e.currentTarget.style.borderColor = '#6366f1';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent';
                              e.currentTarget.style.borderColor = '#e5e7eb';
                            }}
                          >
                            <i className="bx bx-user-check" style={{ fontSize: '16px' }}></i>
                            
                          </button>
                        )}
                        {hasLaborItems ? (
                        <button
                          onClick={() => toggleServiceExpansion(service.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            margin: '0 auto',
                            color: '#6366f1',
                            fontSize: '13px',
                            fontWeight: '500',
                          }}
                        >
                          <i className={`bx bx-chevron-${isExpanded ? 'up' : 'down'}`} style={{ fontSize: '18px' }}></i>
                          {service.laborItems!.length}
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
                      <td colSpan={6} style={{ padding: '0' }}>
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
                          <div style={{ backgroundColor: '#ffffff', borderRadius: '6px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                              <thead>
                                <tr style={{ backgroundColor: '#fafafa', borderBottom: '1px solid #e5e7eb' }}>
                                  <th style={{ padding: '10px 12px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                                    Description
                                  </th>
                                  <th style={{ padding: '10px 12px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                                    Technician
                                  </th>
                                  <th style={{ padding: '10px 12px', textAlign: 'center', fontSize: '11px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                                    Estimated
                                  </th>
                                  <th style={{ padding: '10px 12px', textAlign: 'center', fontSize: '11px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                                    Actual
                                  </th>
                                  <th style={{ padding: '10px 12px', textAlign: 'center', fontSize: '11px', fontWeight: '600', color: '#6d806bff', textTransform: 'uppercase' }}>
                                    Status
                                  </th>
                                  <th style={{ padding: '10px 12px', textAlign: 'center', fontSize: '11px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', width: '100px' }}>
                                    Action
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {service.laborItems!.map((labor, index) => (
                                  <tr key={labor.id} style={{ borderBottom: index < service.laborItems!.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                                    <td style={{ padding: '12px', verticalAlign: 'top' }}>
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
                                    <td style={{ padding: '12px', verticalAlign: 'top' }}>
                                      {labor.technician ? (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                          <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '600', color: '#6366f1' }}>
                                            {getTechnicianDisplayName(labor.technician).charAt(0)}
                                          </div>
                                          <span style={{ fontSize: '14px', color: '#111827' }}>
                                            {getTechnicianDisplayName(labor.technician)}
                                          </span>
                                        </div>
                                      ) : (
                                        <span style={{ fontSize: '13px', color: '#9ca3af' }}>Not assigned</span>
                                      )}
                                    </td>
                                    <td style={{ padding: '12px', textAlign: 'center', verticalAlign: 'top' }}>
                                      {labor.estimatedMinutes ? (
                                        <span style={{ fontSize: '14px', color: '#6b7280' }}>
                                          {formatMinutes(labor.estimatedMinutes)}
                                        </span>
                                      ) : (
                                        <span style={{ color: '#9ca3af' }}>—</span>
                                      )}
                                    </td>
                                    <td style={{ padding: '12px', textAlign: 'center', verticalAlign: 'top' }}>
                                      {labor.actualMinutes ? (
                                        <span style={{ fontSize: '14px', color: '#10b981', fontWeight: '500' }}>
                                          {formatMinutes(labor.actualMinutes)}
                                        </span>
                                      ) : (
                                        <span style={{ color: '#9ca3af' }}>—</span>
                                      )}
                                    </td>
                                    <td style={{ padding: '12px', textAlign: 'center', verticalAlign: 'top' }}>
                                      <span className={`status-badge ${getStatusBadgeClass(labor.status)}`} style={{ fontSize: '11px' }}>
                                        {labor.status.replace('_', ' ')}
                                      </span>
                                    </td>
                                    <td style={{ padding: '12px', textAlign: 'center', verticalAlign: 'top' }}>
                                      <button
                                        onClick={() => handleLaborAssignClick(labor)}
                                        style={{
                                          background: 'none',
                                          border: '1px solid #e5e7eb',
                                          cursor: 'pointer',
                                          padding: '4px 8px',
                                          borderRadius: '4px',
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: '4px',
                                          margin: '0 auto',
                                          color: '#6366f1',
                                          fontSize: '12px',
                                          fontWeight: '500',
                                          transition: 'all 0.2s'
                                        }}
                                        title="Assign technician to this labor item"
                                        onMouseEnter={(e) => {
                                          e.currentTarget.style.backgroundColor = '#eff6ff';
                                          e.currentTarget.style.borderColor = '#6366f1';
                                        }}
                                        onMouseLeave={(e) => {
                                          e.currentTarget.style.backgroundColor = 'transparent';
                                          e.currentTarget.style.borderColor = '#e5e7eb';
                                        }}
                                      >
                                        <i className="bx bx-user-plus" style={{ fontSize: '14px' }}></i>
                                        Assign
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
    </div>
  );
};

export default ServicesTab;
