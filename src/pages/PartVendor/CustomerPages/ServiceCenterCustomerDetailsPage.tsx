import React, { useState } from 'react';
import ServiceCenterDetailsCard from '../../../components/PartVendorComponents/IndividualCustomerDetailsPageCompoents/ServiceCenterDetailsCard/ServiceCenterDetailsCard';
import CustomerSpendCard from '../../../components/PartVendorComponents/IndividualCustomerDetailsPageCompoents/CustomerSpendCard/CustomerSpendCard';
import CustomerOrdersTable from '../../../components/PartVendorComponents/IndividualCustomerDetailsPageCompoents/CustomerOrdersTable/CustomerOrdersTable';

const orders = [
  {
    id: '1',
    orderNumber: '#ORD00201',
    products: [
      { name: 'Brake Pads - Toyota', imageUrl: 'https://via.placeholder.com/40?text=Brake' },
      { name: 'Oil Filter - Nissan', imageUrl: 'https://via.placeholder.com/40?text=Oil+Filter' },
    ],
    amount: 12500,
    status: 'Completed',
    deliveryStatus: 'Delivered',
    rating: 5,
  },
  {
    id: '2',
    orderNumber: '#ORD00202',
    products: [
      { name: 'Air Filter - Suzuki', imageUrl: 'https://via.placeholder.com/40?text=Air+Filter' },
    ],
    amount: 3200,
    status: 'Pending',
    deliveryStatus: 'Not Delivered',
  },
];

const payments = [
  {
    id: 'P001',
    month: 'June 2025',
    dueDate: '2025-07-05',
    paidDate: '2025-07-03',
    amount: 18000,
    status: 'Paid',
    method: 'Bank Transfer',
  },
  {
    id: 'P002',
    month: 'May 2025',
    dueDate: '2025-06-05',
    paidDate: '2025-06-06',
    amount: 15200,
    status: 'Paid',
    method: 'Bank Transfer',
  },
  {
    id: 'P003',
    month: 'April 2025',
    dueDate: '2025-05-05',
    paidDate: '',
    amount: 13400,
    status: 'Unpaid',
    method: '',
  },
];

const ServiceCenterCustomerDetailsPage = () => {
  const [tab, setTab] = useState<'orders' | 'payments'>('orders');

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <ServiceCenterDetailsCard />

      <CustomerSpendCard
        totalSpend={1250000}
        spendChange={12}
        totalOrders={42}
        orderChange={7}
        averageValue={29760}
        averageChange={6}
        averageRating={4.8}
        ratedOrders={30}
      />

      {/* Monthly Payment Details */}
      <div style={{
        background: '#f9fafb',
        border: '1px solid #e5e7eb',
        borderRadius: 16,
        padding: '20px 24px',
        marginBottom: 0,
        fontFamily: 'Poppins',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        maxWidth: 600,
      }}>
        <div style={{ fontWeight: 600, fontSize: 16, color: '#1a1a1a', marginBottom: 4 }}>Monthly Payment Plan</div>
        <div style={{ color: '#374151', fontSize: 14 }}>Service centers pay for all their orders monthly. Payment is due by the 5th of each month for the previous month's orders.</div>
      </div>

      {/* Tabs */}
      <div style={{ margin: '24px 0 0 0' }}>
        <div className="user-management__tabs">
          <button
            className={`user-management__tab${tab === 'orders' ? ' user-management__tab--active' : ''}`}
            onClick={() => setTab('orders')}
            type="button"
          >
            Orders
          </button>
          <button
            className={`user-management__tab${tab === 'payments' ? ' user-management__tab--active' : ''}`}
            onClick={() => setTab('payments')}
            type="button"
          >
            Payments
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div style={{ marginTop: 0 }}>
        {tab === 'orders' && <CustomerOrdersTable orders={orders} />}
        {tab === 'payments' && (
          <div className="customer-orders-table" style={{ width: '100%' }}>
            <div className="customer-orders-table__title">Monthly Payment Details</div>
            <div className="customer-orders-table__table">
              <div className="customer-orders-table__header" style={{gridTemplateColumns: '1.5fr 1.5fr 1.5fr 1.5fr 1.2fr 1.2fr'}}>
                <div>Month</div>
                <div>Due Date</div>
                <div>Paid Date</div>
                <div style={{textAlign:'right'}}>Amount (LKR)</div>
                <div style={{textAlign:'center'}}>Status</div>
                <div style={{textAlign:'center'}}>Method</div>
              </div>
              <div className="customer-orders-table__body">
                {payments.map((p) => (
                  <div className="customer-orders-table__row" style={{gridTemplateColumns: '1.5fr 1.5fr 1.5fr 1.5fr 1.2fr 1.2fr'}} key={p.id}>
                    <div className="cell">{p.month}</div>
                    <div className="cell">{p.dueDate}</div>
                    <div className="cell">{p.paidDate || <span style={{ color: '#b91c1c', fontWeight: 600 }}>Unpaid</span>}</div>
                    <div className="cell" style={{textAlign:'right', fontWeight:600}}>{p.amount.toLocaleString()}</div>
                    <div className="cell" style={{justifyContent:'center'}}>
                      <span className={`customer-orders-table__status ${p.status === 'Paid' ? 'customer-orders-table__status--completed' : 'customer-orders-table__status--cancelled'}`}>{p.status}</span>
                    </div>
                    <div className="cell" style={{justifyContent:'center', color: '#2563eb', fontWeight: 600}}>{p.method || '-'}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceCenterCustomerDetailsPage; 