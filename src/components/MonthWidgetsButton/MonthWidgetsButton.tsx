// src/components/ManageWidgetsButton/ManageWidgetsButton.tsx
import React from 'react';
import { Settings } from 'lucide-react';
import './MonthWidgetsButton.scss';

interface ManageWidgetsButtonProps {
  onClick?: () => void;
}

const ManageWidgetsButton: React.FC<ManageWidgetsButtonProps> = ({ onClick }) => {
  return (
    <button className="manage-widgets-button" onClick={onClick}>
      <Settings className="manage-widgets-button__icon" />
      Manage widgets
    </button>
  );
};

export default ManageWidgetsButton;