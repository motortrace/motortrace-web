import React, { useState, useEffect } from 'react';
import { Plus, Wrench, Search } from 'lucide-react';
import type { Service } from '../../../types/ServicesAndPackages';
import { ServiceCard } from './ServiceCard';

interface ServicesListProps {
  services: Service[];
  onAddNew: () => void;
  onView: (service: Service) => void;
  onEdit: (service: Service) => void;
  onToggleAvailability: (id: string) => void;
  onDelete: (id: string) => void;
}

const EmptyState: React.FC<{ onAddNew: () => void }> = ({ onAddNew }) => (
  <div className="spm-empty-state">
    <div className="spm-empty-state__icon">
      <Wrench size={48} />
    </div>
    <h3 className="spm-empty-state__title">No Services Created Yet</h3>
    <p className="spm-empty-state__description">
      Get started by creating your first service. You can add descriptions, set prices, manage availability, and keep everything organized for customers to book with ease.
    </p>
    <button className="spm-btn spm-btn--primary" onClick={onAddNew}>
      <Plus size={16} /> Add Your First Service
    </button>
  </div>
);

export const ServicesList: React.FC<ServicesListProps> = ({
  services,
  onAddNew,
  onView,
  onEdit,
  onToggleAvailability,
  onDelete
}) => {
  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [sortBy, setSortBy] = useState('');

  // Pagination state
  const itemsPerPage = 6; // Adjust based on your grid layout
  const [displayCount, setDisplayCount] = useState(itemsPerPage);

  // Reset display count when filters change
  useEffect(() => {
    setDisplayCount(itemsPerPage);
  }, [searchTerm, statusFilter]);

  // Filter and search logic
  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.shortDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.detailedDescription.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All Statuses' || 
                         (statusFilter === 'Available' && service.isAvailable) ||
                         (statusFilter === 'Unavailable' && !service.isAvailable);
    
    return matchesSearch && matchesStatus;
  });

  // Helper function to parse duration string to minutes for comparison
  const parseDurationToMinutes = (duration: string): number => {
    const lower = duration.toLowerCase();
    let totalMinutes = 0;
    
    // Extract hours
    const hoursMatch = lower.match(/(\d+)\s*h/);
    if (hoursMatch) {
      totalMinutes += parseInt(hoursMatch[1]) * 60;
    }
    
    // Extract minutes
    const minutesMatch = lower.match(/(\d+)\s*m/);
    if (minutesMatch) {
      totalMinutes += parseInt(minutesMatch[1]);
    }
    
    // If no matches found, try to extract just numbers (assume minutes)
    if (totalMinutes === 0) {
      const numberMatch = duration.match(/(\d+)/);
      if (numberMatch) {
        totalMinutes = parseInt(numberMatch[1]);
      }
    }
    
    return totalMinutes;
  };

  // Sort logic
  const sortedServices = [...filteredServices].sort((a, b) => {
    switch (sortBy) {
      case 'Name (A-Z)':
        return a.name.localeCompare(b.name);
      case 'Name (Z-A)':
        return b.name.localeCompare(a.name);
      case 'Price (Low to High)':
        return a.price - b.price;
      case 'Price (High to Low)':
        return b.price - a.price;
      case 'Duration (Short to Long)':
        return parseDurationToMinutes(a.duration) - parseDurationToMinutes(b.duration);
      case 'Duration (Long to Short)':
        return parseDurationToMinutes(b.duration) - parseDurationToMinutes(a.duration);
      default:
        return 0;
    }
  });

  const displayedServices = sortedServices.slice(0, displayCount);
  const hasMore = displayCount < sortedServices.length;
  
  const handleLoadMore = () => {
    setDisplayCount(prev => Math.min(prev + itemsPerPage, sortedServices.length));
  };

  // Show empty state when no services exist at all
  if (services.length === 0) {
    return <EmptyState onAddNew={onAddNew} />;
  }

  return (
    <div className="spm-services-container">
      {/* Search Bar and Filters */}
      <div className="search-bar" style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <div className="search-content" style={{ flex: 1 }}>
          <div className="search-input-container">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filters">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All Statuses">All Statuses</option>
              <option value="Available">Available</option>
              <option value="Unavailable">Unavailable</option>
            </select>

            {/* Sort Filter */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="">Sort By...</option>
              <option value="Name (A-Z)">Name (A-Z)</option>
              <option value="Name (Z-A)">Name (Z-A)</option>
              <option value="Price (Low to High)">Price (Low to High)</option>
              <option value="Price (High to Low)">Price (High to Low)</option>
              <option value="Duration (Short to Long)">Duration (Short to Long)</option>
              <option value="Duration (Long to Short)">Duration (Long to Short)</option>
            </select>
          </div>
        </div>

        {/* Add New Service Button */}
        <button
          className="user-management__add-btn"
          onClick={onAddNew}
          style={{
            background: '#0ea5e9',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontFamily: 'Poppins',
            fontWeight: 500,
            fontSize: '15px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginTop: '0px',
            padding: '7.5px 22.5px',
            boxSizing: 'border-box',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center' }}>
            <Plus size={18} strokeWidth={2} />
          </span>
          Add New Service
        </button>
      </div>

      {/* Services Grid */}
      {displayedServices.length > 0 ? (
        <>
          <div className="spm-services-grid">
            {displayedServices.map(service => (
              <ServiceCard
                key={service.id}
                service={service}
                onView={onView}
                onEdit={onEdit}
                onToggleAvailability={onToggleAvailability}
                onDelete={onDelete}
              />
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="user-management__load-more" style={{ textAlign: 'center', marginTop: 24 }}>
              <button
                className="user-management__load-more-btn"
                onClick={handleLoadMore}
                style={{
                  background: 'transparent',
                  border: '2px solid #0ea5e9',
                  color: '#0ea5e9',
                  borderRadius: '8px',
                  fontFamily: 'Poppins',
                  fontWeight: 500,
                  fontSize: '14px',
                  cursor: 'pointer',
                  padding: '8px 16px',
                }}
              >
                Load More ({sortedServices.length - displayCount} remaining)
              </button>
            </div>
          )}
        </>
      ) : (
        /* No Results State */
        <div className="user-management__no-data" style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div className="no-data-icon" style={{ marginBottom: 16, color: '#64748b' }}>
            <Wrench size={40} strokeWidth={1.5} />
          </div>
          <div className="no-data-title" style={{ fontSize: '18px', fontWeight: 600, marginBottom: 8, color: '#1e293b' }}>
            No Services Found
          </div>
          <div className="no-data-description" style={{ fontSize: '14px', color: '#64748b', marginBottom: 20, maxWidth: 400, margin: '0 auto 20px' }}>
            No services match your current search and filter criteria. Try adjusting your filters or search term.
          </div>
          <button 
            className="no-data-action"
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('All Statuses');
              setSortBy('');
            }}
            style={{
              background: '#f1f5f9',
              border: '1px solid #e2e8f0',
              color: '#475569',
              borderRadius: '8px',
              fontFamily: 'Poppins',
              fontWeight: 500,
              fontSize: '14px',
              cursor: 'pointer',
              padding: '8px 16px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};