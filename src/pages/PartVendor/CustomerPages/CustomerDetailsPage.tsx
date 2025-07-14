import React from 'react'
import CustomerDetailsCard from '../../../components/PartVendorComponents/IndividualCustomerDetailsPageCompoents/CustomerDetailsCard/CustomerDetailsCard'
import CustomerOrderStats from '../../../components/PartVendorComponents/IndividualCustomerDetailsPageCompoents/CustomerOrderStats/CustomerOrderStats'
import CustomerOrdersTable from '../../../components/PartVendorComponents/IndividualCustomerDetailsPageCompoents/CustomerOrdersTable/CustomerOrdersTable';
const sampleOrders = [
    {
      id: '1',
      orderNumber: 'ORD-1001',
      itemsCount: 3,
      amount: 12500,
      status: 'Completed',
      deliveryStatus: 'Delivered',
      rating: 4,
    },
    {
      id: '2',
      orderNumber: 'ORD-1002',
      itemsCount: 2,
      amount: 7600,
      status: 'In Progress',
      deliveryStatus: 'Not Delivered',
    },
    {
      id: '3',
      orderNumber: 'ORD-1003',
      itemsCount: 1,
      amount: 4500,
      status: 'Pending',
      deliveryStatus: 'Not Delivered',
    },
    {
      id: '4',
      orderNumber: 'ORD-1004',
      itemsCount: 4,
      amount: 15900,
      status: 'Completed',
      deliveryStatus: 'Delivered',
      rating: 5,
    },
    {
      id: '5',
      orderNumber: 'ORD-1005',
      itemsCount: 2,
      amount: 9800,
      status: 'Completed',
      deliveryStatus: 'Delivered',
      // Not rated
    },
  ];
const CustomerDetailsPage = () => {
  return (
    <div>
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
    postalCode: '00700'
  }}
  shippingAddress={{
    streetNumber: '45',
    lane: 'Temple Road',
    city: 'Colombo',
    province: 'Western Province',
    postalCode: '00700'
  }}
  joinedDate="2023-02-12"
  totalSpending="LKR 45,000"
/>
<CustomerOrderStats
  totalSpendings="LKR 45,000"
  totalOrders={8}
  averageOrderValue="LKR 5,625"
  mostPurchasedItems={['Brake Pads', 'Oil Filter', 'Air Filter']}
/>
<CustomerOrdersTable orders={sampleOrders} />

    </div>
  )
}

export default CustomerDetailsPage
