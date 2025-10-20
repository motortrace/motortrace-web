import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../hooks/useAuth';
import type { WorkOrderPart } from '../../types';
import { useTechnicians } from '../../hooks/useTechnicians';
import { useToast } from '../../../../hooks/useToast';
import AddPartToWorkOrderModal from '../modals/AddPartToWorkOrderModal';
import AssignTechnicianToPartModal from '../modals/AssignTechnicianToPartModal';

interface InventoryTabProps {
    workOrderId: string;
}

/**
 * InventoryTab Component
 * Displays work order parts/inventory items
 */
const InventoryTab: React.FC<InventoryTabProps> = ({ workOrderId }) => {
    const { token } = useAuth();
    const [parts, setParts] = useState<WorkOrderPart[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showAddPartModal, setShowAddPartModal] = useState(false);

    // Technician assignment state
    const { technicians, fetchTechnicians } = useTechnicians();
    const [showAssignTechnicianModal, setShowAssignTechnicianModal] = useState(false);
    const [selectedPart, setSelectedPart] = useState<WorkOrderPart | null>(null);
    const { showToast } = useToast();

    useEffect(() => {
        if (workOrderId && token) {
            fetchParts();
            fetchTechnicians();
        }
    }, [workOrderId, token]);

    /**
     * Fetch parts for the work order
     */
    const fetchParts = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(
                `http://localhost:3000/work-orders/${workOrderId}/parts`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error('Failed to fetch parts');
            }

            const result = await response.json();
            const partsData = result.success ? result.data : result;
            setParts(Array.isArray(partsData) ? partsData : []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            console.error('Error fetching parts:', err);
            setParts([]);
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Get status badge class
     */
    const getStatusBadgeClass = (status: string) => {
        const statusMap: Record<string, string> = {
            PENDING: 'status-badge--pending',
            ESTIMATED: 'status-badge--estimated',
            APPROVED: 'status-badge--approved',
            REJECTED: 'status-badge--rejected',
            ORDERED: 'status-badge--in-progress',
            RECEIVED: 'status-badge--approved',
            INSTALLED: 'status-badge--completed',
            RETURNED: 'status-badge--cancelled',
        };
        return statusMap[status] || 'status-badge--pending';
    };

    /**
     * Get source badge style
     */
    const getSourceBadgeStyle = (source: string) => {
        return source === 'INVENTORY'
            ? { background: '#dbeafe', color: '#1e40af', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }
            : { background: '#fef3c7', color: '#92400e', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '600' };
    };

    /**
     * Handle assign technician button click
     */
    const handleAssignTechnicianClick = (part: WorkOrderPart) => {
        setSelectedPart(part);
        setShowAssignTechnicianModal(true);
    };

    /**
     * Handle technician assignment
     */
    const handleAssignTechnician = async (technicianId: string) => {
        if (!selectedPart) return;

        try {
            const response = await fetch(
                `http://localhost:3000/work-orders/parts/${selectedPart.id}/assign-technician`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ technicianId }),
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to assign technician');
            }

            showToast('success', 'Assignment Successful', 'Technician successfully assigned to part');
            await fetchParts();
            await fetchTechnicians();
        } catch (error) {
            showToast('error', 'Assignment Failed', error instanceof Error ? error.message : 'Failed to assign technician');
            throw error;
        }
    };

    /**
     * Check if a part can be assigned a technician
     */
    const canAssignTechnician = (part: WorkOrderPart): boolean => {
        // Can't assign if in PENDING or ESTIMATED status (awaiting approval)
        if (part.status === 'PENDING' || part.status === 'ESTIMATED') {
            return false;
        }
        // Can't assign if already installed
        if (part.status === 'INSTALLED') {
            return false;
        }
        return true;
    };

    /**
     * Get tooltip message for assign button
     */
    const getAssignTooltip = (part: WorkOrderPart): string => {
        if (part.status === 'PENDING' || part.status === 'ESTIMATED') {
            return 'Cannot assign technician - part is awaiting approval';
        }
        if (part.status === 'INSTALLED') {
            return 'Part already installed';
        }
        return 'Assign technician';
    };

    if (isLoading) {
        return (
            <div className="tab-content" style={{ padding: '40px', textAlign: 'center' }}>
                <i className="bx bx-loader-alt bx-spin" style={{ fontSize: '32px', color: '#6366f1' }}></i>
                <p style={{ marginTop: '16px', color: '#6b7280' }}>Loading inventory...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="tab-content" style={{ padding: '40px', textAlign: 'center' }}>
                <i className="bx bx-error-circle" style={{ fontSize: '32px', color: '#ef4444' }}></i>
                <p style={{ marginTop: '16px', color: '#ef4444' }}>{error}</p>
                <button className="btn btn--secondary" onClick={fetchParts} style={{ marginTop: '16px' }}>
                    Retry
                </button>
            </div>
        );
    }

    if (parts.length === 0) {
        return (
            <div className="tab-content" style={{ padding: '24px' }}>
                {/* Add Part Button */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                    <button
                        onClick={() => setShowAddPartModal(true)}
                        className="btn btn--primary"
                        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        <i className="bx bx-plus"></i>
                        Add Part
                    </button>
                </div>

                <div style={{ padding: '40px', textAlign: 'center' }}>
                    <i className="bx bx-package" style={{ fontSize: '48px', color: '#d1d5db' }}></i>
                    <p style={{ marginTop: '16px', color: '#6b7280', fontSize: '16px' }}>No parts added yet</p>
                    <p style={{ marginTop: '8px', color: '#9ca3af', fontSize: '14px' }}>
                        Parts will appear here once they are added to this work order
                    </p>
                </div>

                {/* Add Part Modal */}
                <AddPartToWorkOrderModal
                    open={showAddPartModal}
                    onClose={() => setShowAddPartModal(false)}
                    workOrderId={workOrderId}
                    onPartAdded={fetchParts}
                />

                {/* Assign Technician Modal */}
                {selectedPart && (
                    <AssignTechnicianToPartModal
                        open={showAssignTechnicianModal}
                        onClose={() => {
                            setShowAssignTechnicianModal(false);
                            setSelectedPart(null);
                        }}
                        part={selectedPart}
                        technicians={Array.isArray(technicians) ? technicians.map(tech => ({ ...tech, isBusy: false })) : []}
                        onAssign={handleAssignTechnician}
                    />
                )}
            </div>
        );
    }

    return (
        <div className="tab-content" style={{ padding: '24px' }}>
            {/* Parts Summary */}
            <div className="parts-summary-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 20, marginBottom: 24, width: '100%' }}>
                <div className="parts-summary-card" style={{ background: '#f9fafb', borderRadius: 12, padding: '18px 24px', minWidth: 0, boxShadow: '0 1px 4px #0001', border: '1px solid #e5e7eb', width: '100%' }}>
                    <div style={{ color: '#6b7280', fontWeight: 600, fontSize: 15, marginBottom: 4 }}>Total Parts</div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: '#1f2937' }}>{parts.length}</div>
                </div>
                <div className="parts-summary-card" style={{ background: '#f9fafb', borderRadius: 12, padding: '18px 24px', minWidth: 0, boxShadow: '0 1px 4px #0001', border: '1px solid #e5e7eb', width: '100%' }}>
                    <div style={{ color: '#6b7280', fontWeight: 600, fontSize: 15, marginBottom: 4 }}>Installed</div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: '#1f2937' }}>
                        {parts.filter(p => p.status === 'INSTALLED').length}
                    </div>
                </div>
                <div className="parts-summary-card" style={{ background: '#f9fafb', borderRadius: 12, padding: '18px 24px', minWidth: 0, boxShadow: '0 1px 4px #0001', border: '1px solid #e5e7eb', width: '100%' }}>
                    <div style={{ color: '#6b7280', fontWeight: 600, fontSize: 15, marginBottom: 4 }}>Total Amount</div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: '#1f2937' }}>
                        LKR {parts.reduce((sum, p) => sum + Number(p.subtotal), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </div>
                </div>
            </div>

            {/* Add Part Button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                <button
                    onClick={() => setShowAddPartModal(true)}
                    className="btn btn--primary"
                    disabled={parts.some(p => p.status === 'ESTIMATED')}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: parts.some(p => p.status === 'ESTIMATED') ? 0.6 : 1 }}
                    title={parts.some(p => p.status === 'ESTIMATED') ? 'Cannot add parts while estimate is pending approval' : 'Add Part'}
                >
                    <i className="bx bx-plus"></i>
                    Add Part
                </button>
            </div>

            {/* Parts Table */}
            <div className="parts-table-container full-width-table">
                <table className="parts-table styled-table" style={{ width: '100%', minWidth: 900, fontSize: 13, borderCollapse: 'collapse', border: '1px solid #e5e7eb', background: '#fff' }}>
                    <thead>
                        <tr style={{ background: '#f9fafb' }}>
                            <th style={{ padding: '6px 10px', border: '1px solid #e5e7eb', textAlign: 'left' }}>Part Details</th>
                            <th style={{ padding: '6px 10px', border: '1px solid #e5e7eb', textAlign: 'center' }}>SKU / Part #</th>
                            <th style={{ padding: '6px 10px', border: '1px solid #e5e7eb', textAlign: 'center' }}>Quantity</th>
                            <th style={{ padding: '6px 10px', border: '1px solid #e5e7eb', textAlign: 'center' }}>Unit Price</th>
                            <th style={{ padding: '6px 10px', border: '1px solid #e5e7eb', textAlign: 'center' }}>Subtotal</th>
                            <th style={{ padding: '6px 10px', border: '1px solid #e5e7eb', textAlign: 'center' }}>Source</th>
                            <th style={{ padding: '6px 10px', border: '1px solid #e5e7eb', textAlign: 'center' }}>Status</th>
                            <th style={{ padding: '6px 10px', border: '1px solid #e5e7eb', textAlign: 'center' }}>Installed By</th>
                            <th style={{ padding: '6px 10px', border: '1px solid #e5e7eb', textAlign: 'center', width: '100px' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {parts.map((part) => (
                            <tr key={part.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                <td style={{ padding: '6px 10px', border: '1px solid #e5e7eb', textAlign: 'left', verticalAlign: 'middle' }}>
                                    <div style={{ fontWeight: '600', color: '#111827', marginBottom: '4px' }}>
                                        {part.part.name}
                                    </div>
                                    {part.description && (
                                        <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>
                                            {part.description}
                                        </div>
                                    )}
                                    {part.part.manufacturer && (
                                        <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
                                            {part.part.manufacturer}
                                            {part.part.isOEM && <span style={{ marginLeft: '6px', background: '#dcfce7', color: '#166534', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: '600' }}>OEM</span>}
                                        </div>
                                    )}
                                </td>
                                <td style={{ padding: '6px 10px', border: '1px solid #e5e7eb', textAlign: 'center', verticalAlign: 'middle' }}>
                                    <div style={{ fontSize: '13px', color: '#374151', fontWeight: '500' }}>
                                        {part.part.sku}
                                    </div>
                                    {part.part.partNumber && (
                                        <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>
                                            {part.part.partNumber}
                                        </div>
                                    )}
                                </td>
                                <td style={{ padding: '6px 10px', border: '1px solid #e5e7eb', textAlign: 'center', verticalAlign: 'middle' }}>
                                    <span style={{ fontSize: '15px', fontWeight: '600', color: '#111827' }}>
                                        {part.quantity}
                                    </span>
                                </td>
                                <td style={{ padding: '6px 10px', border: '1px solid #e5e7eb', textAlign: 'center', verticalAlign: 'middle' }}>
                                    <span style={{ fontSize: '14px', color: '#374151' }}>
                                        LKR {Number(part.unitPrice).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </span>
                                </td>
                                <td style={{ padding: '6px 10px', border: '1px solid #e5e7eb', textAlign: 'center', verticalAlign: 'middle' }}>
                                    <span style={{ fontWeight: '600', color: '#111827', fontSize: '15px' }}>
                                        LKR {Number(part.subtotal).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </span>
                                </td>
                                <td style={{ padding: '6px 10px', border: '1px solid #e5e7eb', textAlign: 'center', verticalAlign: 'middle' }}>
                                    <span style={getSourceBadgeStyle(part.source)}>
                                        {part.source}
                                    </span>
                                </td>
                                <td style={{ padding: '6px 10px', border: '1px solid #e5e7eb', textAlign: 'center', verticalAlign: 'middle' }}>
                                    <span className={`status-badge ${getStatusBadgeClass(part.status)}`}>
                                        {part.status}
                                    </span>
                                </td>
                                <td style={{ padding: '6px 10px', border: '1px solid #e5e7eb', textAlign: 'center', verticalAlign: 'middle' }}>
                                    {part.installedBy ? (
                                        <span style={{ fontSize: '14px', color: '#111827' }}>
                                            {part.installedBy.userProfile.name}
                                        </span>
                                    ) : (
                                        <span style={{ fontSize: '13px', color: '#9ca3af' }}>Not assigned</span>
                                    )}
                                </td>
                                <td style={{ padding: '6px 10px', border: '1px solid #e5e7eb', textAlign: 'center', verticalAlign: 'middle' }}>
                                    <button
                                        onClick={() => handleAssignTechnicianClick(part)}
                                        disabled={!canAssignTechnician(part)}
                                        style={{
                                            background: canAssignTechnician(part) ? '#3b82f6' : '#9ca3af',
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: 6,
                                            padding: '6px',
                                            fontSize: 16,
                                            cursor: canAssignTechnician(part) ? 'pointer' : 'not-allowed',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: '32px',
                                            height: '32px',
                                            margin: '0 auto',
                                            transition: 'all 0.2s ease',
                                            opacity: canAssignTechnician(part) ? 1 : 0.6
                                        }}
                                        title={getAssignTooltip(part)}
                                    >
                                        <i className="bx bx-user-plus" style={{ fontSize: '16px' }}></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add Part Modal */}
            <AddPartToWorkOrderModal
                open={showAddPartModal}
                onClose={() => setShowAddPartModal(false)}
                workOrderId={workOrderId}
                onPartAdded={fetchParts}
            />

            {/* Assign Technician Modal */}
            {selectedPart && (
                <AssignTechnicianToPartModal
                    open={showAssignTechnicianModal}
                    onClose={() => {
                        setShowAssignTechnicianModal(false);
                        setSelectedPart(null);
                    }}
                    part={selectedPart}
                    technicians={Array.isArray(technicians) ? technicians.map(tech => ({ ...tech, isBusy: false })) : []}
                    onAssign={handleAssignTechnician}
                />
            )}
        </div>
    );
};

export default InventoryTab;
