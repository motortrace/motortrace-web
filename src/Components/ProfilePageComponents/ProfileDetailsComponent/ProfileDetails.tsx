import React from 'react';
import './ProfileDetails.scss';
import userImage from '../../../assets/images/profile/user.png';

const ProfileDetails: React.FC = () => {
  return (
    <div className="profile-details">
      <div className="profile-header">
        <img
          src={userImage}
          alt="User Avatar"
          className="avatar"
        />
        <div className="user-info">
          <h2 className="name">Nadeesha Perera</h2>
          <p className="email">nadeesha.perera92@gmail.com</p>
          <span className="role">Verified Seller</span>
        </div>
        <button className="edit-btn">Edit Profile</button>
      </div>

      <div className="profile-section">
        <h3 className="section-title">Contact Info</h3>
        <ul className="info-list">
          <li><strong>Phone:</strong> +94 71 234 5678</li>
          <li><strong>Address:</strong> 45 Galle Road, Colombo 03, Sri Lanka</li>
          <li><strong>Joined:</strong> February 2022</li>
        </ul>
      </div>

      <div className="profile-section">
        <h3 className="section-title">Store Details</h3>
        <ul className="info-list">
          <li><strong>Status:</strong> Active</li>
          <li><strong>Store Name:</strong> TrendyLanka</li>
          <li><strong>Subscription:</strong> Business Plus</li>
          <li><strong>Payment Method:</strong> Bank Transfer - Commercial Bank</li>
        </ul>
      </div>
    </div>
  );
};

export default ProfileDetails;
