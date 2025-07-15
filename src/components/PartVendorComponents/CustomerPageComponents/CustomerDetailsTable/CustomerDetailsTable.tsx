import React from 'react';
import './CustomerDetailsTable.scss';

const customers = [
  {
    id: 1,
    profilePic: 'https://i.pravatar.cc/50?img=12',
    name: 'Nimal Perera',
    email: 'nimalp@example.lk',
    phone: '077-1234567',
    address: {
      street: '45 Temple Road',
      city: 'Colombo',
      state: 'Western Province',
      zip: '00700'
    },
    type: 'Customer',
    joinedDate: '2023-02-12',
    spending: 'LKR 45,000',
    orders: 8,
    lastOrdered: '2024-06-20'
  },
  {
    id: 2,
    profilePic: 'https://i.pravatar.cc/50?img=25',
    name: 'Kumara Stores',
    email: 'kumara@stores.lk',
    phone: '071-9876543',
    address: {
      street: '789 Main Street',
      city: 'Kandy',
      state: 'Central Province',
      zip: '20000'
    },
    type: 'Service Center',
    joinedDate: '2022-11-05',
    spending: 'LKR 250,000',
    orders: 150,
    lastOrdered: '2024-07-01'
  },
  {
    id: 3,
    profilePic: 'https://i.pravatar.cc/50?img=8',
    name: 'Sanduni Rajapaksha',
    email: 'sanduni.raj@example.lk',
    phone: '078-1122334',
    address: {
      street: '10 Lake View Avenue',
      city: 'Galle',
      state: 'Southern Province',
      zip: '80000'
    },
    type: 'Customer',
    joinedDate: '2023-09-20',
    spending: 'LKR 12,500',
    orders: 3,
    lastOrdered: '2024-05-15'
  },
];

const CustomerDetailsTable: React.FC = () => {
  return (
<div className="customerSummary-details-card">
  <div className="customerSummary-details-card__header">
    <h3 className="customerSummary-details-card__title">Customer Details</h3>
    <div className="customerSummary-details-card__controls">
      <div className="customerSummary-details-card__search">
        <input type="text" placeholder="Search customers..." />
      </div>
      <select className="customerSummary-details-card__dropdown">
        <option value="">All Types</option>
        <option value="customer">Customer</option>
        <option value="service-center">Service Center</option>
      </select>
    </div>
  </div>

      <div className="customer-details-table">
        {customers.map((customer) => (
          <div className="customer-details-table__row" key={customer.id}>
            <div className="customer-details-table__cell">
              <img src={customer.profilePic} alt={customer.name} className="customer-details-table__avatar" />
            </div>
            <div className="customer-details-table__cell">
              <div className="customer-details-table__info">
                <strong>{customer.name}</strong>
                <span>{customer.email}</span>
                <span>{customer.phone}</span>
              </div>
            </div>
            <div className="customer-details-table__cell">
              <div className="customer-details-table__info">
                <span>{customer.address.street}</span>
                <span>{customer.address.city}, {customer.address.state} {customer.address.zip}</span>
              </div>
            </div>
            <div className="customer-details-table__cell">
              <div className="customer-details-table__info">
                <span className={`customer-details-table__customer-type customer-details-table__customer-type--${customer.type.toLowerCase().replace(' ', '-')}`}>
                  {customer.type}
                </span>
                <span>Joined: {customer.joinedDate}</span>
              </div>
            </div>
            <div className="customer-details-table__cell">
              <div className="customer-details-table__info">
                <strong className="customer-details-table__spending">{customer.spending}</strong>
                <span>Orders: {customer.orders}</span>
                <span>Last: {customer.lastOrdered}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerDetailsTable;
