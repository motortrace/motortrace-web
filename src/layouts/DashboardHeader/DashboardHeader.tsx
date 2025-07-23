// src/components/DashboardHeader/DashboardHeader.tsx
import React from 'react';
import MonthFilter from '../../components/MonthFilter/MonthFilter';
import ManageWidgetsButton from '../../components/MonthWidgetsButton/MonthWidgetsButton';
import AddWidgetButton from '../../components/AddWidgetButton/AddWidgetButton';
import MetricCard from '../../components/MetricCard/MetricCard';
import './DashboardHeader.scss';

interface DashboardHeaderProps {
  onAddWidget?: () => void;
  onManageWidgets?: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  onAddWidget,
  onManageWidgets
}) => {
  
  return (
    <div className="dashboard-header">
      <div className="dashboard-header__container">
        <div className="dashboard-header__left">
          <MonthFilter />
          <ManageWidgetsButton onClick={onManageWidgets} />
        </div>
        <div className="dashboard-header__right">
          <AddWidgetButton onClick={onAddWidget} />
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;