import React from 'react';
import './CustomerDetailsTable.scss';
import { useNavigate } from 'react-router-dom';

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
  // Additional mock rows for pagination
  {
    id: 4,
    profilePic: 'https://i.pravatar.cc/50?img=15',
    name: 'Dilani Silva',
    email: 'dilani.silva@example.lk',
    phone: '072-3344556',
    address: {
      street: '22 Palm Grove',
      city: 'Negombo',
      state: 'Western Province',
      zip: '11500'
    },
    type: 'Customer',
    joinedDate: '2023-04-10',
    spending: 'LKR 32,000',
    orders: 5,
    lastOrdered: '2024-06-10'
  },
  {
    id: 5,
    profilePic: 'https://i.pravatar.cc/50?img=19',
    name: 'AutoPro Center',
    email: 'autopro@center.lk',
    phone: '076-9988776',
    address: {
      street: '88 Workshop Lane',
      city: 'Matara',
      state: 'Southern Province',
      zip: '81000'
    },
    type: 'Service Center',
    joinedDate: '2022-08-15',
    spending: 'LKR 180,000',
    orders: 90,
    lastOrdered: '2024-06-28'
  },
  {
    id: 6,
    profilePic: 'https://i.pravatar.cc/50?img=21',
    name: 'Ruwan Jayasuriya',
    email: 'ruwan.jaya@example.lk',
    phone: '075-2233445',
    address: {
      street: '5 Lotus Road',
      city: 'Kurunegala',
      state: 'North Western',
      zip: '60000'
    },
    type: 'Customer',
    joinedDate: '2023-01-25',
    spending: 'LKR 21,000',
    orders: 2,
    lastOrdered: '2024-04-12'
  },
  {
    id: 7,
    profilePic: 'https://i.pravatar.cc/50?img=23',
    name: 'Nadeesha Motors',
    email: 'nadeesha@motors.lk',
    phone: '070-5566778',
    address: {
      street: '12 Main Street',
      city: 'Anuradhapura',
      state: 'North Central',
      zip: '50000'
    },
    type: 'Service Center',
    joinedDate: '2022-05-30',
    spending: 'LKR 95,000',
    orders: 40,
    lastOrdered: '2024-07-02'
  },
  // ...add more as needed
];

const CITIES = ['Colombo', 'Kandy', 'Galle', 'Negombo', 'Matara', 'Kurunegala', 'Anuradhapura'];
const SPENDING = ['< LKR 20,000', 'LKR 20,000 - 50,000', 'LKR 50,000 - 100,000', '> LKR 100,000'];
const ORDERS = ['1-5', '6-20', '21-50', '51+'];

const ROWS_PER_PAGE = 4;

function paginate<T>(array: T[], page: number, perPage: number): T[] {
  return array.slice((page - 1) * perPage, page * perPage);
}

const CustomerDetailsTable: React.FC = () => {
  const [page, setPage] = React.useState(1);
  const [type, setType] = React.useState('');
  const [city, setCity] = React.useState('');
  const [spending, setSpending] = React.useState('');
  const [orders, setOrders] = React.useState('');
  const [search, setSearch] = React.useState('');
  const navigate = useNavigate();

  let filtered = customers.filter(c =>
    (!type || c.type.toLowerCase().includes(type)) &&
    (!city || c.address.city === city) &&
    (!spending ||
      (spending === '< LKR 20,000' && parseInt(c.spending.replace(/\D/g, '')) < 20000) ||
      (spending === 'LKR 20,000 - 50,000' && parseInt(c.spending.replace(/\D/g, '')) >= 20000 && parseInt(c.spending.replace(/\D/g, '')) <= 50000) ||
      (spending === 'LKR 50,000 - 100,000' && parseInt(c.spending.replace(/\D/g, '')) > 50000 && parseInt(c.spending.replace(/\D/g, '')) <= 100000) ||
      (spending === '> LKR 100,000' && parseInt(c.spending.replace(/\D/g, '')) > 100000)
    ) &&
    (!orders ||
      (orders === '1-5' && c.orders >= 1 && c.orders <= 5) ||
      (orders === '6-20' && c.orders >= 6 && c.orders <= 20) ||
      (orders === '21-50' && c.orders >= 21 && c.orders <= 50) ||
      (orders === '51+' && c.orders >= 51)
    ) &&
    (!search || c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()))
  );
  const paginated = paginate(filtered, page, ROWS_PER_PAGE);
  const totalPages = Math.ceil(filtered.length / ROWS_PER_PAGE);

  return (
<div className="customerSummary-details-card">
  <div className="customerSummary-details-card__header">
    <h3 className="customerSummary-details-card__title">Customer Details</h3>
    <div className="customerSummary-details-card__controls">
      <div className="customerSummary-details-card__search">
        <input type="text" placeholder="Search customers..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
      </div>
      <select className="customerSummary-details-card__dropdown" value={type} onChange={e => { setType(e.target.value); setPage(1); }}>
        <option value="">All Types</option>
        <option value="customer">Customer</option>
        <option value="service center">Service Center</option>
      </select>
      <select className="customerSummary-details-card__dropdown" value={city} onChange={e => { setCity(e.target.value); setPage(1); }}>
        <option value="">All Cities</option>
        {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
      </select>
      <select className="customerSummary-details-card__dropdown" value={spending} onChange={e => { setSpending(e.target.value); setPage(1); }}>
        <option value="">All Spending</option>
        {SPENDING.map(s => <option key={s} value={s}>{s}</option>)}
      </select>
      <select className="customerSummary-details-card__dropdown" value={orders} onChange={e => { setOrders(e.target.value); setPage(1); }}>
        <option value="">All Orders</option>
        {ORDERS.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  </div>

      <div className="customer-details-table">
        {paginated.map((customer) => (
          <div
            className="customer-details-table__row"
            key={customer.id}
            style={{ cursor: 'pointer' }}
            onClick={() => {
              if (customer.type === 'Customer') {
                navigate(`/PartVendor/CustomerDetails`);
              } else if (customer.type === 'Service Center') {
                navigate(`/PartVendor/ServiceCenterCustomerDetails`);
              }
            }}
          >
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
    {totalPages > 1 && (
      <div className="order-details__pagination">
        <button
          className="order-details__pagination-btn"
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
        >
          Previous
        </button>
        <span className="order-details__pagination-info">
          Page {page} of {totalPages}
        </span>
        <button
          className="order-details__pagination-btn"
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    )}
    </div>
  );
};

export default CustomerDetailsTable;
