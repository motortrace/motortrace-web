import React from 'react';
import './ProfitOverviewCard.scss';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

interface ProfitOverviewCardProps {
  totalRevenue: number;
  totalCosts: number;
  profitTrend: number; // Positive or negative %
}

const ProfitOverviewCard: React.FC<ProfitOverviewCardProps> = ({
  totalRevenue,
  totalCosts,
  profitTrend,
}) => {
  const totalProfit = totalRevenue - totalCosts;
  const profitMargin = ((totalProfit / totalRevenue) * 100).toFixed(1);
  const isPositive = profitTrend >= 0;

  return (
    <div className="profit-overview-card">
      <h3 className="profit-overview-card__title">Profit Overview</h3>

      <div className="profit-overview-card__profit">
        ₨ {totalProfit.toLocaleString()}
      </div>

      <div className="profit-overview-card__details">
        <div className="profit-overview-card__details__item">
          <span className="label">Total Revenue:</span>
          <span>₨ {totalRevenue.toLocaleString()}</span>
        </div>
        <div className="profit-overview-card__details__item">
          <span className="label">Total Costs:</span>
          <span>₨ {totalCosts.toLocaleString()}</span>
        </div>
        <div className="profit-overview-card__details__item">
          <span className="label">Profit Margin:</span>
          <span>{profitMargin}%</span>
        </div>
      </div>

      <div
        className={`profit-overview-card__trend ${
          isPositive ? 'positive' : 'negative'
        }`}
      >
        {isPositive ? <FaArrowUp /> : <FaArrowDown />}
        <span>
          {isPositive ? '+' : ''}
          {profitTrend.toFixed(1)}% vs last month
        </span>
      </div>
    </div>
  );
};

export default ProfitOverviewCard;
