// src/components/AddWidgetButton/AddWidgetButton.tsx
import React from 'react';
import { Plus } from 'lucide-react';
import './AddWidgetButton.scss';

interface AddWidgetButtonProps {
  onClick?: () => void;
}

const AddWidgetButton: React.FC<AddWidgetButtonProps> = ({ onClick }) => {
  return (
    <button className="add-widget-button" onClick={onClick}>
      <Plus className="add-widget-button__icon" />
      Add new widget
    </button>
  );
};

export default AddWidgetButton;