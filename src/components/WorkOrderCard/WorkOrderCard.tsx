import React from 'react';
import type { WorkOrder } from '../../types/WorkOrder';
import './WorkOrderCard.scss';

interface WorkOrderCardProps {
  workOrder: WorkOrder;
  onMove: (cardId: string, newStatus: WorkOrder['status']) => void;
}

const WorkOrderCard: React.FC<WorkOrderCardProps> = ({ workOrder, onMove }) => {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', workOrder.id);
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const handleTechnicianClick = (technicianId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card drag when clicking technician
    console.log('Technician clicked:', technicianId);
    // Add your technician click handler here
  };

  const truncateTitle = (title: string, maxLength: number = 35) => {
    if (title.length <= maxLength) return title;
    return title.substring(0, maxLength) + '...';
  };

  const truncateText = (text: string, maxLength: number = 25) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div 
      className="work-order-card"
      draggable
      onDragStart={handleDragStart}
    >
      <div className="card-header">
        <span className="estimate-number" title={workOrder.title}>
          ({workOrder.estimateNumber}) {truncateTitle(workOrder.title)}
        </span>
        <button className="card-menu">
          <i className='bx bx-dots-horizontal-rounded'></i>
        </button>
      </div>

      <div className="card-content">
        <div className="vehicle-info">
          <div className="info-row">
            <div className="icon-wrapper">
              <i className='bx bx-car'></i>
            </div>
            <span className="vehicle-name" title={workOrder.vehicle}>
              {truncateText(workOrder.vehicle)}
            </span>
          </div>
          
          <div className="info-row">
            <div className="icon-wrapper">
              <i className='bx bx-user'></i>
            </div>
            <span className="customer-name" title={workOrder.customer}>
              {truncateText(workOrder.customer)}
            </span>
          </div>
        </div>

        <div className="card-footer">
          <div className="assigned-people">
            {workOrder.assignedPeople && workOrder.assignedPeople.length > 0 ? (
              <>
                {workOrder.assignedPeople.slice(0, 2).map((person, index) => (
                  <div 
                    key={person.id} 
                    className="profile-photo" 
                    style={{ zIndex: workOrder.assignedPeople!.length - index }}
                    onClick={(e) => handleTechnicianClick(person.id, e)}
                    title={person.name}
                  >
                    <img src={person.profilePhoto} alt={person.name} />
                  </div>
                ))}
                {workOrder.assignedPeople.length > 2 && (
                  <div 
                    className="profile-photo more-indicator"
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('More technicians clicked');
                    }}
                    title={`${workOrder.assignedPeople.length - 2} more technicians`}
                  >
                    <span>+{workOrder.assignedPeople.length - 2}</span>
                  </div>
                )}
              </>
            ) : (
              <div className="no-assignment">
                <span>Unassigned</span>
              </div>
            )}
          </div>
          
          <div className="amount">
            <span className="amount-text">{formatAmount(workOrder.amount)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkOrderCard;