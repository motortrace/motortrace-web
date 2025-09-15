// // src/components/ProductMetricsCard/ProductMetricsCard.tsx
// import React from 'react';
// import { PackageCheck, AlertTriangle, PackageX, Boxes } from 'lucide-react';
// import './ProductMetricCard.scss';

// interface ProductMetric {
//   title: string;
//   amount: string;
//   change?: string;
//   changeType?: 'positive' | 'negative';
//   icon: React.ReactNode;
//   period?: string;
// }

// const productMetrics: ProductMetric[] = [
//   {
//     title: 'Total Products',
//     amount: '152',
//     // change: '5%',
//     // changeType: 'positive',
//     icon: <PackageCheck size={24} />
//   },
//   {
//     title: 'Low Stock Items',
//     amount: '8',
//     // change: '2%',
//     // changeType: 'negative',
//     icon: <AlertTriangle size={24} />
//   },
//   {
//     title: 'Out of Stock',
//     amount: '3',
//     // change: '1%',
//     // changeType: 'negative',
//     icon: <PackageX size={24} />
//   },
//   {
//     title: 'Inventory Value',
//     amount: 'LKR 1.2M',
//     // change: '3%',
//     // changeType: 'positive',
//     icon: <Boxes size={24} />
//   }
// ];

// const ProductMetricsCard: React.FC = () => {
//   return (
//     <div className="product-metrics-row">
//       {productMetrics.map((metric) => (
//         <div className="product-metrics-card" key={metric.title}>
//           <div className="product-metrics-card__content">
//             <div className="product-metrics-card__header">
//               <div className="product-metrics-card__icon">{metric.icon}</div>
//               <h3 className="product-metrics-card__title">{metric.title}</h3>
//             </div>
//             <p className="product-metrics-card__amount">{metric.amount}</p>
//             <div className="product-metrics-card__footer">
//               {metric.change && (
//                 <span className={`product-metrics-card__change product-metrics-card__change--${metric.changeType}`}>
//                   {metric.changeType === 'positive' ? '↑' : '↓'} {metric.change}
//                 </span>
//               )}
//               {/* <span className="product-metrics-card__period">{metric.period || 'vs last month'}</span> */}
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default ProductMetricsCard;

// src/components/ProductMetricsCard/ProductMetricsCard.tsx
import React, { useState, useEffect } from 'react';
import { PackageCheck, AlertTriangle, PackageX, Boxes } from 'lucide-react';
import './ProductMetricCard.scss';

interface ProductMetric {
  title: string;
  amount: string;
  change?: string;
  changeType?: 'positive' | 'negative';
  icon: React.ReactNode;
  period?: string;
}

interface AnalyticsData {
  totalProducts: number;
  inventoryValue: number;
  categoryDistribution: Array<{
    category: string;
    count: string;
  }>;
  availabilityDistribution: Array<{
    availability: string;
    count: string;
  }>;
  timestamp: string;
}

const ProductMetricsCard: React.FC = () => {
  const [metrics, setMetrics] = useState<ProductMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/api/analytics/inventory');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: AnalyticsData = await response.json();
      
      // Convert the API data to metrics format
      const lowStockCount = data.availabilityDistribution.find(
        item => item.availability === 'Low Stock'
      )?.count || '0';
      
      const outOfStockCount = data.availabilityDistribution.find(
        item => item.availability === 'Out of Stock'
      )?.count || '0';

      const formattedMetrics: ProductMetric[] = [
        {
          title: 'Total Products',
          amount: data.totalProducts.toString(),
          icon: <PackageCheck size={24} />
        },
        {
          title: 'Low Stock Items',
          amount: lowStockCount,
          icon: <AlertTriangle size={24} />
        },
        {
          title: 'Out of Stock',
          amount: outOfStockCount,
          icon: <PackageX size={24} />
        },
        {
          title: 'Inventory Value',
          amount: `LKR ${data.inventoryValue.toLocaleString()}`,
          icon: <Boxes size={24} />
        }
      ];
      
      setMetrics(formattedMetrics);
      setLastUpdated(new Date().toLocaleTimeString());
      setError(null);
    } catch (err) {
      setError('Failed to load metrics data');
      console.error('Error fetching metrics:', err);
      
      // Fallback to empty metrics
      setMetrics([
        {
          title: 'Total Products',
          amount: '0',
          icon: <PackageCheck size={24} />
        },
        {
          title: 'Low Stock Items',
          amount: '0',
          icon: <AlertTriangle size={24} />
        },
        {
          title: 'Out of Stock',
          amount: '0',
          icon: <PackageX size={24} />
        },
        {
          title: 'Inventory Value',
          amount: 'LKR 0',
          icon: <Boxes size={24} />
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="product-metrics-row">
        {[1, 2, 3, 4].map((item) => (
          <div className="product-metrics-card loading" key={item}>
            <div className="product-metrics-card__content">
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
      <div className="product-metrics-row">
        <div className="product-metrics-card error">
          <div className="product-metrics-card__content">
            <p className="error-message">{error}</p>
            <button onClick={fetchMetrics} className="retry-btn">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="product-metrics-row">
      {metrics.map((metric) => (
        <div className="product-metrics-card" key={metric.title}>
          <div className="product-metrics-card__content">
            <div className="product-metrics-card__header">
              <div className="product-metrics-card__icon">{metric.icon}</div>
              <h3 className="product-metrics-card__title">{metric.title}</h3>
            </div>
            <p className="product-metrics-card__amount">{metric.amount}</p>
            <div className="product-metrics-card__footer">
              {metric.change && (
                <span className={`product-metrics-card__change product-metrics-card__change--${metric.changeType}`}>
                  {metric.changeType === 'positive' ? '↑' : '↓'} {metric.change}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
      {/* {lastUpdated && (
        <div className="metrics-last-updated">
          Last updated: {lastUpdated}
        </div>
      )} */}
    </div>
    
  );
};

export default ProductMetricsCard;