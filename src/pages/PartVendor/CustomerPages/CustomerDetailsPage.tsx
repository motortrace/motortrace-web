import React from 'react'
import CustomerDetailsCard from '../../../components/PartVendorComponents/IndividualCustomerDetailsPageCompoents/CustomerDetailsCard/CustomerDetailsCard'

const CustomerDetailsPage = () => {
  return (
    <div>
<CustomerDetailsCard
  profilePic="https://i.pravatar.cc/90?img=12"
  name="Nimal Perera"
  email="nimalp@example.lk"
  phone="077-1234567"
  billingAddress="45 Temple Road, Colombo, Western Province, 00700"
  shippingAddress="45 Temple Road, Colombo, Western Province, 00700"
  joinedDate="2023-02-12"
/>



    </div>
  )
}

export default CustomerDetailsPage
