import React, { useState } from 'react';
import './DateRangeModal.scss';

interface DateRangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (from: string, to: string) => void;
  reportName: string;
}

const DateRangeModal: React.FC<DateRangeModalProps> = ({
  isOpen,
  onClose,
  onGenerate,
  reportName,
}) => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  if (!isOpen) return null;

  return (
    <div className="date-range-modal__overlay">
      <div className="date-range-modal">
        <h3>Generate {reportName}</h3>
        <div className="modal-fields">
          <div>
            <label>From</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>
          <div>
            <label>To</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
        </div>
        <div className="modal-actions">
          <button onClick={onClose}>Cancel</button>
          <button
            className="primary"
            onClick={() => {
              onGenerate(fromDate, toDate);
              onClose();
            }}
            disabled={!fromDate || !toDate}
          >
            Generate
          </button>
        </div>
      </div>
    </div>
  );
};

export default DateRangeModal;
