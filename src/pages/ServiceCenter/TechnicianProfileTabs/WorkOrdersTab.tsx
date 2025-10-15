import React from 'react';

interface WorkOrder {
  id: string;
  workOrderNumber: string;
  createdAt: string;
  updatedAt: string;
  customerId: string;
  vehicleId: string;
  appointmentId: string;
  advisorId: string;
  status: string;
  jobType: string;
  priority: string;
  source: string;
  complaint: string;
  odometerReading: number;
  warrantyStatus: string;
  estimateNotes: string | null;
  estimateApproved: boolean;
  subtotalParts: number;
  discountAmount: number;
  totalAmount: number;
  paidAmount: number;
  openedAt: string | null;
  promisedAt: string | null;
  closedAt: string | null;
  workflowStep: string;
  internalNotes: string;
  customerNotes: string;
  invoiceNumber: string | null;
  finalizedAt: string | null;
  paymentStatus: string;
  warrantyClaimNumber: string | null;
  thirdPartyApprovalCode: string | null;
  campaignId: string | null;
  servicePackageId: string | null;
  customerSignature: string | null;
  customerFeedback: string | null;
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  vehicle: {
    id: string;
    make: string;
    model: string;
    year: number;
    vin: string;
    licensePlate: string;
  };
  appointment: {
    id: string;
    requestedAt: string;
    startTime: string;
    endTime: string;
    status: string;
    priority: string;
    notes: string;
  };
  technicians: any[];
}

interface WorkOrdersTabProps {
  workOrders: WorkOrder[];
}

const WorkOrdersTab: React.FC<WorkOrdersTabProps> = ({ workOrders }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'LKR'
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'status-completed';
      case 'in-progress':
      case 'in_progress':
        return 'status-in-progress';
      case 'open':
      case 'opened':
        return 'status-open';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return 'status-default';
    }
  };

  return (
    <div className="work-orders-tab">
      <div className="work-orders-header">
        <h3>Recent Work Orders</h3>
        <span className="work-orders-count">{workOrders.length} work orders</span>
      </div>

      {workOrders.length > 0 ? (
        <div className="work-orders-list">
          {workOrders.map((workOrder) => (
            <div key={workOrder.id} className="work-order-card">
              <div className="work-order-header">
                <div className="work-order-info">
                  <h4 className="work-order-number">{workOrder.workOrderNumber}</h4>
                  <span className={`work-order-status ${getStatusColor(workOrder.status)}`}>
                    {workOrder.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="work-order-amount">
                  {formatCurrency(workOrder.totalAmount)}
                </div>
              </div>

              <div className="work-order-details">
                <div className="detail-row">
                  <span className="detail-label">Customer:</span>
                  <span className="detail-value">{workOrder.customer.name}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Vehicle:</span>
                  <span className="detail-value">
                    {workOrder.vehicle.year} {workOrder.vehicle.make} {workOrder.vehicle.model}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Created:</span>
                  <span className="detail-value">{formatDate(workOrder.createdAt)}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Priority:</span>
                  <span className="detail-value">{workOrder.priority}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Job Type:</span>
                  <span className="detail-value">{workOrder.jobType}</span>
                </div>
                {workOrder.complaint && (
                  <div className="detail-row">
                    <span className="detail-label">Complaint:</span>
                    <span className="detail-value">{workOrder.complaint}</span>
                  </div>
                )}
              </div>

              <div className="work-order-footer">
                <button className="btn-view-details">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-work-orders">
          <p>No recent work orders found</p>
        </div>
      )}
    </div>
  );
};

export default WorkOrdersTab;