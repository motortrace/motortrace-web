import React from 'react';
import './CustomerSpendCard.scss';
import { TrendingUp, TrendingDown, Star } from 'lucide-react';
import MonthFilter from '../../../MonthFilter/MonthFilter';

interface Props {
    totalSpend: number;
    spendChange: number;
    totalOrders: number;
    orderChange: number;
    averageValue: number;
    averageChange: number;
    averageRating: number;
    ratedOrders: number;
}

const CustomerSpendCard: React.FC<Props> = ({
    totalSpend = 34000,
    spendChange = 12,
    totalOrders = 8,
    orderChange = 5,
    averageValue = 4250,
    averageChange = 7,
    averageRating = 4.2,
    ratedOrders = 6
}) => {
    return (
        <div className="customer-spend-card">
            <h3 className="customer-spend-card__title">Total Spent</h3>
              <MonthFilter />
            <p className="customer-spend-card__amount">LKR {totalSpend.toLocaleString()}</p>
            <span className={`customer-spend-card__delta ${spendChange >= 0 ? 'positive' : 'negative'}`}>
                {spendChange >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                {Math.abs(spendChange)}% since last month
            </span>

            <div className="customer-spend-card__stats-row">
                <div className="stat-box">
                    <h4>Total Orders</h4>
                    <p>{totalOrders}</p>
                    <span className={`stat-delta ${orderChange >= 0 ? 'positive' : 'negative'}`}>
                        {orderChange >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        {Math.abs(orderChange)}%
                    </span>
                </div>

                <div className="stat-box">
                    <h4>Avg. Order Value</h4>
                    <p>LKR {averageValue.toLocaleString()}</p>
                    <span className={`stat-delta ${averageChange >= 0 ? 'positive' : 'negative'}`}>
                        {averageChange >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        {Math.abs(averageChange)}%
                    </span>
                </div>

                <div className="stat-box">
                    <h4>Avg. Order Rating</h4>
                    <div className="rating-box">
                        <span className="rating">
                            <Star size={14} fill="#facc15" stroke="#facc15" />
                            {averageRating.toFixed(1)}
                        </span>
                        <span className="rated-orders">{ratedOrders} rated</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerSpendCard;
