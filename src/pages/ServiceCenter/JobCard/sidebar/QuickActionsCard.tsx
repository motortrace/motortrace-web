import React from 'react';

const QuickActionsCard: React.FC = () => (
  <div className="sidebar-card">
    <h3 className="sidebar-card__title">Quick Actions</h3>
    <div className="quick-actions">
      <button className="btn btn--secondary-emerald btn--full-width btn--left-aligned">
        📅 Schedule Follow-up
      </button>
      <button className="btn btn--secondary btn--full-width btn--left-aligned">
        📧 Email Customer
      </button>
      <button className="btn btn--secondary btn--full-width btn--left-aligned">
        📞 Call Customer
      </button>
    </div>
  </div>
);

export default QuickActionsCard;
