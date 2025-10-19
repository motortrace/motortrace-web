import { useState, useEffect } from 'react';
import { cannedServiceService } from '../services/cannedServiceService';
import type { Service } from '../types/Service';

export const useServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchServices = async () => {
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
  };

  const toggleAvailability = async (serviceId: string) => {
    try {
      await cannedServiceService.toggleAvailability(serviceId);
      await fetchServices(); // Refresh data
    } catch (err: any) {
      setError(err.message || 'Failed to toggle service availability');
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return {
    services,
    loading,
    error,
    toggleAvailability,
    refetch: fetchServices,
  };
};