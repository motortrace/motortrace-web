import React from 'react';
import './CustomerOrdersTable.scss';

interface CustomerOrder {
  id: string;
  orderNumber: string;
  itemsCount: number;
  amount: number;
  status: 'Completed' | 'Pending' | 'Cancelled' | 'In Progress';
  deliveryStatus: 'Delivered' | 'Not Delivered';
  rating?: number; // 1 to 5
}

interface CustomerOrdersTableProps {
  orders: CustomerOrder[];
}

const CustomerOrdersTable: React.FC<CustomerOrdersTableProps> = ({ orders }) => {
  return (
    <div className="customer-orders-table">
      <h2 className="customer-orders-table__title">Customer Orders</h2>
      <div className="customer-orders-table__table">
        <div className="customer-orders-table__header">
          <div>ORDER #</div>
          <div>ITEMS</div>
          <div>AMOUNT</div>
          <div>STATUS</div>
          <div>DELIVERY</div>
          <div>RATING</div>
        </div>
        <div className="customer-orders-table__body">
          {orders.map((order) => (
            <div key={order.id} className="customer-orders-table__row">
              <div>{order.orderNumber}</div>
              <div>{order.itemsCount}</div>
              <div>LKR {order.amount.toLocaleString()}</div>
              <div>
                <span className={`customer-orders-table__status customer-orders-table__status--${order.status.replace(/\s+/g, '-').toLowerCase()}`}>
                  {order.status}
                </span>
              </div>
              <div>{order.deliveryStatus}</div>
              <div>
                {order.deliveryStatus === 'Not Delivered' ? '—' : order.rating ? (
                  '⭐'.repeat(order.rating)
                ) : (
                  'Not Rated'
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomerOrdersTable;
