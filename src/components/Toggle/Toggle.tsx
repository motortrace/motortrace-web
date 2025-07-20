import React from 'react';
import "./Toggle.scss"

interface ToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  label: string;
  description?: string;
}

const Toggle: React.FC<ToggleProps> = ({ enabled, onChange, label, description }) => {
  return (
    <div className="toggle">
      <div className="toggle__content">
        <div className="toggle__content-label">{label}</div>
        {description && <p className="toggle__content-description">{description}</p>}
      </div>
      <button
        type="button"
        className={`toggle__switch ${enabled ? 'toggle__switch--enabled' : 'toggle__switch--disabled'}`}
        onClick={() => onChange(!enabled)}
      >
        <span className={`toggle__switch-thumb ${enabled ? 'toggle__switch-thumb--enabled' : ''}`} />
      </button>
    </div>
  );
};

export default Toggle;