import React from 'react';
import './TechniciansTableCard.scss';

interface Technician {
  id: string;
  name: string;
  image: string;
  currentWorkOrder: {
    id: string;
    title: string;
    customer: string;
    vehicle: string;
    taskType: 'Inspection' | 'Labor';
  };
}

interface TechniciansTableCardProps {
  technicians: Technician[];
}

const TechniciansTableCard: React.FC<TechniciansTableCardProps> = ({ technicians }) => {
  return (
    <div className="technicians-table-card">
      <div className="technicians-table-card__header">
        <h3 className="technicians-table-card__title">Active Technicians</h3>
        <div className="technicians-table-card__count">
          {technicians.length} working
        </div>
      </div>

      <div className="technicians-table-card__content">
        <div className="technicians-table-card__table">
          <div className="technicians-table-card__table-header">
            <div className="technicians-table-card__col-header technicians-table-card__col--image">Technician</div>
            <div className="technicians-table-card__col-header technicians-table-card__col--work-order">Work Order</div>
            <div className="technicians-table-card__col-header technicians-table-card__col--type">Type</div>
          </div>

          <div className="technicians-table-card__table-body">
            {technicians.map((technician) => (
              <div key={technician.id} className="technicians-table-card__row">
                <div className="technicians-table-card__col technicians-table-card__col--image">
                  <div className="technicians-table-card__technician">
                    <div className="technicians-table-card__avatar">
                      <img 
                        src={technician.image} 
                        alt={technician.name}
                        className="technicians-table-card__avatar-img"
                      />
                    </div>
                    <div className="technicians-table-card__name">{technician.name}</div>
                  </div>
                </div>

                <div className="technicians-table-card__col technicians-table-card__col--work-order">
                  <div className="technicians-table-card__work-order-id">
                    {technician.currentWorkOrder.id}
                  </div>
                </div>

                <div className="technicians-table-card__col technicians-table-card__col--type">
                  <div className="technicians-table-card__task-type">
                    {technician.currentWorkOrder.taskType}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechniciansTableCard;
