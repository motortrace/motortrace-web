import React from 'react';
import './StoreNavBar.scss';

interface StoreNavProps {
  sections: string[];
  onSelect: (section: string) => void;
  selectedSection: string;
}

const StoreNav: React.FC<StoreNavProps> = ({ sections, onSelect, selectedSection }) => {
  return (
    <div className="store-nav">
      {sections.map((section) => (
        <div
          key={section}
          className={`store-nav__item ${selectedSection === section ? 'active' : ''}`}
          onClick={() => onSelect(section)}
        >
          {section}
        </div>
      ))}
    </div>
  );
};

export default StoreNav;
