import React from 'react';
import type { ServicePackage } from '../types/jobCard.types';

interface AuthorizationCardProps {
  services: ServicePackage[];
  sendAuthorizationRequest: () => void;
}

const AuthorizationCard: React.FC<AuthorizationCardProps> = ({ services, sendAuthorizationRequest }) => (
  <div className="sidebar-card">
    <h3 className="sidebar-card__title">Authorization Status</h3>
    <div className="auth-status">
      <div className="auth-status__item">
        <div className="auth-status__indicator">
          <div className="auth-status__dot auth-status__dot--pending"></div>
          <span>Pending Approval</span>
        </div>
        <span className="auth-status__count">{services.filter(s => !s.authorized).length}</span>
      </div>
      <div className="auth-status__item">
        <div className="auth-status__indicator">
          <div className="auth-status__dot auth-status__dot--approved"></div>
          <span>Approved</span>
        </div>
        <span className="auth-status__count">{services.filter(s => s.authorized).length}</span>
      </div>
      <div className="auth-status__item">
        <div className="auth-status__indicator">
          <div className="auth-status__dot auth-status__dot--declined"></div>
          <span>Declined</span>
        </div>
        <span className="auth-status__count">0</span>
      </div>
    </div>
    <button className="btn btn--primary btn--full-width" onClick={sendAuthorizationRequest}>
      Send Authorization Request
    </button>
  </div>
);

export default AuthorizationCard;
