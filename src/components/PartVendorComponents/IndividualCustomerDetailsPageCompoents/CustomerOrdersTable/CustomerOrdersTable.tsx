import React from 'react';
import './CustomerOrdersTable.scss';
import { Star } from 'lucide-react';

interface Product {
  name: string;
  imageUrl: string;
}

interface CustomerOrder {
  id: string;
  orderNumber: string;
  products: Product[];
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
              <div className="cell">{order.orderNumber}</div>

              {/* Items with preview */}
              <div className="cell order-details__product">
                <img src={order.products[0].imageUrl} alt={order.products[0].name} />
                <div className="order-details__product-info">
                  <span className="order-details__product-name">{order.products[0].name}</span>
                  {order.products.length > 1 && (
                    <span className="order-details__other-products">
                      +{order.products.length - 1} other product{order.products.length - 1 > 1 ? 's' : ''}
                    </span>
                  )}
                </div>
              </div>

              {/* Amount */}
              <div className="cell">
                <span className="order-amount">LKR {order.amount.toLocaleString()}</span>
              </div>

              {/* Status */}
              <div className="cell">
                <span className={`customer-orders-table__status customer-orders-table__status--${order.status.replace(/\s+/g, '-').toLowerCase()}`}>
                  {order.status}
                </span>
              </div>

              {/* Delivery */}
              <div className="cell">{order.deliveryStatus}</div>

              {/* Rating */}
              <div className="cell">
                {order.deliveryStatus === 'Not Delivered' ? (
                  '—'
                ) : order.rating ? (
                  <div className="customer-orders-table__stars">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        fill={i < order.rating ? '#facc15' : 'none'}
                        stroke="#facc15"
                      />
                    ))}
                  </div>
                ) : (
                  <span className="not-rated">Not Rated</span>
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
