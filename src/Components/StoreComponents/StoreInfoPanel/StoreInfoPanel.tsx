import React from 'react';
import { FaStar, FaRegEnvelope, FaUserPlus } from 'react-icons/fa';
import './StoreInfoPanel.scss';
import { Star, Users, MessageCircle, Clock } from 'lucide-react';
interface StoreInfoPanelProps {
  rating: number;
  followers: number;
  responseTime: string;
}



const StoreInfoPanel: React.FC<StoreInfoPanelProps> = ({ rating, followers, responseTime }) => {
  return (
    <div className="store-info-panel">
      <div className="store-info-panel__stat">
        <FaStar className="icon" />
        <span>{rating.toFixed(1)} Rating</span>
      </div>
      <div className="store-info-panel__stat">
        <FaUserPlus className="icon" />
        <span>{followers.toLocaleString()} Followers</span>
      </div>
      <div className="store-info-panel__stat">
        <FaRegEnvelope className="icon" />
        <span>Replies in {responseTime}</span>
      </div>
      <div className="store-info-panel__actions">
        <button className="follow-btn">Follow</button>
        <button className="chat-btn">Chat Now</button>
      </div>
          <div className="store-stats">
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
    </div>
    </div>
  );
};

export default StoreInfoPanel;
