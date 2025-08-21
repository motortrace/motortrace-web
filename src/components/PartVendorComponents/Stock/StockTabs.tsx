import React from 'react';
import './StockTabs.scss';

type TabKey = 'low' | 'out';

interface Props {
  active: TabKey;
  onChange: (t: TabKey) => void;
}

const StockTabs: React.FC<Props> = ({ active, onChange }) => {
  return (
    <div className="stock-tabs">
      <button
        className={`stock-tabs__btn ${active === 'low' ? 'is-active' : ''}`}
        onClick={() => onChange('low')}
        aria-pressed={active === 'low'}
      >
        Low Stocks
      </button>
      <button
        className={`stock-tabs__btn ${active === 'out' ? 'is-active-alt' : ''}`}
        onClick={() => onChange('out')}
        aria-pressed={active === 'out'}
      >
        Out of Stocks
      </button>
    </div>
  );
};

export default StockTabs;
