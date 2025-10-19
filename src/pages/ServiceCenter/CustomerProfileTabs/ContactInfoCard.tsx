import React from 'react';

interface CustomerDetails {
  id: string;
  email: string;
  phone: string;
  joinedDate?: string;
}

interface ContactInfoCardProps {
  customer: CustomerDetails;
}

const ContactInfoCard: React.FC<ContactInfoCardProps> = ({ customer }) => {
  return (
    <div className="card contact-info-card">
      <div className="card-header">
        <h3>Contact & Account Information</h3>
      </div>
      <div className="card-body">
        <div className="info-grid-horizontal">
          <div className="info-item">
            <i className="bx bx-envelope"></i>
            <div>
              <span className="info-label">Email</span>
              <span className="info-value">{customer.email}</span>
            </div>
          </div>
          <div className="info-item">
            <i className="bx bx-phone"></i>
            <div>
              <span className="info-label">Phone</span>
              <span className="info-value">{customer.phone}</span>
            </div>
          </div>
          <div className="info-item">
            <i className="bx bx-calendar"></i>
            <div>
              <span className="info-label">Customer Since</span>
              <span className="info-value">{customer.joinedDate || 'N/A'}</span>
            </div>
          </div>
          <div className="info-item">
            <i className="bx bx-id-card"></i>
            <div>
              <span className="info-label">Customer ID</span>
              <span className="info-value">{customer.id}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfoCard;
