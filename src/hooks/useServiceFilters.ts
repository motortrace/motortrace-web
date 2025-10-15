import { useState, useMemo } from 'react';
import type { Service } from '../types/Service';

export const useServiceFilters = (services: Service[]) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterVehicleType, setFilterVehicleType] = useState('all');

  // Unique filter values
  const uniqueCategories = useMemo(() =>
    [...new Set(services.map(s => s.category).filter(Boolean))],
    [services]
  );

  const uniqueVehicleTypes = useMemo(() =>
    [...new Set(services.map(s => s.vehicleType).filter(Boolean))],
    [services]
  );

  // Filtering logic
  const filteredServices = useMemo(() => {
    return services.filter(service => {
      const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = filterStatus === 'all' ||
        (filterStatus === 'available' && service.isAvailable) ||
        (filterStatus === 'unavailable' && !service.isAvailable);

      const matchesCategory = filterCategory === 'all' || service.category === filterCategory;
      const matchesVehicleType = filterVehicleType === 'all' || service.vehicleType === filterVehicleType;

      return matchesSearch && matchesStatus && matchesCategory && matchesVehicleType;
    });
  }, [services, searchTerm, filterStatus, filterCategory, filterVehicleType]);

  return {
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    filterCategory,
    setFilterCategory,
    filterVehicleType,
    setFilterVehicleType,
    uniqueCategories,
    uniqueVehicleTypes,
    filteredServices,
  };
};