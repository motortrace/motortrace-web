import React from 'react';
import './NotShippableModal.scss';

interface NotShippableModalProps {
  visible: boolean;
  reason: string;
  onReasonChange: (value: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
}

const NotShippableModal: React.FC<NotShippableModalProps> = ({
  visible,
  reason,
  onReasonChange,
  onCancel,
  onConfirm,
}) => {
  if (!visible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Mark as Not Shippable</h2>
        </div>
        <div className="modal-description">
          Please enter a reason. Confirming will process a refund for this item.
        </div>
        <div className="modal-textarea">
          <label htmlFor="reason">Reason</label>
          <textarea
            id="reason"
            value={reason}
            onChange={(e) => onReasonChange(e.target.value)}
            placeholder="Enter reason here..."
          />
        </div>
        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onCancel}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={onConfirm}
            disabled={!reason.trim()}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotShippableModal;
