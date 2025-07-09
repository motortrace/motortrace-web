// Dashboard.tsx
import React from 'react';
import DashboardHeader from '../../layouts/DashboardHeader/DashboardHeader';
import MetricCard from '../../components/MetricCard/MetricCard';
import ServiceFlow from '../../components/ServiceFlow/ServiceFlow';
import TodaysBookingsOverview from '../../components/TodaysBookingOverview/TodaysBookingsOverview';
import Budget from '../../components/Budget/Budget';
import BayUtilizationChart from '../../components/BayUtilizationChart/BayUtilizationChart';
import './Dashboard.scss';

// Types
interface BookingRequest {
  total: number;
  pending: number;
  approved: number;
  declined: number;
  todayRequests: number;
}

interface EstimateInvoice {
  estimatesSent: number;
  invoicesGenerated: number;
  conversionRate: number;
  pendingApproval: number;
  totalValue: number;
}

interface TaskProgress {
  created: number;
  todo: number;
  inProgress: number;
  done: number;
  notDone: number;
}

interface Appointment {
  id: number;
  customerName: string;
  time: string;
  date: string;
  licensePlate: string;
  service: string;
  status: 'confirmed' | 'pending' | 'completed';
}

interface Transaction {
  id: number;
  customerName: string;
  amount: number;
  date: string;
  service: string;
  status: 'completed' | 'pending';
}

