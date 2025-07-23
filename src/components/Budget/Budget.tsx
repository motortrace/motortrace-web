// src/components/Budget/Budget.tsx
import React from 'react';
import { TrendingUp } from 'lucide-react';
import './Budget.scss';

interface BudgetCategory {
  name: string;
  color: string;
  amount?: number;
}

interface BudgetProps {
  totalBudget?: number;
  spentAmount?: number;
  categories?: BudgetCategory[];
}

const Budget: React.FC<BudgetProps> = ({ 
  totalBudget = 400, 
  spentAmount = 297, 
  categories 
}) => {
  const defaultCategories = [
    { name: 'Cafe & Restaurants', color: '#8b5cf6' },
    { name: 'Entertainment', color: '#a78bfa' },
    { name: 'Investments', color: '#c4b5fd' },
    { name: 'Food & Groceries', color: '#1f2937' },
    { name: 'Health & Beauty', color: '#6b7280' },
    { name: 'Traveling', color: '#9ca3af' },
  ];

  const budgetCategories = categories || defaultCategories;
  const percentage = Math.round((spentAmount / totalBudget) * 100);
  const remainingAmount = totalBudget - spentAmount;

  // Calculate the stroke-dasharray for the progress circle
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="budget">
      <div className="budget__header">
        <h3 className="budget__title">Budget</h3>
        <button className="budget__trend-btn">
          <TrendingUp className="budget__trend-icon" />
        </button>
      </div>

      <div className="budget__content">
        <div className="budget__chart">
          <div className="budget__circle-container">
            <svg className="budget__circle" width="100" height="100">
              <circle
                cx="50"
                cy="50"
                r={radius}
                stroke="#f3f4f6"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="50"
                cy="50"
                r={radius}
                stroke="#8b5cf6"
                strokeWidth="8"
                fill="none"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
                className="budget__progress-circle"
              />
            </svg>
            <div className="budget__circle-content">
              <div className="budget__percentage">{percentage}%</div>
              <div className="budget__amount-label">
                <span className="budget__spent">${spentAmount}</span>
                <span className="budget__total">of ${totalBudget}</span>
              </div>
            </div>
          </div>
          <div className="budget__remaining">
            <span className="budget__remaining-text">Total for month</span>
            <span className="budget__remaining-amount">${remainingAmount.toFixed(2)}</span>
          </div>
        </div>

        <div className="budget__categories">
          {budgetCategories.map((category, index) => (
            <div key={index} className="budget__category">
              <div 
                className="budget__category-dot" 
                style={{ backgroundColor: category.color }}
              ></div>
              <span className="budget__category-name">{category.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Budget;