import React from 'react';
import './StoreStats.scss';
import { Star, Users, MessageCircle, Clock } from 'lucide-react';

const StoreStats = () => {
  return (
    <section className="store-stats">
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
    </section>
  );
};

export default StoreStats;
