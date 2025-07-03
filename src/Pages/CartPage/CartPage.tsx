import React from 'react';
import './CartPage.scss';
import CartStoreGroup from '../../components/CartPageComponents/CartStoreGroup/CartStoreGroup';
import CartTotalSummary from '../../components/CartPageComponents/CartTotalSummaryComponent/CartTotalSummary';

import BrakePad from '../../assets/images/brakePads.png' ;
import light from '../../assets/images/light.png' ;
import radiator from '../../assets/images/radiator.png' ;
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';


const dummyCartData = [
  {
    storeName: 'AutoParts Plus',
    storeId: 'store-1',
    items: [
      {
        id: 'p1',
        name: 'Brake Pads',
        price: 35.0,
        quantity: 2,
        image: BrakePad,
      },
      {
        id: 'p2',
        name: 'LED Headlight Bulb',
        price: 19.99,
        quantity: 1,
        image: light,
      },
    ],
  },
  {
    storeName: 'MotorHub',
    storeId: 'store-2',
    items: [
      {
        id: 'p3',
        name: 'Radiator',
        price: 85.0,
        quantity: 1,
        image: radiator,
      },
    ],
  },
];

const calculateSubtotal = () => {
  return dummyCartData.reduce((acc, store) => {
    return (
      acc +
      store.items.reduce((storeTotal, item) => storeTotal + item.price * item.quantity, 0)
    );
  }, 0);
};

const CartPage = () => {
  const subtotal = calculateSubtotal();
  const total = subtotal; // You can include shipping logic if needed

  const handleCheckout = () => {
    console.log('Proceed to checkout');
  };

  return (
    
<div className="cart-page">
  <Navbar />

  <main className="cart-main">
    <div className="cart-left">
      {dummyCartData.map((store) => (
        <CartStoreGroup key={store.storeId} storeName={store.storeName} items={store.items} />
      ))}
    </div>

    <div className="cart-right">
      <CartTotalSummary subtotal={subtotal} total={total} onCheckout={handleCheckout} />
    </div>
  </main>

  <Footer/>
</div>

  );
};

export default CartPage;
