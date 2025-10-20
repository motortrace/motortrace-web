import React, { useState, useEffect } from 'react';
import TransactionHistory from '../../components/Admin/IncomeManagement/TransactionHistory/TransactionHistory';
import { getWorkOrders } from '../../utils/workOrdersApi';
import './IncomeManagement.scss';

export interface Transaction {
  id: string;
  customerId: string;
  customerName: string;
  serviceType: string;
  bookingDate: string;
  completionDate?: string;
  estimatedCost: number;
  finalCost: number;
  advancePaid: number;
  penaltyAmount: number;
  refundAmount: number;
  paymentStatus: 'completed' | 'pending' | 'cancelled' | 'no-show';
  paymentMethod: 'card' | 'bank-transfer' | 'cash';
  paymentCase: 'normal' | 'advance-required' | 'cancelled-with-penalty' | 'no-show-no-refund';
  serviceDetails?: ServiceDetails;
}

export interface ServiceDetails {
  mainService: {
    name: string;
    cost: number;
  };
  subTasks: {
    id: string;
    name: string;
    cost: number;
    completed: boolean;
  }[];
  spareParts: {
    id: string;
    name: string;
    quantity: number;
    unitCost: number;
    totalCost: number;
    source: 'inventory' | 'customer-supplied';
    suppliedExternally?: boolean;
  }[];
  laborCost: number;
  taxAmount: number;
  discountAmount: number;
}

