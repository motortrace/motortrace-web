// // src/components/OrderMetricsCard/OrderMetricsCard.tsx
// import React from 'react';
// import { ShoppingCart, Clock, CheckCircle, DollarSign, XCircle, PackageCheck  } from 'lucide-react';
// import './OrderMetricCard.scss';

// interface OrderMetric {
//   title: string;
//   amount: string;
//   change: string;
//   changeType: 'positive' | 'negative';
//   icon: React.ReactNode;
//   period?: string;
// }

// const orderMetrics: OrderMetric[] = [
//   {
//     title: 'Total Issued Parts',
//     amount: '129',
//     change: '12%',
//     changeType: 'positive',
//     icon: <PackageCheck size={24} />
//   },
//   {
//     title: 'Total Sales',
//     amount: '12,500 LKR',
//     change: '3%',
//     changeType: 'negative',
//     icon: <DollarSign   size={24} />
//   },
//   {
//     title: 'Pending Isuuance',
//     amount: '5',
//     change: '1%',
//     changeType: 'negative',
//     icon: <Clock size={24} />
//   },
//   {
//     title: 'Completed Issuance',
//     amount: '210',
//     change: '4%',
//     changeType: 'positive',
//     icon: <CheckCircle size={24} />
//   },
//   {
//     title: 'Returned Parts',
//     amount: '15',
//     change: '2%',
//     changeType: 'negative',
//     icon: <XCircle size={24} />
//   }
// ];

// const OrderMetricsCard: React.FC = () => {
//   return (
//     <div className="order-metrics-row">
//       {orderMetrics.map((metric) => (
//         <div className="order-metrics-card" key={metric.title}>
//           <div className="order-metrics-card__content">
//                 <div className="order-metrics-card__header">
//       <div className="order-metrics-card__icon">{metric.icon}</div>
//       <h3 className="order-metrics-card__title">{metric.title}</h3>
//     </div>
//             <p className="order-metrics-card__amount">{metric.amount}</p>
//             <div className="order-metrics-card__footer">
//               <span className={`order-metrics-card__change order-metrics-card__change--${metric.changeType}`}>
//                 {metric.changeType === 'positive' ? '↑' : '↓'} {metric.change}
//               </span>
//               <span className="order-metrics-card__period">{metric.period || 'vs last month'}</span>
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default OrderMetricsCard;

// src/components/OrderMetricsCard/OrderMetricsCard.tsx
import React, { useState, useEffect } from 'react';
import { DollarSign, PackageCheck } from 'lucide-react';
import './OrderMetricCard.scss';

interface OrderMetric {
  title: string;
  amount: string;
  change: string;
  changeType: 'positive' | 'negative';
  icon: React.ReactNode;
  period?: string;
}

interface MetricsApiResponse {
  metrics: {
    totalIssuances?: number;
    totalIssuedParts?: number;
    totalSales?: number;
  };
  changes: {
    totalIssuances?: number;
    totalIssuedParts?: number;
    totalSales?: number;
  };
  period?: string;
}

const OrderMetricsCard: React.FC = () => {
  const [metrics, setMetrics] = useState<OrderMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrderMetrics();
  }, []);

  const fetchOrderMetrics = async () => {
    try {
      setLoading(true);
      setError(null);
      // Try the inventory endpoint first, fall back to the older /api path on 404
      const primaryUrl = 'http://localhost:3000/inventory/analytics/order-metrics';
      const fallbackUrl = 'http://localhost:3000/api/analytics/order-metrics';

      let response = await fetch(primaryUrl);

      if (!response.ok && response.status === 404) {
        console.warn(`Primary metrics endpoint returned 404, trying fallback: ${fallbackUrl}`);
        response = await fetch(fallbackUrl);
      }

      if (!response.ok) {
        // Try to include server error body if possible
        const text = await response.text().catch(() => '');
        throw new Error(`HTTP error! status: ${response.status}${text ? ' - ' + text : ''}`);
      }

      const raw = await response.json();
      // handle wrapper { success: true, data: { metrics, changes } }
      const payload = raw?.data ?? raw;
      const data: MetricsApiResponse = payload;
      
      // Defensive defaults in case some fields are missing from the API
      const totalIssuances = data.metrics?.totalIssuances ?? 0;
      const totalIssuedParts = data.metrics?.totalIssuedParts ?? 0;
      const totalSales = data.metrics?.totalSales ?? 0;

      const changeTotalIssuances = data.changes?.totalIssuances ?? 0;
      const changeTotalIssuedParts = data.changes?.totalIssuedParts ?? 0;
      const changeTotalSales = data.changes?.totalSales ?? 0;

      const orderMetricsData: OrderMetric[] = [
        {
          title: 'Total Issuances',
          amount: totalIssuances.toString(),
          change: `${Math.abs(changeTotalIssuances)}%`,
          changeType: changeTotalIssuances >= 0 ? 'positive' : 'negative',
          icon: <PackageCheck size={24} />,
          period: data.period
        },
        {
          title: 'Total Issued Parts',
          amount: totalIssuedParts.toString(),
          change: `${Math.abs(changeTotalIssuedParts)}%`,
          changeType: changeTotalIssuedParts >= 0 ? 'positive' : 'negative',
          icon: <PackageCheck size={24} />,
          period: data.period
        },
        {
          title: 'Total Sales',
          amount: `LKR ${totalSales.toLocaleString()}`,
          change: `${Math.abs(changeTotalSales)}%`,
          changeType: changeTotalSales >= 0 ? 'positive' : 'negative',
          icon: <DollarSign size={24} />,
          period: data.period
        }
      ];
      
  setMetrics(orderMetricsData);
      
    } catch (err) {
      console.error('Error fetching order metrics:', err);
      setError('Failed to load order metrics');
      // Fallback to empty metrics
      setMetrics([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="order-metrics-row">
        {[1, 2, 3].map((item) => (
          <div className="order-metrics-card loading" key={item}>
            <div className="order-metrics-card__content">
              <div className="loading-spinner"></div>
              <p>Loading...</p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="order-metrics-row">
        <div className="order-metrics-card error">
          <div className="order-metrics-card__content">
            <p className="error-message">{error}</p>
            <button onClick={fetchOrderMetrics} className="retry-btn">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="order-metrics-row">
      {metrics.map((metric) => (
        <div className="order-metrics-card" key={metric.title}>
          <div className="order-metrics-card__content">
            <div className="order-metrics-card__header">
              <div className="order-metrics-card__icon">{metric.icon}</div>
              <h3 className="order-metrics-card__title">{metric.title}</h3>
            </div>
            <p className="order-metrics-card__amount">{metric.amount}</p>
            <div className="order-metrics-card__footer">
              <span className={`order-metrics-card__change order-metrics-card__change--${metric.changeType}`}>
                {metric.changeType === 'positive' ? '↑' : '↓'} {metric.change}
              </span>
              <span className="order-metrics-card__period">{metric.period || 'vs last month'}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderMetricsCard;