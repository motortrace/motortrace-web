import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import KanbanBoard from '../../components/KanbanBoard/KanbanBoard';
import { ClipboardList, AlertCircle } from 'lucide-react';
import './KanbanPage.scss';
import ManageWorkOrderModal from '../../components/WorkOrderModal/ManageWorkOrderModal';
import { type WorkOrder, getWorkOrders, updateWorkOrderStatus } from '../../utils/workOrdersApi';

const KanbanPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter] = useState<string>('');
  const [technicianFilter] = useState<string>('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<WorkOrder | null>(null);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get the base path from current location (e.g., '/serviceadvisor', '/manager', etc.)
  const getBasePath = () => {
    const pathSegments = window.location.pathname.split('/');
    return `/${pathSegments[1]}`; // Gets the first segment after the root
  };

  // Fetch work orders from backend
  useEffect(() => {
    const fetchWorkOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getWorkOrders();
        setWorkOrders(response.data || response); // Handle different response formats
      } catch (err) {
        console.error('Failed to fetch work orders:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch work orders');
      } finally {
        setLoading(false);
      }
    };

    fetchWorkOrders();
  }, []);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleCardMove = async (cardId: string, newStatus: WorkOrder['status']) => {
    try {
      // Update the work order status in the backend
      await updateWorkOrderStatus(cardId, newStatus);
      
      // Update local state optimistically
      setWorkOrders(prev =>
        prev.map(item =>
          item.id === cardId
            ? { ...item, status: newStatus, workflowStep: newStatus }
            : item
        )
      );
    } catch (err) {
      console.error('Failed to update work order status:', err);
      setError(err instanceof Error ? err.message : 'Failed to update work order status');
    }
  };

  const handleCardClick = (workOrder: WorkOrder) => {
    setSelectedWorkOrder(workOrder);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedWorkOrder(null);
  };

  const handleViewHistory = () => {
    const basePath = getBasePath();
    navigate(`${basePath}/work-order`);
  };

  // Icon/color helpers for work order (optional, can be customized)
  const getTypeIcon = () => <ClipboardList size={16} />;
  const getTypeColor = () => '#3b82f6';
  const getPriorityColor = (priority: WorkOrder['priority']) => {
    switch (priority) {
      case 'HIGH':
        return '#ef4444';
      case 'MEDIUM':
        return '#f59e0b';
      case 'LOW':
        return '#10b981';
      case 'NORMAL':
        return '#6b7280';
      default:
        return '#6b7280';
    }
  };

  // Kanban columns for work order stages (mapped to backend statuses)
  const columns: { id: WorkOrder['status']; title: string; color: string }[] = [
    { id: 'RECEIVED', title: 'Received', color: '#6B7280' },
    { id: 'ESTIMATE', title: 'Estimate', color: '#f59e0b' },
    { id: 'APPROVAL', title: 'Approval', color: '#10B981' },
    { id: 'IN_PROGRESS', title: 'In Progress', color: '#3B82F6' },
    { id: 'WAITING_FOR_PARTS', title: 'Waiting for Parts', color: '#8b5cf6' },
    { id: 'COMPLETED', title: 'Completed', color: '#059669' },
  ];

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading work orders...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">
          <AlertCircle size={24} />
          <span>{error}</span>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Page Header */}
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">Work Orders</h1>
          <p className="page-subtitle">Manage and track work order progress</p>
        </div>
        <div className="header-actions">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search work orders..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="search-input"
            />
          </div>
          <button className="action-btn secondary" onClick={handleViewHistory}>
            <i className="bx bx-history"></i>
            View History
          </button>
          <button className="action-btn primary" onClick={() => {/* Handle create work order */}}>
            <i className="bx bx-plus"></i>
            Create Work Order
          </button>
        </div>
      </div>

      {/* Main Kanban Content */}
      <KanbanBoard
        workOrders={workOrders}
        onCardMove={handleCardMove}
        searchTerm={searchTerm}
        priorityFilter={priorityFilter}
        technicianFilter={technicianFilter}
        getTypeIcon={getTypeIcon}
        getTypeColor={getTypeColor}
        getPriorityColor={getPriorityColor}
        columns={columns}
        onCardClick={handleCardClick}
      />

      <ManageWorkOrderModal
        open={modalOpen}
        onClose={handleModalClose}
        workOrder={selectedWorkOrder}
      />
    </>
  );
};

export default KanbanPage;