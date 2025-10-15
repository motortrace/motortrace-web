import React from 'react';

interface ServiceFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterCategory: string;
  setFilterCategory: (category: string) => void;
  filterVehicleType: string;
  setFilterVehicleType: (type: string) => void;
  filterStatus: string;
  setFilterStatus: (status: string) => void;
  uniqueCategories: string[];
  uniqueVehicleTypes: string[];
}

const ServiceFilters: React.FC<ServiceFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  filterCategory,
  setFilterCategory,
  filterVehicleType,
  setFilterVehicleType,
  filterStatus,
  setFilterStatus,
  uniqueCategories,
  uniqueVehicleTypes,
}) => {
  return (
    <div className="inventory-controls">
      <div className="search-filters">
        <div className="search-box">
          <i className='bx bx-search search-icon'></i>
          <input
            type="text"
            placeholder="Search by service name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Categories</option>
          {uniqueCategories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        <select
          value={filterVehicleType}
          onChange={(e) => setFilterVehicleType(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Vehicle Types</option>
          {uniqueVehicleTypes.map(vehicleType => (
            <option key={vehicleType} value={vehicleType}>{vehicleType}</option>
          ))}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Statuses</option>
          <option value="available">Available</option>
          <option value="unavailable">Unavailable</option>
        </select>
      </div>
      <div className="quick-actions">
        <button className="btn btn--ghost">
          <i className='bx bx-filter'></i>
          Advanced Filters
        </button>
        <button className="btn btn--ghost" onClick={() => window.location.reload()}>
          <i className='bx bx-refresh'></i>
          Refresh
        </button>
      </div>
    </div>
  );
};

export default ServiceFilters;