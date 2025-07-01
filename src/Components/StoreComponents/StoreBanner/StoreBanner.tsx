import React from 'react';
import './StoreBanner.scss';

import logo from '../../../assets/images/store.png';
import { Star, Users, MessageCircle, Clock } from 'lucide-react';

const StoreBanner = () => {
  return (
    <section className="store-banner">
      <div className="store-banner__cover" />
      <div className="store-banner__content">
        {/* Left side: logo + info */}
        <div className="store-banner__left">
          <img src={logo} alt="Store Logo" className="store-banner__logo" />
          <div className="store-banner__info">
            <h1 className="store-banner__name">AutoFix Spare Parts</h1>
            <p className="store-banner__desc">
              Your trusted store for genuine auto spare parts. Fast delivery and great support.
            </p>
          </div>
        </div>

        {/* Right side: buttons + stats */}
        <div className="store-banner__right">
          <div className="store-banner__actions">
            <button className="btn follow-btn">Follow</button>
            <button className="btn message-btn">Message</button>
          </div>
{/* 
          <div className="store-banner__stats">
            <div className="stat-box">
              <Star className="icon" />
              <div>
                <p className="stat-value">4.8</p>
                <p className="stat-label">Rating</p>
              </div>
            </div>
            <div className="stat-box">
              <Users className="icon" />
              <div>
                <p className="stat-value">2.3k</p>
                <p className="stat-label">Followers</p>
              </div>
            </div>
            <div className="stat-box">
              <MessageCircle className="icon" />
              <div>
                <p className="stat-value">98%</p>
                <p className="stat-label">Response Rate</p>
              </div>
            </div>
            <div className="stat-box">
              <Clock className="icon" />
              <div>
                <p className="stat-value">Since 2022</p>
                <p className="stat-label">Active</p>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </section>
  );
};

export default StoreBanner;
