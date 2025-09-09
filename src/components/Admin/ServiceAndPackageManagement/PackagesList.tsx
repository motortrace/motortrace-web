import React, { useState, useEffect } from 'react';
import { Plus, Layers, Search } from 'lucide-react';
import type { Package, Service } from '../../../types/ServicesAndPackages';
import { PackageCard } from './PackageCard';

interface PackagesListProps {
  packages: Package[];
  services: Service[];
  onAddNew: () => void;
  onView: (pkg: Package) => void;
  onEdit: (pkg: Package) => void;
  onDelete: (id: string) => void;
}

const EmptyState: React.FC<{ onAddNew: () => void }> = ({ onAddNew }) => (
  <div className="spm-empty-state">
    <div className="spm-empty-state__icon">
      <Layers size={48} />
    </div>
    <h3 className="spm-empty-state__title">No Packages Created Yet</h3>
    <p className="spm-empty-state__description">
      Bundle your services into a package to offer more value. 
      Combine multiple services, set a special price, and make it easier for customers to book everything they need in one go.
    </p>
    <button className="spm-btn spm-btn--primary" onClick={onAddNew}>
      <Plus size={16} /> Add Your First Package
    </button>
  </div>
);

export const PackagesList: React.FC<PackagesListProps> = ({
  packages,
  services,
  onAddNew,
  onView,
  onEdit,
  onDelete
}) => {
  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [serviceCountFilter, setServiceCountFilter] = useState('All');
  const [sortBy, setSortBy] = useState('');

  // Pagination state
  const itemsPerPage = 6; // Adjust based on your grid layout
  const [displayCount, setDisplayCount] = useState(itemsPerPage);

  // Reset display count when filters change
  useEffect(() => {
    setDisplayCount(itemsPerPage);
  }, [searchTerm, serviceCountFilter]);

  // Helper function to get service count for a package
  const getServiceCount = (pkg: Package): number => {
    return pkg.serviceIds.length;
  };

  // Helper function to get included service names for search
  const getIncludedServiceNames = (pkg: Package): string => {
    return pkg.serviceIds
      .map(serviceId => {
        const service = services.find(s => s.id === serviceId);
        return service ? service.name : '';
      })
      .filter(Boolean)
      .join(' ');
  };

  // Filter and search logic
  const filteredPackages = packages.filter(pkg => {
    const matchesSearch = pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pkg.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         getIncludedServiceNames(pkg).toLowerCase().includes(searchTerm.toLowerCase());
    
    const serviceCount = getServiceCount(pkg);
    const matchesServiceCount = serviceCountFilter === 'All' || 
                               (serviceCountFilter === '1' && serviceCount === 1) ||
                               (serviceCountFilter === '2-3' && serviceCount >= 2 && serviceCount <= 3) ||
                               (serviceCountFilter === '4+' && serviceCount >= 4);
    
    return matchesSearch && matchesServiceCount;
  });

  // Sort logic
  const sortedPackages = [...filteredPackages].sort((a, b) => {
    switch (sortBy) {
      case 'Name (A-Z)':
        return a.name.localeCompare(b.name);
      case 'Name (Z-A)':
        return b.name.localeCompare(a.name);
      case 'Price (Low to High)':
        return a.price - b.price;
      case 'Price (High to Low)':
        return b.price - a.price;
      case 'Service Count (Low to High)':
        return getServiceCount(a) - getServiceCount(b);
      case 'Service Count (High to Low)':
        return getServiceCount(b) - getServiceCount(a);
      default:
        return 0;
    }
  });

  const displayedPackages = sortedPackages.slice(0, displayCount);
  const hasMore = displayCount < sortedPackages.length;
  
  const handleLoadMore = () => {
    setDisplayCount(prev => Math.min(prev + itemsPerPage, sortedPackages.length));
  };

  // Show empty state when no packages exist at all
  if (packages.length === 0) {
    return <EmptyState onAddNew={onAddNew} />;
  }

  return (
    <div className="spm-packages-container">
      {/* Search Bar and Filters */}
      <div className="search-bar" style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <div className="search-content" style={{ flex: 1 }}>
          <div className="search-input-container">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search packages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filters">
            {/* Service Count Filter */}
            <select
              value={serviceCountFilter}
              onChange={(e) => setServiceCountFilter(e.target.value)}
            >
              <option value="All">All Packages</option>
              <option value="1">Single Service (1)</option>
              <option value="2-3">Small Bundle (2-3)</option>
              <option value="4+">Large Bundle (4+)</option>
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
              <option value="Service Count (Low to High)">Service Count (Low to High)</option>
              <option value="Service Count (High to Low)">Service Count (High to Low)</option>
            </select>
          </div>
        </div>

        {/* Add New Package Button */}
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
          Add New Package
        </button>
      </div>

      {/* Packages Grid */}
      {displayedPackages.length > 0 ? (
        <>
          <div className="spm-services-grid">
            {displayedPackages.map(pkg => (
              <PackageCard
                key={pkg.id}
                package={pkg}
                services={services}
                onView={onView}
                onEdit={onEdit}
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
                Load More ({sortedPackages.length - displayCount} remaining)
              </button>
            </div>
          )}
        </>
      ) : (
        /* No Results State */
        <div className="user-management__no-data" style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div className="no-data-icon" style={{ marginBottom: 16, color: '#64748b' }}>
            <Layers size={40} strokeWidth={1.5} />
          </div>
          <div className="no-data-title" style={{ fontSize: '18px', fontWeight: 600, marginBottom: 8, color: '#1e293b' }}>
            No Packages Found
          </div>
          <div className="no-data-description" style={{ fontSize: '14px', color: '#64748b', marginBottom: 20, maxWidth: 400, margin: '0 auto 20px' }}>
            No packages match your current search and filter criteria. Try adjusting your filters or search term.
          </div>
          <button 
            className="no-data-action"
            onClick={() => {
              setSearchTerm('');
              setServiceCountFilter('All');
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