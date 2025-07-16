import React from 'react';
import CustomerDetailsCard from '../../../components/PartVendorComponents/IndividualCustomerDetailsPageCompoents/CustomerDetailsCard/CustomerDetailsCard';
import CustomerSpendCard from '../../../components/PartVendorComponents/IndividualCustomerDetailsPageCompoents/CustomerSpendCard/CustomerSpendCard';
import CustomerOrdersTable from '../../../components/PartVendorComponents/IndividualCustomerDetailsPageCompoents/CustomerOrdersTable/CustomerOrdersTable';

const orders = [
  {
    id: '1',
    orderNumber: '#ORD00123',
    products: [
      { name: 'Brake Pads - Honda Civic', imageUrl: 'https://via.placeholder.com/40?text=Brake' },
      { name: 'Oil Filter - Toyota', imageUrl: 'https://via.placeholder.com/40?text=Oil+Filter' },
    ],
    amount: 8500,
    status: 'Completed',
    deliveryStatus: 'Delivered',
    rating: 5,
  },
  {
    id: '2',
    orderNumber: '#ORD00124',
    products: [
      { name: 'Air Filter - Nissan', imageUrl: 'https://via.placeholder.com/40?text=Air+Filter' },
    ],
    amount: 2200,
    status: 'Pending',
    deliveryStatus: 'Not Delivered',
  },
  {
    id: '3',
    orderNumber: '#ORD00125',
    products: [
      { name: 'Headlight Bulb - LED H7', imageUrl: 'https://via.placeholder.com/40?text=Bulb' },
    ],
    amount: 1900,
    status: 'Completed',
    deliveryStatus: 'Delivered',
    rating: 4,
  },
  {
    id: '4',
    orderNumber: '#ORD00126',
    products: [
      { name: 'Car Battery - Amaron 65Ah', imageUrl: 'https://via.placeholder.com/40?text=Battery' },
    ],
    amount: 14500,
    status: 'Completed',
    deliveryStatus: 'Delivered',
    rating: 5,
  },
  {
    id: '5',
    orderNumber: '#ORD00127',
    products: [
      { name: 'Wiper Blades - Bosch Set', imageUrl: 'https://via.placeholder.com/40?text=Wipers' },
      { name: 'Coolant 1L - Toyota Red', imageUrl: 'https://via.placeholder.com/40?text=Coolant' },
    ],
    amount: 4300,
    status: 'Cancelled',
    deliveryStatus: 'Not Delivered',
  },
  {
    id: '6',
    orderNumber: '#ORD00128',
    products: [
      { name: 'Spark Plugs - NGK (4 Pack)', imageUrl: 'https://via.placeholder.com/40?text=Spark' },
    ],
    amount: 3200,
    status: 'In Progress',
    deliveryStatus: 'Not Delivered',
  },
];

const CustomerDetailsPage = () => {
  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <CustomerDetailsCard
        profilePic="https://i.pravatar.cc/100?img=12"
        name="Nimal Perera"
        email="nimalp@example.lk"
        phone="077-1234567"
        billingAddress={{
          streetNumber: '45',
          lane: 'Temple Road',
          city: 'Colombo',
          province: 'Western Province',
          postalCode: '00700',
        }}
        shippingAddress={{
          streetNumber: '45',
          lane: 'Temple Road',
          city: 'Colombo',
          province: 'Western Province',
          postalCode: '00700',
        }}
        joinedDate="2023-02-12"
        totalSpending="LKR 45,000"
      />

      <CustomerSpendCard
        totalSpend={39200}
        spendChange={8}
        totalOrders={6}
        orderChange={4}
        averageValue={6533}
        averageChange={5}
        averageRating={4.7}
        ratedOrders={4}
      />

      <CustomerOrdersTable orders={orders} />
    </div>
  );
};

export default CustomerDetailsPage;
