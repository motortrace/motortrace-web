import React, { useState } from 'react';
import TransactionHistory from '../../components/Admin/IncomeManagement/TransactionHistory/TransactionHistory';
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

        <TransactionHistory transactions={mockTransactions} />
      </div>
    </div>
  );
};

export default IncomeManagement;