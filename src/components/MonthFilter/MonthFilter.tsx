// src/components/MonthFilter/MonthFilter.tsx
import React, { useState } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';
import './MonthFilter.scss';

const MonthFilter: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('This month');

  const months = [
    'This month',
    'Last month', 
    'Last 3 months',
    'Last 6 months',
    'This year'
  ];

  return (
    <div className="month-filter">
      <button
        className="month-filter__button"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Calendar className="month-filter__icon" />
        {selectedMonth}
        <ChevronDown className="month-filter__chevron" />
      </button>
      
      {isOpen && (
        <>
          <div 
            className="month-filter__overlay"
            onClick={() => setIsOpen(false)}
          />
          <div className="month-filter__dropdown">
            <div className="month-filter__options">
              {months.map((option) => (
                <button
                  key={option}
                  className="month-filter__option"
                  onClick={() => {
                    setSelectedMonth(option);
                    setIsOpen(false);
                  }}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MonthFilter;