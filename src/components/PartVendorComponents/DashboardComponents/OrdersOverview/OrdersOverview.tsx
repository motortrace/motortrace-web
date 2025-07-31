import React from 'react';
import './OrdersOverview.scss';

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  orderType: 'Retail Sale' | 'Service Center';
  itemsCount: number;
  amount: number;
  status: 'Completed' | 'Pending' | 'Cancelled' | 'In Progress';
  paymentMethod?: string;
}

interface OrdersOverviewProps {
  orders?: Order[];
}

const OrdersOverview: React.FC<OrdersOverviewProps> = ({
orders = [
  {
    id: '1',
    orderNumber: 'ORD-00123',
    customerName: 'A. Fernando',
    orderType: 'Retail Sale',
    itemsCount: 3,
    amount: 15000,
    status: 'Completed',
    paymentMethod: 'Credit Card',
  },
  {
    id: '2',
    orderNumber: 'ORD-00124',
    customerName: 'M. Perera',
    orderType: 'Service Center',
    itemsCount: 1,
    amount: 4500,
    status: 'In Progress',
    paymentMethod: 'Cash',
  },
  {
    id: '3',
    orderNumber: 'ORD-00125',
    customerName: 'R. Jayawardena',
    orderType: 'Retail Sale',
    itemsCount: 2,
    amount: 8200,
    status: 'Pending',
    paymentMethod: 'Bank Transfer',
  },
  {
    id: '4',
    orderNumber: 'ORD-00126',
    customerName: 'S. Kumara',
    orderType: 'Retail Sale',
    itemsCount: 5,
    amount: 25500,
    status: 'Completed',
    paymentMethod: 'Credit Card',
  },
  {
    id: '5',
    orderNumber: 'ORD-00127',
    customerName: 'N. Silva',
    orderType: 'Service Center',
    itemsCount: 2,
    amount: 13500,
    status: 'Cancelled',
    paymentMethod: 'Credit Card',
  },
  {
    id: '6',
    orderNumber: 'ORD-00128',
    customerName: 'T. Fernando',
    orderType: 'Retail Sale',
    itemsCount: 1,
    amount: 3200,
    status: 'Pending',
    paymentMethod: 'Cash',
  },
  {
    id: '7',
    orderNumber: 'ORD-00129',
    customerName: 'D. Rodrigo',
    orderType: 'Service Center',
    itemsCount: 4,
    amount: 17800,
    status: 'In Progress',
    paymentMethod: 'Bank Transfer',
  },
  {
    id: '8',
    orderNumber: 'ORD-00130',
    customerName: 'L. Perera',
    orderType: 'Retail Sale',
    itemsCount: 3,
    amount: 10200,
    status: 'Completed',
    paymentMethod: 'Credit Card',
  },
  {
    id: '9',
    orderNumber: 'ORD-00131',
    customerName: 'M. Silva',
    orderType: 'Service Center',
    itemsCount: 1,
    amount: 4800,
    status: 'Cancelled',
    paymentMethod: 'Cash',
  },
  {
    id: '10',
    orderNumber: 'ORD-00132',
    customerName: 'K. Jayasinghe',
    orderType: 'Retail Sale',
    itemsCount: 6,
    amount: 28000,
    status: 'Completed',
    paymentMethod: 'Bank Transfer',
  },
]
}) => {
  return (
    <div className="orders-overview">
      <div className="orders-overview__header">
        <h2 className="orders-overview__title">Orders Overview</h2>
        <div className="orders-overview__controls">
          <button className="orders-overview__dropdown">
            All statuses
            <svg className="orders-overview__dropdown-icon" width="16" height="16" viewBox="0 0 16 16">
              <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
          </button>
          <button className="orders-overview__see-all">
            View all orders
            <svg className="orders-overview__arrow" width="16" height="16" viewBox="0 0 16 16">
              <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
          </button>
        </div>
      </div>

      <div className="orders-overview__table">
        <div className="orders-overview__table-header">
          <div className="orders-overview__header-cell">ORDER #</div>
          <div className="orders-overview__header-cell">CUSTOMER</div>
          <div className="orders-overview__header-cell">TYPE</div>
          <div className="orders-overview__header-cell">ITEMS</div>
          <div className="orders-overview__header-cell">AMOUNT</div>
          <div className="orders-overview__header-cell">STATUS</div>
        </div>

        <div className="orders-overview__table-body">
          {orders.map(order => (
            <div key={order.id} className="orders-overview__row">
              <div className="orders-overview__cell">{order.orderNumber}</div>
              <div className="orders-overview__cell">{order.customerName}</div>
              <div className="orders-overview__cell">{order.orderType}</div>
              <div className="orders-overview__cell">{order.itemsCount}</div>
              <div className="orders-overview__cell">LKR {order.amount.toLocaleString()}</div>
              <div className="orders-overview__cell">
                <span className={`orders-overview__status orders-overview__status--${order.status.replace(/\s+/g, '-').toLowerCase()}`}>
                  {order.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrdersOverview;
