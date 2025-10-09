import React from 'react';

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

interface Tab {
  id: string;
  label: string;
  icon: string;
}

/**
 * TabNavigation Component
 * Renders the tab navigation bar for the ManageWorkOrderModal
 * Handles role-based tab visibility (e.g., Services tab for non-service-advisors)
 */
const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
  // Get user role from localStorage
  const getUserRole = (): string => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      return user?.role || 'serviceadvisor';
    } catch {
      return 'serviceadvisor';
    }
  };

  const userRole = getUserRole();
  const isServiceAdvisor = userRole === 'serviceadvisor' || userRole === 'service_advisor' || userRole === 'advisor';

  // Define available tabs with role-based filtering
  const tabs: Tab[] = [
    { id: 'overview', label: 'Overview', icon: 'bx-home-circle' },
    { id: 'inspections', label: 'Inspections', icon: 'bx-search-alt' },
    // Only show Services tab for manager/admin roles, not for service advisors
    ...(isServiceAdvisor ? [] : [{ id: 'services', label: 'Services', icon: 'bx-wrench' }]),
    { id: 'estimates', label: 'Estimates', icon: 'bx-calculator' },
    { id: 'notes', label: 'Notes', icon: 'bx-note' },
  ];

  return (
    <div className="tab-navigation">
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          <i className={`bx ${tab.icon}`}></i>
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  );
};

export default TabNavigation;
