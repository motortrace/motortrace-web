import React from 'react';
import MetricCard from '../../../components/MetricCard/MetricCard';
import { Line, Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  RadialLinearScale,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import './AutoRepairReviews.scss';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, RadialLinearScale, Filler, Tooltip, Legend);

// Enhanced mock data with work order information
const summary = {
  averageRating: 4.6,
  returnRate: 13.2,
  reviewCount: 128,
};

const scoreHistory = [
  { date: '2024-01', score: 4.2 },
  { date: '2024-02', score: 4.3 },
  { date: '2024-03', score: 4.5 },
  { date: '2024-04', score: 4.7 },
  { date: '2024-05', score: 4.6 },
  { date: '2024-06', score: 4.8 },
  { date: '2024-07', score: 4.6 },
];

const aspectRatings = {
  Quality: 4.7,
  Price: 4.2,
  Timeliness: 4.5,
  Communication: 4.4,
  Cleanliness: 4.8,
  Professionalism: 4.6,
};

const locations = [
  { lat: 6.9271, lng: 79.8612, name: 'Colombo', returnRate: 12 },
  { lat: 7.2906, lng: 80.6337, name: 'Kandy', returnRate: 15 },
  { lat: 6.0535, lng: 80.2210, name: 'Galle', returnRate: 10 },
];

const reviews = [
  { 
    name: 'Ayesha Perera', 
    rating: 5, 
    date: '2024-07-01', 
    comment: 'Excellent service, very professional and quick. The team diagnosed the issue immediately and fixed it within the promised timeframe.', 
    avatar: 'https://randomuser.me/api/portraits/women/65.jpg', 
    verified: true,
    workOrder: 'WO-2024-0847',
    service: 'Engine Diagnostics & Repair',
    vehicleModel: '2018 Honda Civic',
    cost: 'LKR 25,000',
    location: 'Colombo Main Branch',
    completionTime: '2 hours',
    responseFromShop: 'Thank you Ayesha! We\'re glad we could get your Honda back on the road quickly.',
    helpful: 12,
    photos: ['repair_1.jpg', 'repair_2.jpg']
  },
  { 
    name: 'Nimal Silva', 
    rating: 4, 
    date: '2024-06-28', 
    comment: 'Good work on the brake system, but pricing could be more competitive compared to other shops in the area.', 
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg', 
    verified: true,
    workOrder: 'WO-2024-0832',
    service: 'Brake System Overhaul',
    vehicleModel: '2020 Toyota Corolla',
    cost: 'LKR 18,500',
    location: 'Kandy Branch',
    completionTime: '3 hours',
    responseFromShop: null,
    helpful: 8,
    photos: []
  },
  { 
    name: 'Saman Kumara', 
    rating: 5, 
    date: '2024-06-20', 
    comment: 'Friendly staff and very clean workshop. They explained everything clearly and showed me the parts that needed replacement.', 
    avatar: 'https://randomuser.me/api/portraits/men/45.jpg', 
    verified: false,
    workOrder: 'WO-2024-0798',
    service: 'Transmission Service',
    vehicleModel: '2016 Nissan Sunny',
    cost: 'LKR 12,000',
    location: 'Galle Branch',
    completionTime: '4 hours',
    responseFromShop: 'Thank you for choosing us, Saman. Customer education is important to us!',
    helpful: 15,
    photos: ['transmission_service.jpg']
  },
  { 
    name: 'Dilani Fernando', 
    rating: 3, 
    date: '2024-06-15', 
    comment: 'Had to wait longer than expected due to parts delay. Service quality was good once work started, but communication could be improved.', 
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg', 
    verified: true,
    workOrder: 'WO-2024-0756',
    service: 'Air Conditioning Repair',
    vehicleModel: '2019 Suzuki Alto',
    cost: 'LKR 8,500',
    location: 'Colombo Main Branch',
    completionTime: '6 hours',
    responseFromShop: 'We apologize for the delay, Dilani. We\'ve improved our parts inventory system since then.',
    helpful: 6,
    photos: []
  },
  { 
    name: 'Ruwan Jayasuriya', 
    rating: 5, 
    date: '2024-06-10', 
    comment: 'Highly recommend for any repairs. They fixed my car\'s electrical issues that three other shops couldn\'t solve. True professionals!', 
    avatar: 'https://randomuser.me/api/portraits/men/41.jpg', 
    verified: true,
    workOrder: 'WO-2024-0723',
    service: 'Electrical System Repair',
    vehicleModel: '2017 Mitsubishi Lancer',
    cost: 'LKR 15,500',
    location: 'Colombo Main Branch',
    completionTime: '5 hours',
    responseFromShop: 'Thank you Ruwan! Complex electrical issues are our specialty.',
    helpful: 23,
    photos: ['electrical_repair.jpg']
  },
];

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function getServiceTypeIcon(service: string) {
  if (service.includes('Engine')) return '🔧';
  if (service.includes('Brake')) return '🛑';
  if (service.includes('Transmission')) return '⚙️';
  if (service.includes('Air Conditioning')) return '❄️';
  if (service.includes('Electrical')) return '⚡';
  return '🔧';
}

const GOOGLE_MAPS_API_KEY = 'AIzaSyCFbprhDc_fKXUHl-oYEVGXKD1HciiAsz0';

