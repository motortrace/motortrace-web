import React from 'react';

interface JobSummaryCardProps {
  calculateAuthorizedLabor: () => number;
  calculateAuthorizedParts: () => number;
  calculateTax: () => number;
  calculateTotal: () => number;
}

const JobSummaryCard: React.FC<JobSummaryCardProps> = ({ calculateAuthorizedLabor, calculateAuthorizedParts, calculateTax, calculateTotal }) => (
  <div className="sidebar-card">
    <h3 className="sidebar-card__title">Job Card Summary</h3>
    <div className="summary-list">
      <div className="summary-list__item">
        <span className="summary-list__label">Labor</span>
        <span className="summary-list__value">${calculateAuthorizedLabor().toFixed(2)}</span>
      </div>
      <div className="summary-list__item">
        <span className="summary-list__label">Parts</span>
        <span className="summary-list__value">${calculateAuthorizedParts().toFixed(2)}</span>
      </div>
      <div className="summary-list__item">
        <span className="summary-list__label">Tax (8%)</span>
        <span className="summary-list__value">${calculateTax().toFixed(2)}</span>
      </div>
      <div className="summary-list__total">
        <span className="summary-list__label">Total</span>
        <span className="summary-list__value">${calculateTotal().toFixed(2)}</span>
      </div>
    </div>
  </div>
);

export default JobSummaryCard;
