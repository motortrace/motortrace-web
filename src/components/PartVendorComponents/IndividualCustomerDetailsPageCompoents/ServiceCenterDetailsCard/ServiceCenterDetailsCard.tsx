import React from 'react';
import { Calendar, Mail, Phone, Building2, User2, BadgeCheck } from 'lucide-react';
import './ServiceCenterDetailsCard.scss';
import servicecenterlogo from '../../../../assets/images/servicecenterlogo.png';

const ServiceCenterDetailsCard = () => {
  const shop = {
    profilePic: servicecenterlogo,
    name: 'AutoFix Spare Parts Shop',
    type: 'Service Center',
    registration: 'SC-2023-0012',
    owner: 'Ruwan Perera',
    email: 'autofix@spareparts.lk',
    phone: '077-9876543',
    address: {
      number: '88',
      street: 'Main Street',
      city: 'Kandy',
      province: 'Central Province',
      postalCode: '20000',
    },
    joinedDate: '2022-11-20',
  };

  return (
    <div className="service-center-card">
      <div className="service-center-card__header">
        <img src={shop.profilePic} alt={shop.name} className="service-center-card__avatar" />
        <div className="service-center-card__basic">
          <h2>{shop.name}</h2>
          <div className="service-center-card__badge"><BadgeCheck size={16} /> {shop.type}</div>
          <div style={{ fontSize: 13, color: '#6b7280', marginTop: 2 }}><Building2 size={13} style={{marginRight:4}} />Reg. No: {shop.registration}</div>
        </div>
      </div>
      <div className="service-center-card__info-blocks">
        <div className="service-center-card__block">
          <h4>Contact</h4>
          <p><Mail size={14} /> {shop.email}</p>
          <p><Phone size={14} /> {shop.phone}</p>
          <p><User2 size={14} /> Owner: {shop.owner}</p>
        </div>
        <div className="service-center-card__block">
          <h4>Address</h4>
          <p>{shop.address.number} {shop.address.street}</p>
          <p>{shop.address.city}, {shop.address.province}</p>
          <p>{shop.address.postalCode}</p>
        </div>
      </div>
      <div className="service-center-card__meta">
        <div className="service-center-card__badge"><Calendar size={14} /> Joined: {shop.joinedDate}</div>
      </div>
    </div>
  );
};

export default ServiceCenterDetailsCard; 