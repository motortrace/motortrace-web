import React from 'react';
import './ConfirmationModal.scss';

interface ConfirmationModalProps {
  open: boolean;
  title: string;
  description?: string;
  showReasonInput?: boolean;
  reason?: string;
  onReasonChange?: (value: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  open,
  title,
  description,
  showReasonInput = false,
  reason = '',
  onReasonChange,
  onConfirm,
  onCancel,
  confirmLabel = 'Confirm',
}) => {
  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>{title}</h2>
        </div>
        {description && <p className="modal-description">{description}</p>}

        {showReasonInput && (
          <div className="modal-textarea">
            <label>Reason</label>
            <textarea
              value={reason}
              onChange={(e) => onReasonChange?.(e.target.value)}
              placeholder="Enter reason for declining the order"
            />
          </div>
        )}

        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onCancel}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={onConfirm}
            disabled={showReasonInput && !reason}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