const AutoRepairReviews: React.FC = () => {
  React.useEffect(() => {
    if (window.google && window.google.maps) {
      const map = new window.google.maps.Map(document.getElementById('return-rate-map') as HTMLElement, {
        center: { lat: 7.2, lng: 80.6 },
        zoom: 7,
      });
      // Draw a small circle for each location
      locations.forEach(loc => {
        new window.google.maps.Circle({
          strokeColor: '#38bdf8',
          strokeOpacity: 0.7,
          strokeWeight: 2,
          fillColor: '#38bdf8',
          fillOpacity: 0.18,
          map,
          center: { lat: loc.lat, lng: loc.lng },
          radius: 20000, // 20km
        });
      });
      // Optionally, fit bounds to all circles
      if (locations.length > 0) {
        const bounds = new window.google.maps.LatLngBounds();
        locations.forEach(loc => bounds.extend({ lat: loc.lat, lng: loc.lng }));
        map.fitBounds(bounds);
      }
    }
  }, []);

  return (
    <div className="canned-services-page auto-repair-reviews-page">
      <div className="metric-cards-row">
        <MetricCard
          title="Average Rating"
          amount={summary.averageRating.toFixed(1)}
          change="★"
          changeType="positive"
          period="out of 5"
        />
        <MetricCard
          title="Return Rate"
          amount={summary.returnRate.toFixed(1) + '%'}
          change="Repeat customers"
          changeType="positive"
          period="last 12 months"
        />
        <MetricCard
          title="Review Count"
          amount={summary.reviewCount.toString()}
          change="Total reviews"
          changeType="positive"
          period="all time"
        />
      </div>

      <div className="charts-row">
        <div className="chart-card">
          <h4>Score History</h4>
          <Line
            data={{
              labels: scoreHistory.map(s => s.date),
              datasets: [
                {
                  label: 'Average Rating',
                  data: scoreHistory.map(s => s.score),
                  fill: true,
                  backgroundColor: 'rgba(56,189,248,0.12)',
                  borderColor: '#38bdf8',
                  tension: 0.3,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: { legend: { display: false } },
              scales: { y: { min: 0, max: 5, ticks: { stepSize: 1 } } },
            }}
            height={220}
          />
        </div>
        <div className="chart-card">
          <h4>Rating Aspects</h4>
          <Radar
            data={{
              labels: Object.keys(aspectRatings),
              datasets: [
                {
                  label: 'Aspect Rating',
                  data: Object.values(aspectRatings),
                  backgroundColor: 'rgba(129,140,248,0.15)',
                  borderColor: '#818cf8',
                  pointBackgroundColor: '#818cf8',
                },
              ],
            }}
            options={{
              responsive: true,
              scales: { r: { min: 0, max: 5, ticks: { stepSize: 1 } } },
              plugins: { legend: { display: false } },
            }}
            height={220}
          />
        </div>
      </div>

      <div className="services-table-container return-rate-map-section">
        <div className="table-header">
          <h3>Return Rate by Location</h3>
        </div>
        <div id="return-rate-map" style={{ width: '100%', height: 320, borderRadius: 12, overflow: 'hidden' }}></div>
      </div>

      <div className="services-table-container reviews-list-section">
        <div className="table-header">
          <h3>Customer Reviews</h3>
        </div>
        <div className="reviews-list">
          {reviews.map((review, idx) => (
            <div className="review-card" key={idx}>
              <div className="review-header">
                <div className="customer-info">
                  <img className="review-avatar" src={review.avatar} alt={review.name} />
                  <div className="reviewer-details">
                    <div className="reviewer-name-row">
                      <span className="reviewer-name">{review.name}</span>
                      {review.verified && <span className="verified-badge">✓ Verified</span>}
                    </div>
                    <div className="review-meta">
                      <span className="review-date">{formatDate(review.date)}</span>
                      <span className="location-badge">{review.location}</span>
                    </div>
                  </div>
                </div>
                <div className="rating-section">
                  <div className="star-rating">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className={i < review.rating ? 'star filled' : 'star'}>★</span>
                    ))}
                  </div>
                  <span className="rating-number">{review.rating}.0</span>
                </div>
              </div>

              <div className="work-order-info">
                <div className="work-order-header">
                  <span className="service-icon">{getServiceTypeIcon(review.service)}</span>
                  <div className="service-details">
                    <span className="service-name">{review.service}</span>
                    <span className="work-order-id">Work Order: {review.workOrder}</span>
                  </div>
                </div>
                <div className="work-order-specs">
                  <div className="spec-item">
                    <span className="spec-label">Vehicle:</span>
                    <span className="spec-value">{review.vehicleModel}</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">Cost:</span>
                    <span className="spec-value">{review.cost}</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">Duration:</span>
                    <span className="spec-value">{review.completionTime}</span>
                  </div>
                </div>
              </div>

              <div className="review-content">
                <p className="review-comment">{review.comment}</p>
                {review.photos.length > 0 && (
                  <div className="review-photos">
                    <span className="photos-label">📸 {review.photos.length} photo{review.photos.length > 1 ? 's' : ''} attached</span>
                  </div>
                )}
              </div>

              {review.responseFromShop && (
                <div className="shop-response">
                  <div className="response-header">
                    <span className="response-icon">💬</span>
                    <span className="response-label">Response from Shop</span>
                  </div>
                  <p className="response-text">{review.responseFromShop}</p>
                </div>
              )}

              <div className="review-actions">
                <button className="helpful-button">
                  <span className="thumb-icon">👍</span>
                  Helpful ({review.helpful})
                </button>
                <button className="share-button">
                  <span className="share-icon">📤</span>
                  Share
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AutoRepairReviews;