const Dashboard: React.FC = () => {
  // Mock data
  const bookingRequests: BookingRequest = {
    total: 47,
    pending: 12,
    approved: 28,
    declined: 7,
    todayRequests: 8
  };

  const estimateVsInvoice: EstimateInvoice = {
    estimatesSent: 34,
    invoicesGenerated: 28,
    conversionRate: 82,
    pendingApproval: 6,
    totalValue: 15750
  };

  const taskProgress: TaskProgress = {
    created: 8,
    todo: 15,
    inProgress: 12,
    done: 23,
    notDone: 3
  };

  const todaysAppointments: Appointment[] = [
    {
      id: 1,
      customerName: "Mike Johnson",
      time: "09:00 AM",
      date: "18 Jan 2025",
      licensePlate: "ABC-1234",
      service: "Oil Change",
      status: "confirmed"
    },
    {
      id: 2,
      customerName: "Sarah Williams",
      time: "10:30 AM",
      date: "18 Jan 2025",
      licensePlate: "XYZ-5678",
      service: "Brake Inspection",
      status: "pending"
    },
    {
      id: 3,
      customerName: "David Chen",
      time: "02:00 PM",
      date: "18 Jan 2025",
      licensePlate: "DEF-9012",
      service: "Engine Diagnostic",
      status: "confirmed"
    },
    {
      id: 4,
      customerName: "Emma Davis",
      time: "03:30 PM",
      date: "18 Jan 2025",
      licensePlate: "GHI-3456",
      service: "Tire Rotation",
      status: "pending"
    }
  ];

  const recentTransactions: Transaction[] = [
    {
      id: 1,
      customerName: "John Smith",
      amount: 285.50,
      date: "Today",
      service: "Brake Replacement",
      status: "completed"
    },
    {
      id: 2,
      customerName: "Lisa Brown",
      amount: 450.00,
      date: "Yesterday",
      service: "Engine Repair",
      status: "pending"
    },
    {
      id: 3,
      customerName: "Robert Johnson",
      amount: 125.75,
      date: "2 days ago",
      service: "Oil Change",
      status: "completed"
    },
    {
      id: 4,
      customerName: "Maria Garcia",
      amount: 680.25,
      date: "3 days ago",
      service: "Transmission Service",
      status: "completed"
    }
  ];

  const totalTasks = Object.values(taskProgress).reduce((sum, count) => sum + count, 0);

  // Mock values for new metric cards
  const reviewsReceived = 42;
  const workOrdersInProgress = 5;

  const handleAddWidget = () => {
    console.log('Add widget clicked');
  };

  const handleManageWidgets = () => {
    console.log('Manage widgets clicked');
  };

  const getStatusBadge = (status: string) => {
    // Flat, color-coded badge style (matching EstimatesInvoices)
    let badgeClass = '';
    let label = status.charAt(0).toUpperCase() + status.slice(1);
    switch (status) {
      case 'confirmed':
        badgeClass = 'status-badge--confirmed';
        break;
      case 'pending':
        badgeClass = 'status-badge--pending';
        break;
      case 'completed':
        badgeClass = 'status-badge--completed';
        break;
      case 'approved':
        badgeClass = 'status-badge--approved';
        break;
      case 'declined':
        badgeClass = 'status-badge--declined';
        break;
      case 'notDone':
        badgeClass = 'status-badge--notdone';
        label = 'Not Done';
        break;
      case 'done':
        badgeClass = 'status-badge--done';
        label = 'Done';
        break;
      default:
        badgeClass = '';
    }
    return <span className={`status-badge ${badgeClass}`}>{label}</span>;
  };

  const formatCurrency = (amount: number) => {
    return `LKR ${amount.toLocaleString()}`;
  };

  const getTaskProgressPercentage = (count: number) => {
    return Math.round((count / totalTasks) * 100);
  };

  return (
    <div className="dashboard">
      <DashboardHeader />

      <div className="metric-cards-row">
        <MetricCard
          title="Total Appointments"
          amount="13"
          change="12.1%"
          changeType="positive"
        />
        <MetricCard
          title="Reviews Received"
          amount={reviewsReceived.toString()}
          change="4.5%"
          changeType="positive"
        />
        <MetricCard
          title="Work Orders In Progress"
          amount={workOrdersInProgress.toString()}
          change="2.1%"
          changeType="positive"
        />
        <MetricCard
          title="Total Earnings"
          amount="27 500 LKR"
          change="12.1%"
          changeType="positive"
        />
      </div>
      
      <div className="dashboard__content">
        {/* Top Row - Three Cards */}
        <div className="dashboard__row">
          {/* Card 1: Appointment Booking Requests */}
          <div className="dashboard__card dashboard__card--booking-requests">
            <div className="dashboard__card-header">
              <h3 className="dashboard__card-title">Booking Requests</h3>
              <div className="dashboard__card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              </div>
            </div>
            
            <div className="dashboard__card-main">
              <div className="dashboard__metric-large">
                <span className="dashboard__metric-number">{bookingRequests.total}</span>
                <span className="dashboard__metric-label">Total Requests</span>
              </div>
              
              <div className="dashboard__metrics-row">
                <div className="dashboard__metric-small">
                  <span className="dashboard__metric-number dashboard__metric-number--pending">{bookingRequests.pending}</span>
                  <span className="dashboard__metric-label">Pending</span>
                </div>
                <div className="dashboard__metric-small">
                  <span className="dashboard__metric-number dashboard__metric-number--approved">{bookingRequests.approved}</span>
                  <span className="dashboard__metric-label">Approved</span>
                </div>
                <div className="dashboard__metric-small">
                  <span className="dashboard__metric-number dashboard__metric-number--declined">{bookingRequests.declined}</span>
                  <span className="dashboard__metric-label">Declined</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Estimate vs Invoice */}
          <div className="dashboard__card dashboard__card--estimate-invoice">
            <div className="dashboard__card-header">
              <h3 className="dashboard__card-title">Estimates & Invoices</h3>
              <div className="dashboard__card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14,2 14,8 20,8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <polyline points="10,9 9,9 8,9"/>
                </svg>
              </div>
            </div>
            <div className="dashboard__card-main">
              <div className="dashboard__metric-large">
                <span className="dashboard__metric-number">{estimateVsInvoice.conversionRate}%</span>
                <span className="dashboard__metric-label">Conversion Rate</span>
              </div>
              <div className="dashboard__metrics-row">
                <div className="dashboard__metric-small">
                  <span className="dashboard__metric-number">{estimateVsInvoice.estimatesSent}</span>
                  <span className="dashboard__metric-label">Estimates</span>
                </div>
                <div className="dashboard__metric-small">
                  <span className="dashboard__metric-number">{estimateVsInvoice.invoicesGenerated}</span>
                  <span className="dashboard__metric-label">Invoices</span>
                </div>
                <div className="dashboard__metric-small">
                  <span className="dashboard__metric-number">{estimateVsInvoice.pendingApproval}</span>
                  <span className="dashboard__metric-label">Pending</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Task Progress */}
          <div className="dashboard__card dashboard__card--task-progress">
            <div className="dashboard__card-header">
              <h3 className="dashboard__card-title">Task Progress</h3>
              <div className="dashboard__card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
            </div>
            <div className="dashboard__card-main dashboard__card-main--centered">
              <div className="dashboard__task-progress dashboard__task-progress--horizontal">
                {/* To Do */}
                <div className="dashboard__task-item dashboard__task-item--horizontal">
                  <div className="dashboard__task-bar dashboard__task-bar--horizontal">
                    <div className="dashboard__task-fill dashboard__task-fill--todo" style={{width: `${getTaskProgressPercentage(taskProgress.todo)}%`}}></div>
                  </div>
                  <div className="dashboard__task-info dashboard__task-info--horizontal">
                    <span className="dashboard__task-count">{taskProgress.todo}</span>
                    <span className="dashboard__task-label">To Do</span>
                  </div>
                </div>
                {/* In Progress */}
                <div className="dashboard__task-item dashboard__task-item--horizontal">
                  <div className="dashboard__task-bar dashboard__task-bar--horizontal">
                    <div className="dashboard__task-fill dashboard__task-fill--progress" style={{width: `${getTaskProgressPercentage(taskProgress.inProgress)}%`}}></div>
                  </div>
                  <div className="dashboard__task-info dashboard__task-info--horizontal">
                    <span className="dashboard__task-count">{taskProgress.inProgress}</span>
                    <span className="dashboard__task-label">In Progress</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row - Two Cards */}
        <div className="dashboard__row dashboard__row--bottom">
          {/* Today's Appointments */}
          <div className="dashboard__card dashboard__card--appointments">
            <div className="dashboard__card-header">
              <h3 className="dashboard__card-title">Today's Appointments</h3>
              <div className="dashboard__card-actions">
                <button className="dashboard__action-btn btn btn--ghost">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"/>
                    <path d="m21 21-4.35-4.35"/>
                  </svg>
                </button>
                <button className="dashboard__action-btn btn btn--ghost">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="4" y1="21" x2="4" y2="14"/>
                    <line x1="4" y1="10" x2="4" y2="3"/>
                    <line x1="12" y1="21" x2="12" y2="12"/>
                    <line x1="12" y1="8" x2="12" y2="3"/>
                    <line x1="20" y1="21" x2="20" y2="16"/>
                    <line x1="20" y1="12" x2="20" y2="3"/>
                    <line x1="1" y1="14" x2="7" y2="14"/>
                    <line x1="9" y1="8" x2="15" y2="8"/>
                    <line x1="17" y1="16" x2="23" y2="16"/>
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="dashboard__card-main">
              <div className="dashboard__appointments-header">
                <div className="dashboard__appointment-col">Client Name & ID</div>
                <div className="dashboard__appointment-col">Date & Time</div>
                <div className="dashboard__appointment-col">License Plate</div>
                <div className="dashboard__appointment-col">Status</div>
                <div className="dashboard__appointment-col">Action</div>
              </div>
              
              <div className="dashboard__appointments-list">
                {todaysAppointments.map((appointment) => (
                  <div key={appointment.id} className="dashboard__appointment-row">
                    <div className="dashboard__appointment-col">
                      <div className="dashboard__appointment-client">
                        <div className="dashboard__client-avatar">
                          {appointment.customerName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="dashboard__client-info">
                          <div className="dashboard__client-name">{appointment.customerName}</div>
                          <div className="dashboard__client-service">{appointment.service}</div>
                        </div>
                      </div>
                    </div>
                    <div className="dashboard__appointment-col">
                      <div className="dashboard__appointment-time">
                        <div className="dashboard__appointment-date">{appointment.date}</div>
                        <div className="dashboard__appointment-hour">{appointment.time}</div>
                      </div>
                    </div>
                    <div className="dashboard__appointment-col">
                      <div className="dashboard__license-plate">{appointment.licensePlate}</div>
                    </div>
                    <div className="dashboard__appointment-col">
                      {getStatusBadge(appointment.status)}
                    </div>
                    <div className="dashboard__appointment-col">
                      <button className="dashboard__action-btn dashboard__action-btn--menu btn btn--ghost">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="1"/>
                          <circle cx="12" cy="5" r="1"/>
                          <circle cx="12" cy="19" r="1"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Payments */}
          <div className="dashboard__card dashboard__card--payments">
            <div className="dashboard__card-header">
              <h3 className="dashboard__card-title">Recent Payments</h3>

            </div>
            
            <div className="dashboard__card-main">
              <div className="dashboard__payments-summary">
                <div className="dashboard__payment-total">
                  <div className="dashboard__payment-amount">
                    {`LKR ${recentTransactions.reduce((sum, t) => sum + t.amount, 0).toLocaleString()}`}
                  </div>
                  <div className="dashboard__payment-label">Total Recent Payments</div>
                </div>
                
                <div className="dashboard__payment-stats">
                  <div className="dashboard__payment-stat">
                    <div className="dashboard__payment-stat-number">
                      {recentTransactions.filter(t => t.status === 'completed').length}
                    </div>
                    <div className="dashboard__payment-stat-label">Completed</div>
                  </div>
                  <div className="dashboard__payment-stat">
                    <div className="dashboard__payment-stat-number">
                      {recentTransactions.filter(t => t.status === 'pending').length}
                    </div>
                    <div className="dashboard__payment-stat-label">Pending</div>
                  </div>
                </div>
              </div>
              
              <div className="dashboard__payments-list">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="dashboard__payment-row">
                    <div className="dashboard__payment-client">
                      <div className="dashboard__client-avatar">
                        {transaction.customerName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="dashboard__client-info">
                        <div className="dashboard__client-name">{transaction.customerName}</div>
                        <div className="dashboard__client-service">{transaction.service}</div>
                      </div>
                    </div>
                    <div className="dashboard__payment-info">
                      <div className="dashboard__payment-amount">LKR {transaction.amount.toLocaleString()}</div>
                      <div className="dashboard__payment-date">{transaction.date}</div>
                    </div>
                    <div className="dashboard__payment-status">
                      {getStatusBadge(transaction.status)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;