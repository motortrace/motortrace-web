// src/components/Admin/ServiceAndPackageManagement/ServiceCard.tsx
import React, { useState } from 'react';
import { Clock, Eye, Edit, Ban, CheckCircle, Trash2, AlertTriangle, X } from 'lucide-react';
import type { Service } from '../../../types/ServicesAndPackages';
import './ServiceCard.scss';

interface ServiceCardProps {
  service: Service;
  onView: (service: Service) => void;
  onEdit: (service: Service) => void;
  onToggleAvailability: (id: string) => void;
  onDelete: (id: string) => void;
}

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  loading = false
}) => {
  if (!isOpen) return null;

  return (
    <div className="spm-confirm-overlay" onClick={onCancel}>
      <div className="spm-confirm-modal" onClick={e => e.stopPropagation()}>
        <div className="spm-confirm-header">
          <div className="spm-confirm-icon">
            <AlertTriangle size={24} />
          </div>
          <h3 className="spm-confirm-title">{title}</h3>
          <p className="spm-confirm-message">{message}</p>
        </div>
        <div className="spm-confirm-actions">
          <button 
            className="spm-confirm-cancel" 
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            className="spm-confirm-delete" 
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  onView,
  onEdit,
  onToggleAvailability,
  onDelete
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  // const [showViewModal, setShowViewModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleViewClick = () => {
    onView(service);
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    setDeleteLoading(true);
    try {
      await onDelete(service.id);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Delete failed:', error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
  };

  // const handleViewModalClose = () => {
  //   setShowViewModal(false);
  // };

  return (
    <>
      <div className={`spm-service-card ${!service.isActive ? 'spm-service-card--unavailable' : ''}`}>
        <div className="spm-service-card__content">
          <div className="spm-service-card__header">
            <span className="spm-service-card__code">{service.code}</span>
            <span className={`spm-service-card__status ${service.isActive ? 'available' : 'unavailable'}`}>
              {service.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
          
          <h3 className="spm-service-card__name">{service.name}</h3>
          
          {service.description && (
            <p className="spm-service-card__description">{service.description}</p>
          )}
          
          <div className="spm-service-card__meta">
            <span className="spm-service-card__price">
              LKR {(service.estimatedHours * service.hourlyRate).toLocaleString()}
            </span>
            <span className="spm-service-card__duration">
              <Clock size={14} /> {service.estimatedHours}h
            </span>
          </div>
          
          <div className="spm-service-card__actions">
            <button className="spm-btn spm-btn--secondary" onClick={handleViewClick}>
              <Eye size={16} /> View
            </button>
            <button className="spm-btn spm-btn--secondary" onClick={() => onEdit(service)}>
              <Edit size={16} /> Edit
            </button>
            <button
              className="spm-btn spm-btn--secondary"
              onClick={() => onToggleAvailability(service.id)}
            >
              {service.isActive ? (
                <>
                  <Ban size={16} /> Disable
                </>
              ) : (
                <>
                  <CheckCircle size={16} /> Enable
                </>
              )}
            </button>
            <button className="spm-btn spm-btn--danger" onClick={handleDeleteClick}>
              <Trash2 size={16} /> Delete
            </button>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showDeleteConfirm}
        title="Delete Service"
        message={`Are you sure you want to delete "${service.name}"? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        loading={deleteLoading}
      />

    </>
  );
};