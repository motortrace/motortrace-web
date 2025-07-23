import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import "./CustomerActivityChart.scss";

const data = [
  { time: "12 AM", customers: 30, serviceCenters: 20 },
  { time: "1 AM", customers: 20, serviceCenters: 15 },
  { time: "2 AM", customers: 27, serviceCenters: 19 },
  { time: "3 AM", customers: 18, serviceCenters: 12 },
  { time: "4 AM", customers: 23, serviceCenters: 17 },
  { time: "5 AM", customers: 34, serviceCenters: 25 },
  { time: "6 AM", customers: 44, serviceCenters: 30 },
  { time: "7 AM", customers: 55, serviceCenters: 40 },
  { time: "8 AM", customers: 60, serviceCenters: 45 },
  { time: "9 AM", customers: 75, serviceCenters: 50 },
  { time: "10 AM", customers: 80, serviceCenters: 55 },
  { time: "11 AM", customers: 95, serviceCenters: 65 },
  { time: "12 PM", customers: 100, serviceCenters: 70 },
  { time: "1 PM", customers: 85, serviceCenters: 60 },
];

const CustomerActivityCard: React.FC = () => {
  return (
    <div className="customer-activity-card">
      <div className="customer-activity-card__header">
        <div className="customer-activity-card__title">Customer Activity</div>
        <div className="customer-activity-card__legend">
          <div className="customer-activity-card__legend-item">
            <span
              className="customer-activity-card__legend-color"
              style={{ backgroundColor: "#374151" }}
            ></span>
            Customers
          </div>
          <div className="customer-activity-card__legend-item">
            <span
              className="customer-activity-card__legend-color"
              style={{ backgroundColor: "#9ca3af" }}
            ></span>
            Service Centers
          </div>
        </div>
      </div>
      <div className="customer-activity-card__chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="customers"
              stroke="#374151"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="serviceCenters"
              stroke="#9ca3af"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CustomerActivityCard;
