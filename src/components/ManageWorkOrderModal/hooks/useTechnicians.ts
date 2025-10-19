import { useState, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import type { Technician, TechnicianActiveWork, TechnicianWithStatus } from '../types';

/**
 * Hook to manage technicians and their active work status
 */
export const useTechnicians = () => {
  const { token } = useAuth();
  const [technicians, setTechnicians] = useState<TechnicianWithStatus[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch all available technicians
   */
  const fetchTechnicians = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:3000/technicians', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch technicians');
      }

      const result = await response.json();
      const techniciansData = result.success ? result.data : result;
      const techList = Array.isArray(techniciansData) ? techniciansData : [];

      // Fetch active work for each technician
      const techniciansWithStatus = await Promise.all(
        techList.map(async (tech: Technician) => {
          const activeWork = await fetchTechnicianActiveWork(tech.id);
          return {
            ...tech,
            activeWork,
            isBusy: activeWork.some((work) => work.status === 'IN_PROGRESS'),
          };
        })
      );

      setTechnicians(techniciansWithStatus);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching technicians:', err);
      setTechnicians([]);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Fetch active work for a specific technician
   */
  const fetchTechnicianActiveWork = async (technicianId: string): Promise<TechnicianActiveWork[]> => {
    try {
      const response = await fetch(
        `http://localhost:3000/work-orders/technician/${technicianId}/active-work`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        return [];
      }

      const result = await response.json();
      const workData = result.success ? result.data : result;
      return Array.isArray(workData) ? workData : [];
    } catch (err) {
      console.error('Error fetching technician active work:', err);
      return [];
    }
  };

  /**
   * Assign a technician to all labor items under a service (bulk assignment)
   */
  const assignTechnicianToService = async (serviceId: string, technicianId: string) => {
    try {
      const response = await fetch(
        `http://localhost:3000/work-orders/services/${serviceId}/assign-technician-to-labor`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ technicianId }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to assign technician to service');
      }

      return await response.json();
    } catch (err) {
      throw err instanceof Error ? err : new Error('An error occurred');
    }
  };

  /**
   * Assign a technician to a single labor item
   */
  const assignTechnicianToLabor = async (laborItemId: string, technicianId: string) => {
    try {
      const response = await fetch(
        `http://localhost:3000/work-orders/labor/${laborItemId}/assign-technician`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ technicianId }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to assign technician to labor');
      }

      return await response.json();
    } catch (err) {
      throw err instanceof Error ? err : new Error('An error occurred');
    }
  };

  useEffect(() => {
    if (token) {
      fetchTechnicians();
    }
  }, [token]);

  return {
    technicians,
    isLoading,
    error,
    fetchTechnicians,
    fetchTechnicianActiveWork,
    assignTechnicianToService,
    assignTechnicianToLabor,
  };
};