const IncomeManagement: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const handleStatusChange = (id: string, newStatus: Transaction['paymentStatus']) => {
    setTransactions(prevTransactions =>
      prevTransactions.map(transaction =>
        transaction.id === id
          ? {
              ...transaction,
              paymentStatus: newStatus,
              // For manual completion, set payment method to cash if not already set
              paymentMethod: newStatus === 'completed' && !transaction.paymentMethod ? 'cash' : transaction.paymentMethod
            }
          : transaction
      )
    );
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        // Fetch work orders with payments
        const workOrdersResponse = await getWorkOrders({
          status: 'COMPLETED'
        });

        // Transform work orders to transactions format
        const transformedTransactions: Transaction[] = (workOrdersResponse.data || workOrdersResponse)?.map((workOrder: any) => {
          const totalPaid = workOrder.payments?.reduce((sum: number, payment: any) => sum + Number(payment.amount), 0) || 0;
          const totalAmount = Number(workOrder.totalAmount || 0);
          const advancePaid = workOrder.payments?.filter((p: any) => p.notes?.includes('Advance')).reduce((sum: number, p: any) => sum + Number(p.amount), 0) || 0;
          const penaltyAmount = workOrder.payments?.filter((p: any) => p.notes?.includes('Penalty')).reduce((sum: number, p: any) => sum + Number(p.amount), 0) || 0;
          const refundAmount = workOrder.payments?.filter((p: any) => p.status === 'REFUNDED').reduce((sum: number, p: any) => sum + Number(p.amount), 0) || 0;

          return {
            id: workOrder.workOrderNumber || workOrder.id,
            customerId: workOrder.customerId,
            customerName: workOrder.customer?.firstName + ' ' + workOrder.customer?.lastName || 'Unknown Customer',
            serviceType: workOrder.jobType || 'Service',
            bookingDate: workOrder.createdAt,
            completionDate: workOrder.finalizedAt,
            estimatedCost: Number(workOrder.estimatedTotal || 0),
            finalCost: totalAmount,
            advancePaid,
            penaltyAmount,
            refundAmount,
            paymentStatus: totalPaid >= totalAmount ? 'completed' : totalPaid > 0 ? 'pending' : 'pending',
            paymentMethod: workOrder.payments?.[0]?.method?.toLowerCase().replace('_', '-') || 'cash',
            paymentCase: advancePaid > 0 ? 'advance-required' : penaltyAmount > 0 ? 'cancelled-with-penalty' : refundAmount > 0 ? 'no-show-no-refund' : 'normal',
            serviceDetails: workOrder.services ? {
              mainService: {
                name: workOrder.services[0]?.description || 'Service',
                cost: workOrder.services[0]?.unitPrice || 0
              },
              subTasks: workOrder.labor?.map((labor: any) => ({
                id: labor.id,
                name: labor.description,
                cost: labor.hours * labor.rate,
                completed: true
              })) || [],
              spareParts: workOrder.parts?.map((part: any) => ({
                id: part.id,
                name: part.inventoryItemId, // This might need adjustment based on actual data structure
                quantity: part.quantity,
                unitCost: part.unitPrice,
                totalCost: part.quantity * part.unitPrice,
                source: part.source?.toLowerCase().replace('_', '-') || 'inventory'
              })) || [],
              laborCost: workOrder.labor?.reduce((sum: number, labor: any) => sum + (labor.hours * labor.rate), 0) || 0,
              taxAmount: workOrder.taxAmount || 0,
              discountAmount: workOrder.discountAmount || 0
            } : undefined
          };
        }) || [];

        setTransactions(transformedTransactions);
      } catch (error) {
        console.error('Error fetching transactions:', error);
        // Fallback to mock data if API fails
        setTransactions([
          {
            id: 'TXN-001',
            customerId: 'CUST-001',
            customerName: 'John Smith',
            serviceType: 'Full Car Wash',
            bookingDate: '2025-01-15',
            completionDate: '2025-01-15',
            estimatedCost: 5000,
            finalCost: 5200,
            advancePaid: 0,
            penaltyAmount: 0,
            refundAmount: 0,
            paymentStatus: 'completed',
            paymentMethod: 'card',
            paymentCase: 'normal',
            serviceDetails: {
              mainService: {
                name: 'Full Car Wash',
                cost: 3000
              },
              subTasks: [
                { id: 'ST-001', name: 'Exterior Wash', cost: 1500, completed: true },
                { id: 'ST-002', name: 'Interior Cleaning', cost: 1000, completed: true },
                { id: 'ST-003', name: 'Wax Application', cost: 500, completed: true }
              ],
              spareParts: [
                { id: 'SP-001', name: 'Car Shampoo', quantity: 1, unitCost: 200, totalCost: 200, source: 'inventory' }
              ],
              laborCost: 2000,
              taxAmount: 520,
              discountAmount: 0
            }
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // Mock data - in real app, this would come from your backend
  const mockTransactions: Transaction[] = [
    {
      id: 'TXN-001',
      customerId: 'CUST-001',
      customerName: 'John Smith',
      serviceType: 'Full Car Wash',
      bookingDate: '2025-01-15',
      completionDate: '2025-01-15',
      estimatedCost: 5000,
      finalCost: 5200,
      advancePaid: 0,
      penaltyAmount: 0,
      refundAmount: 0,
      paymentStatus: 'completed',
      paymentMethod: 'card',
      paymentCase: 'normal',
      serviceDetails: {
        mainService: {
          name: 'Full Car Wash',
          cost: 3000
        },
        subTasks: [
          { id: 'ST-001', name: 'Exterior Wash', cost: 1500, completed: true },
          { id: 'ST-002', name: 'Interior Cleaning', cost: 1000, completed: true },
          { id: 'ST-003', name: 'Wax Application', cost: 500, completed: true }
        ],
        spareParts: [
          { id: 'SP-001', name: 'Car Shampoo', quantity: 1, unitCost: 200, totalCost: 200, source: 'inventory' }
        ],
        laborCost: 2000,
        taxAmount: 520,
        discountAmount: 0
      }
    },
    {
      id: 'TXN-002',
      customerId: 'CUST-002',
      customerName: 'Sarah Johnson',
      serviceType: 'Engine Service',
      bookingDate: '2025-01-14',
      completionDate: '2025-01-14',
      estimatedCost: 12000,
      finalCost: 11800,
      advancePaid: 3000,
      penaltyAmount: 0,
      refundAmount: 0,
      paymentStatus: 'completed',
      paymentMethod: 'bank-transfer',
      paymentCase: 'advance-required',
      serviceDetails: {
        mainService: {
          name: 'Engine Service',
          cost: 8000
        },
        subTasks: [
          { id: 'ST-004', name: 'Oil Change', cost: 2000, completed: true },
          { id: 'ST-005', name: 'Filter Replacement', cost: 1500, completed: true },
          { id: 'ST-006', name: 'Engine Tune-up', cost: 4500, completed: true }
        ],
        spareParts: [
          { id: 'SP-002', name: 'Engine Oil (5L)', quantity: 1, unitCost: 1800, totalCost: 1800, source: 'inventory' },
          { id: 'SP-003', name: 'Oil Filter', quantity: 1, unitCost: 500, totalCost: 500, source: 'inventory' },
          { id: 'SP-004', name: 'Air Filter', quantity: 1, unitCost: 800, totalCost: 800, source: 'customer-supplied', suppliedExternally: true }
        ],
        laborCost: 3000,
        taxAmount: 1180,
        discountAmount: 200
      }
    },
    {
      id: 'TXN-003',
      customerId: 'CUST-003',
      customerName: 'Mike Davis',
      serviceType: 'Tire Change',
      bookingDate: '2025-01-13',
      estimatedCost: 8000,
      finalCost: 0,
      advancePaid: 2000,
      penaltyAmount: 200,
      refundAmount: 1800,
      paymentStatus: 'cancelled',
      paymentMethod: 'card',
      paymentCase: 'cancelled-with-penalty'
    },
    {
      id: 'TXN-004',
      customerId: 'CUST-004',
      customerName: 'Emily Wilson',
      serviceType: 'Full Detailing',
      bookingDate: '2025-01-12',
      estimatedCost: 15000,
      finalCost: 0,
      advancePaid: 3750,
      penaltyAmount: 3750,
      refundAmount: 0,
      paymentStatus: 'no-show',
      paymentMethod: 'card',
      paymentCase: 'no-show-no-refund'
    }
  ];

  return (
    <div className="income-management">
      {/* <Header /> */}
      
      <div className="income-management__content">
        {/* <div className="period-selector">
          <div className="period-selector__buttons">
            {(['week', 'month', 'quarter', 'year'] as const).map((period) => (
              <button
                key={period}
                className={`period-selector__button ${selectedPeriod === period ? 'active' : ''}`}
                onClick={() => setSelectedPeriod(period)}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
        </div> */}

        <TransactionHistory
          transactions={transactions.length > 0 ? transactions : mockTransactions}
          onStatusChange={handleStatusChange}
        />
      </div>
    </div>
  );
};

export default IncomeManagement;