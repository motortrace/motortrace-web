import React from 'react';

interface CurrentWork {
  activeLaborItems: any[];
  activeInspections: any[];
  activeParts: any[];
}

interface CurrentWorkTabProps {
  currentWork: CurrentWork;
}

const CurrentWorkTab: React.FC<CurrentWorkTabProps> = ({ currentWork }) => {
  const totalActiveItems = currentWork.activeLaborItems.length +
                          currentWork.activeInspections.length +
                          currentWork.activeParts.length;

  return (
    <div className="current-work-tab">
      <div className="current-work-summary">
        <h3>Current Work Status</h3>
        <div className="summary-stats">
          <div className="summary-item">
            <span className="summary-value">{totalActiveItems}</span>
            <span className="summary-label">Total Active Items</span>
          </div>
          <div className="summary-item">
            <span className="summary-value">{currentWork.activeLaborItems.length}</span>
            <span className="summary-label">Active Labor Items</span>
          </div>
          <div className="summary-item">
            <span className="summary-value">{currentWork.activeInspections.length}</span>
            <span className="summary-label">Active Inspections</span>
          </div>
          <div className="summary-item">
            <span className="summary-value">{currentWork.activeParts.length}</span>
            <span className="summary-label">Active Parts</span>
          </div>
        </div>
      </div>

      <div className="current-work-sections">
        {/* Active Labor Items */}
        <div className="work-section">
          <h4>Active Labor Items</h4>
          {currentWork.activeLaborItems.length > 0 ? (
            <div className="work-items">
              {currentWork.activeLaborItems.map((item, index) => (
                <div key={index} className="work-item">
                  <div className="work-item-header">
                    <span className="work-item-title">{item.description || 'Labor Item'}</span>
                    <span className="work-item-status active">In Progress</span>
                  </div>
                  <div className="work-item-details">
                    <span>Estimated Hours: {item.estimatedHours || 'N/A'}</span>
                    <span>Rate: ${item.hourlyRate || 'N/A'}/hr</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-data">No active labor items</p>
          )}
        </div>

        {/* Active Inspections */}
        <div className="work-section">
          <h4>Active Inspections</h4>
          {currentWork.activeInspections.length > 0 ? (
            <div className="work-items">
              {currentWork.activeInspections.map((inspection, index) => (
                <div key={index} className="work-item">
                  <div className="work-item-header">
                    <span className="work-item-title">{inspection.name || 'Inspection'}</span>
                    <span className="work-item-status active">In Progress</span>
                  </div>
                  <div className="work-item-details">
                    <span>Type: {inspection.type || 'N/A'}</span>
                    <span>Priority: {inspection.priority || 'Normal'}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-data">No active inspections</p>
          )}
        </div>

        {/* Active Parts */}
        <div className="work-section">
          <h4>Active Parts</h4>
          {currentWork.activeParts.length > 0 ? (
            <div className="work-items">
              {currentWork.activeParts.map((part, index) => (
                <div key={index} className="work-item">
                  <div className="work-item-header">
                    <span className="work-item-title">{part.name || 'Part'}</span>
                    <span className="work-item-status active">In Progress</span>
                  </div>
                  <div className="work-item-details">
                    <span>Part Number: {part.partNumber || 'N/A'}</span>
                    <span>Quantity: {part.quantity || 1}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-data">No active parts</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CurrentWorkTab;