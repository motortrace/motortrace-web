import React, { useState } from 'react';
import './OrderDetails.scss';

import brakePadsImg from '../../../../assets/images/brakePads.png';
import engineOilImg from '../../../../assets/images/QuartzEngineOil.png';
import spark from '../../../../assets/images/spark.png' ;
import battery from '../../../../assets/images/battery.png' ;
import belt from '../../../../assets/images/timingBelt.png' ;

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  customerName: string;
  customerType: 'Customer' | 'Service Center';
  amount: string;
  status: 'Paid' | 'Pending' | 'Failed';
  products: { name: string; imageUrl: string }[];
}

// Inside your component
const orders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-1001',
    date: '2025-07-05',
    customerName: 'A. Fernando',
    customerType: 'Customer',
    amount: 'LKR 32,500',
    status: 'Paid',
    products: [
      { name: 'Brake Pads', imageUrl: brakePadsImg },
      { name: 'Engine Oil', imageUrl: engineOilImg },
      { name: 'Air Filter', imageUrl: 'https://via.placeholder.com/40' },
    ],
  },
  {
    id: '2',
    orderNumber: 'ORD-1002',
    date: '2025-07-05',
    customerName: 'M. Perera',
    customerType: 'Service Center',
    amount: 'LKR 12,000',
    status: 'Pending',
    products: [
      { name: 'Coolant', imageUrl: engineOilImg },
      { name: 'Wiper Blades', imageUrl: 'https://via.placeholder.com/40' },
    ],
  },
  {
    id: '3',
    orderNumber: 'ORD-1003',
    date: '2025-07-04',
    customerName: 'S. Silva',
    customerType: 'Customer',
    amount: 'LKR 8,750',
    status: 'Failed',
    products: [{ name: 'Spark Plugs', imageUrl: spark }],
  },
  {
    id: '4',
    orderNumber: 'ORD-1004',
    date: '2025-07-03',
    customerName: 'AutoFix Garage',
    customerType: 'Service Center',
    amount: 'LKR 45,000',
    status: 'Paid',
    products: [
      { name: 'Timing Belt', imageUrl: belt },
      { name: 'Oil Filter', imageUrl: 'https://via.placeholder.com/40' },
      { name: 'Radiator', imageUrl: 'https://via.placeholder.com/40' },
    ],
  },
  {
    id: '5',
    orderNumber: 'ORD-1005',
    date: '2025-07-02',
    customerName: 'N. Jayasinghe',
    customerType: 'Customer',
    amount: 'LKR 19,200',
    status: 'Pending',
    products: [
      { name: 'Battery', imageUrl: battery },
      { name: 'Headlights', imageUrl: 'https://via.placeholder.com/40' },
    ],
  },
  {
    id: '6',
    orderNumber: 'ORD-1006',
    date: '2025-07-01',
    customerName: 'R. Dissanayake',
    customerType: 'Customer',
    amount: 'LKR 25,800',
    status: 'Paid',
    products: [
      { name: 'Alternator', imageUrl: 'https://via.placeholder.com/40' },
      { name: 'Starter Motor', imageUrl: 'https://via.placeholder.com/40' },
    ],
  },
  {
    id: '7',
    orderNumber: 'ORD-1007',
    date: '2025-06-30',
    customerName: 'Speed Motors',
    customerType: 'Service Center',
    amount: 'LKR 55,000',
    status: 'Pending',
    products: [
      { name: 'Brake Discs', imageUrl: 'https://via.placeholder.com/40' },
      { name: 'Suspension Kit', imageUrl: 'https://via.placeholder.com/40' },
    ],
  },
  {
    id: '8',
    orderNumber: 'ORD-1008',
    date: '2025-06-29',
    customerName: 'N. Rathnayake',
    customerType: 'Customer',
    amount: 'LKR 13,400',
    status: 'Failed',
    products: [{ name: 'Cabin Air Filter', imageUrl: 'https://via.placeholder.com/40' }],
  },
  {
    id: '9',
    orderNumber: 'ORD-1009',
    date: '2025-06-28',
    customerName: 'Garage Pro',
    customerType: 'Service Center',
    amount: 'LKR 29,750',
    status: 'Paid',
    products: [
      { name: 'Oil Pump', imageUrl: 'https://via.placeholder.com/40' },
      { name: 'Fan Belt', imageUrl: 'https://via.placeholder.com/40' },
    ],
  },
  {
    id: '10',
    orderNumber: 'ORD-1010',
    date: '2025-06-27',
    customerName: 'L. Weerasinghe',
    customerType: 'Customer',
    amount: 'LKR 7,500',
    status: 'Paid',
    products: [{ name: 'Fuel Injector', imageUrl: 'https://via.placeholder.com/40' }],
  },
];

// Set items per page to show a good number of lines visually
const ITEMS_PER_PAGE = 5;


const OrderDetails: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(orders.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedOrders = orders.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  return (
    <div className="order-details">
      <div className="order-details__header">
        <h2 className="order-details__title">Recent Order Details</h2>
      </div>

      <div className="order-details__table">
        <div className="order-details__table-header">
          <div className="order-details__header-cell">Order #</div>
          <div className="order-details__header-cell">Product</div>
          <div className="order-details__header-cell">Date</div>
          <div className="order-details__header-cell">Customer</div>
          <div className="order-details__header-cell">Type</div>
          <div className="order-details__header-cell">Amount</div>
          <div className="order-details__header-cell">Status</div>
        </div>

        <div className="order-details__table-body">
          {paginatedOrders.map((order) => (
            <div key={order.id} className="order-details__row">
              <div className="order-details__cell" data-label="Order #">
                {order.orderNumber}
              </div>
              <div className="order-details__cell" data-label="Product">
                <div className="order-details__product">
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
              </div>
              <div className="order-details__cell" data-label="Date">
                {order.date}
              </div>
              <div className="order-details__cell" data-label="Customer">
                {order.customerName}
              </div>
              <div className="order-details__cell" data-label="Type">
                <span
                  className={`order-details__customer-type order-details__customer-type--${order.customerType
                    .toLowerCase()
                    .replace(/\s+/g, '-')}`}
                >
                  {order.customerType}
                </span>
              </div>
              <div className="order-details__cell" data-label="Amount">
                {order.amount}
              </div>
              <div className="order-details__cell" data-label="Status">
                <span className={`order-details__status order-details__status--${order.status.toLowerCase()}`}>
                  {order.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="order-details__pagination">
        <button
          className="order-details__pagination-btn"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="order-details__pagination-info">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="order-details__pagination-btn"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default OrderDetails;
