import React, { useState } from 'react';
import type { TechnicianWithStatus, WorkOrderPart } from '../../types';
import { getTechnicianDisplayName } from '../../utils/helpers';

interface AssignTechnicianToPartModalProps {
    open: boolean;
    onClose: () => void;
    part: WorkOrderPart;
    technicians: TechnicianWithStatus[];
    onAssign: (technicianId: string) => Promise<void>;
}

const AssignTechnicianToPartModal: React.FC<AssignTechnicianToPartModalProps> = ({
    open,
    onClose,
    part,
    technicians,
    onAssign,
}) => {
    const [selectedTechnicianId, setSelectedTechnicianId] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Reset form when modal opens or part changes
    React.useEffect(() => {
        if (open) {
            // Pre-select currently assigned technician if exists
            setSelectedTechnicianId(part.installedBy?.id || '');
            setError(null);
        }
    }, [open, part]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!selectedTechnicianId) {
            setError('Please select a technician');
            return;
        }

        setIsSubmitting(true);

        try {
            await onAssign(selectedTechnicianId);
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to assign technician');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!open) return null;

    return (
        <div className="manage-workorder-modal__overlay" onClick={onClose}>
            <div
                className="manage-workorder-modal"
                onClick={(e) => e.stopPropagation()}
                style={{ maxWidth: '500px', width: '100%', maxHeight: '90vh', overflow: 'auto' }}
            >
                <div className="modal-header">
                    <div className="modal-title">
                        <h2>Assign Technician to Part</h2>
                        <p>Assign a technician to install this part</p>
                    </div>
                    <button className="close-btn" onClick={onClose} title="Close">
                        <i className="bx bx-x"></i>
                    </button>
                </div>

                <div className="modal-body" style={{ width: '100%' }}>
                    <form onSubmit={handleSubmit} style={{ padding: '24px', width: '100%', boxSizing: 'border-box' }}>
                        {/* Part Info */}
                        <div
                            style={{
                                backgroundColor: '#f9fafb',
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                                padding: '16px',
                                marginBottom: '24px',
                                width: '100%',
                                boxSizing: 'border-box',
                            }}
                        >
                            <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>
                                {part.part.name}
                            </div>
                            {part.description && (
                                <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>
                                    {part.description}
                                </div>
                            )}
                            <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                                SKU: {part.part.sku} • Quantity: {part.quantity}
                            </div>
                        </div>

                        {error && (
                            <div
                                style={{
                                    backgroundColor: '#fef2f2',
                                    border: '1px solid #fecaca',
                                    borderRadius: '6px',
                                    padding: '12px',
                                    marginBottom: '20px',
                                    color: '#dc2626',
                                    fontSize: '14px',
                                }}
                            >
                                <i className="bx bx-error-circle" style={{ marginRight: '8px' }}></i>
                                {error}
                            </div>
                        )}

                        {/* Technician Selection */}
                        <div style={{ marginBottom: '24px', width: '100%' }}>
                            <label
                                style={{
                                    display: 'block',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    color: '#374151',
                                    marginBottom: '12px',
                                }}
                            >
                                Select Technician *
                            </label>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                                {technicians.length === 0 ? (
                                    <div
                                        style={{
                                            padding: '16px',
                                            textAlign: 'center',
                                            color: '#6b7280',
                                            fontSize: '14px',
                                        }}
                                    >
                                        No technicians available
                                    </div>
                                ) : (
                                    technicians.map((tech) => {
                                        const displayName = getTechnicianDisplayName(tech);
                                        const isCurrentlyAssigned = part.installedBy?.id === tech.id;

                                        return (
                                            <div
                                                key={tech.id}
                                                onClick={() => setSelectedTechnicianId(tech.id)}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    padding: '12px',
                                                    border: `2px solid ${selectedTechnicianId === tech.id ? '#6366f1' : '#e5e7eb'}`,
                                                    borderRadius: '8px',
                                                    cursor: 'pointer',
                                                    backgroundColor: selectedTechnicianId === tech.id ? '#eef2ff' : '#fff',
                                                    transition: 'all 0.2s ease',
                                                    width: '100%',
                                                    boxSizing: 'border-box',
                                                }}
                                            >
                                                {tech.userProfile?.profileImage ? (
                                                    <img
                                                        src={tech.userProfile.profileImage}
                                                        alt={displayName}
                                                        style={{
                                                            width: 36,
                                                            height: 36,
                                                            borderRadius: '50%',
                                                            objectFit: 'cover',
                                                            marginRight: '12px',
                                                            border: '2px solid #e5e7eb',
                                                            flexShrink: 0,
                                                        }}
                                                    />
                                                ) : (
                                                    <div
                                                        style={{
                                                            width: 36,
                                                            height: 36,
                                                            borderRadius: '50%',
                                                            backgroundColor: '#e0e7ff',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            marginRight: '12px',
                                                            fontSize: '14px',
                                                            fontWeight: '600',
                                                            color: '#6366f1',
                                                            flexShrink: 0,
                                                        }}
                                                    >
                                                        {displayName.charAt(0)}
                                                    </div>
                                                )}

                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>
                                                        {displayName}
                                                        {isCurrentlyAssigned && (
                                                            <span
                                                                style={{
                                                                    marginLeft: '8px',
                                                                    fontSize: '12px',
                                                                    color: '#10b981',
                                                                    fontWeight: '500',
                                                                }}
                                                            >
                                                                (Currently Assigned)
                                                            </span>
                                                        )}
                                                    </div>
                                                    {tech.specialization && (
                                                        <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
                                                            {tech.specialization}
                                                        </div>
                                                    )}
                                                    {tech.isBusy && (
                                                        <div
                                                            style={{
                                                                fontSize: '12px',
                                                                color: '#f59e0b',
                                                                marginTop: '4px',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '4px',
                                                            }}
                                                        >
                                                            <i className="bx bx-info-circle"></i>
                                                            Currently working on other tasks
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                gap: '12px',
                                paddingTop: '20px',
                                borderTop: '1px solid #e5e7eb',
                            }}
                        >
                            <button
                                type="button"
                                onClick={onClose}
                                className="btn btn--secondary"
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn btn--primary"
                                disabled={isSubmitting || !selectedTechnicianId}
                                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                            >
                                {isSubmitting ? (
                                    <>
                                        <i className="bx bx-loader-alt bx-spin"></i>
                                        Assigning...
                                    </>
                                ) : (
                                    <>
                                        <i className="bx bx-user-check"></i>
                                        Assign Technician
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AssignTechnicianToPartModal;
