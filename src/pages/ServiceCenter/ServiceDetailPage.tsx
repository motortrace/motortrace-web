import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ServiceDetailPage.scss';
import { cannedServiceService } from '../../services/cannedServiceService';

interface LaborOperation {
  id: string;
  sequence: number;
  notes: string;
  labor: {
    id: string;
    code: string;
    name: string;
    description: string;
    estimatedMinutes: number;
    category: string;
    isActive: boolean;
  };
}

interface Service {
  id: string;
  code: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  isAvailable: boolean;
  variantLabel: string;
  vehicleType: string;
  hasOptionalParts: boolean;
  hasOptionalLabor: boolean;
  category: string;
  minVehicleAge: number | null;
  maxVehicleMileage: number | null;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  laborOperations: LaborOperation[];
  partsCategories: any[];
}

const ServiceDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;

    console.log('ServiceDetailPage loading service:', id);
    setLoading(true);
    cannedServiceService.getPackageDetails(id)
      .then(data => {
        console.log('ServiceDetailPage loaded data:', data);
        setService(data);
        setLoading(false);
      })
      .catch((err: any) => {
        console.error('Error fetching service details:', err);
        setError(err.message || 'Failed to fetch service details');
        setLoading(false);
      });
  }, [id]);

  const formatCurrency = (amount: number) => {
    return `LKR ${Number(amount).toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (isAvailable: boolean, isArchived: boolean) => {
    if (isArchived) {
      return (
        <span className="status-badge status-archived">
          Archived
        </span>
      );
    }
    return (
      <span className={`status-badge ${isAvailable ? 'status-available' : 'status-unavailable'}`}>
        {isAvailable ? 'Available' : 'Unavailable'}
      </span>
    );
  };

  const handleBack = () => {
    const basePath = window.location.pathname.split('/')[1];
    navigate(`/${basePath}/services`);
  };

  const handleToggleAvailability = async () => {
    if (!service) return;

    try {
      await cannedServiceService.toggleAvailability(service.id);
      // Refresh the service data
      const data = await cannedServiceService.getPackageDetails(service.id);
      setService(data);
    } catch (err: any) {
      setError(err.message || 'Failed to toggle service availability');
    }
  };

  const handleAddLabor = () => {
    // TODO: Implement add labor functionality
    console.log('Add labor operation');
  };

  const handleRemoveLabor = (laborId: string) => {
    // TODO: Implement remove labor functionality
    console.log('Remove labor operation:', laborId);
  };

  if (loading) {
    return (
      <div className="service-detail-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading service details...</p>
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="service-detail-page">
        <div className="error-container">
          <h2>Error</h2>
          <p>{error || 'Service not found'}</p>
          <button className="btn btn--primary" onClick={handleBack}>
            Back to Services
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="service-detail-page">
      {/* Header Actions */}
      <div className="service-header-actions">
        <button className="btn btn--ghost" onClick={handleBack}>
          <i className='bx bx-arrow-back'></i>
          Back to Services
        </button>
        <div className="action-buttons">
          <button className="btn btn--ghost" onClick={handleToggleAvailability}>
            <i className={`bx ${service.isAvailable ? 'bx-pause' : 'bx-play'}`}></i>
            {service.isAvailable ? 'Disable' : 'Enable'}
          </button>
        </div>
      </div>

      {/* Service Document */}
      <div className="service-document">
        {/* Service Header */}
        <div className="service-header">
          <div className="service-basic-info">
            <h1>{service.name}</h1>
            <p className="service-code">Code: {service.code}</p>
            <div className="service-status">
              {getStatusBadge(service.isAvailable, service.isArchived)}
            </div>
          </div>
          <div className="service-price-info">
            <div className="price-display">
              <span className="price-label">Price</span>
              <span className="price-value">{formatCurrency(service.price)}</span>
            </div>
            <div className="duration-display">
              <span className="duration-label">Duration</span>
              <span className="duration-value">{service.duration} minutes</span>
            </div>
          </div>
        </div>

        {/* Service Description */}
        <div className="service-description-section">
          <h3>Description</h3>
          <div className="description-content">
            <p>{service.description}</p>
          </div>
        </div>

        {/* Service Details */}
        <div className="service-details-section">
          <h3>Service Details</h3>
          <div className="details-grid">
            <div className="detail-item">
              <span className="detail-label">Category</span>
              <span className="detail-value category-badge" style={{
                backgroundColor: `hsl(${(service.category || '').split('').reduce((a, b) => a + b.charCodeAt(0), 0) % 360}, 70%, 90%)`,
                color: `hsl(${(service.category || '').split('').reduce((a, b) => a + b.charCodeAt(0), 0) % 360}, 70%, 30%)`
              }}>
                {service.category || 'N/A'}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Vehicle Type</span>
              <span className="detail-value">{service.vehicleType || 'All'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Variant</span>
              <span className="detail-value">{service.variantLabel || 'Standard'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Optional Labor</span>
              <span className="detail-value">
                <i className={`bx ${service.hasOptionalLabor ? 'bx-check-circle' : 'bx-x-circle'}`}></i>
                {service.hasOptionalLabor ? 'Yes' : 'No'}
              </span>
            </div>
            {service.minVehicleAge && (
              <div className="detail-item">
                <span className="detail-label">Min Vehicle Age</span>
                <span className="detail-value">{service.minVehicleAge} years</span>
              </div>
            )}
            {service.maxVehicleMileage && (
              <div className="detail-item">
                <span className="detail-label">Max Mileage</span>
                <span className="detail-value">{service.maxVehicleMileage.toLocaleString()} km</span>
              </div>
            )}
          </div>
        </div>

        {/* Labor Operations */}
        <div className="labor-operations-section">
          <div className="section-header">
            <h3>Labor Operations</h3>
            <button className="btn btn--primary btn--small" onClick={handleAddLabor}>
              <i className='bx bx-plus'></i>
              Add Labor
            </button>
          </div>
          {service.laborOperations && service.laborOperations.length > 0 ? (
            <div className="labor-table-container">
              <table className="labor-table">
                <thead>
                  <tr>
                    <th>Sequence</th>
                    <th>Code</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Duration</th>
                    <th>Category</th>
                    <th>Notes</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {service.laborOperations.map((operation) => (
                    <tr key={operation.id}>
                      <td>{operation.sequence}</td>
                      <td>{operation.labor.code}</td>
                      <td>{operation.labor.name}</td>
                      <td>{operation.labor.description}</td>
                      <td>{operation.labor.estimatedMinutes} min</td>
                      <td>{operation.labor.category}</td>
                      <td>{operation.notes || '-'}</td>
                      <td>
                        <button
                          className="btn-icon btn--remove"
                          title="Remove"
                          onClick={() => handleRemoveLabor(operation.id)}
                        >
                          <i className='bx bx-trash'></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="no-labor-message">
              <p>No labor operations found for this service.</p>
            </div>
          )}
        </div>

        {/* Timestamps */}
        <div className="timestamps-section">
          <div className="timestamp-item">
            <span className="timestamp-label">Created</span>
            <span className="timestamp-value">{formatDate(service.createdAt)}</span>
          </div>
          <div className="timestamp-item">
            <span className="timestamp-label">Last Updated</span>
            <span className="timestamp-value">{formatDate(service.updatedAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailPage;
