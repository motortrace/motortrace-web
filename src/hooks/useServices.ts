import { useState, useEffect, useCallback } from 'react';
import { cannedServiceService } from '../services/cannedServiceService';
import type { Service } from '../types/Service';

export const useServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const data = await cannedServiceService.getPackages();
      setServices(data);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to fetch services');
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleAvailability = useCallback(async (serviceId: string) => {
    // Optimistic update - update UI immediately
    setServices(prev => prev.map(service =>
      service.id === serviceId
        ? { ...service, isAvailable: !service.isAvailable }
        : service
    ));
    
    try {
      await cannedServiceService.toggleAvailability(serviceId);
      // No need to refetch, we already updated the UI optimistically
    } catch (err: any) {
      // Revert optimistic update on error
      setServices(prev => prev.map(service =>
        service.id === serviceId
          ? { ...service, isAvailable: !service.isAvailable }
          : service
      ));
      setError(err.message || 'Failed to toggle service availability');
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  return {
    services,
    loading,
    error,
    toggleAvailability,
    refetch: fetchServices,
  };
};