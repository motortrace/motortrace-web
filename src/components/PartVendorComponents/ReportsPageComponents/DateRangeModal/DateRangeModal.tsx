import React, { useState } from 'react';
import { FaChartBar, FaListUl } from 'react-icons/fa';
import './DateRangeModal.scss';

interface DateRangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (from: string, to: string, type: 'summary' | 'stats') => void;
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
  const [reportType, setReportType] = useState<'summary' | 'stats'>('stats');

  if (!isOpen) return null;

  return (
    <div className="date-range-modal__overlay">
      <div className="date-range-modal">
        <h3>Generate {reportName}</h3>

        <div className="modal-select">
          <label>Report Type</label>
          <div className="custom-dropdown">
            <div
              className={`dropdown-option ${reportType === 'stats' ? 'active' : ''}`}
              onClick={() => setReportType('stats')}
            >
              <FaChartBar className="dropdown-icon" />
              <span>Stats Report</span>
            </div>
            <div
              className={`dropdown-option ${reportType === 'summary' ? 'active' : ''}`}
              onClick={() => setReportType('summary')}
            >
              <FaListUl className="dropdown-icon" />
              <span>Summary Report</span>
            </div>
          </div>
        </div>

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
              onGenerate(fromDate, toDate, reportType);
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
