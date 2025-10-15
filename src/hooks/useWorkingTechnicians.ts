// src/hooks/useWorkingTechnicians.ts
import { useState, useEffect } from 'react';
import { technicianService } from '../services/technicianService';

export interface WorkingTechnician {
  technicianName: string;
  technicianImage: string;
  workOrderNumber: string;
  taskType: string;
  taskDescription: string;
  timeWorkedMinutes: number;
  expectedMinutes: number | null;
}

export const useWorkingTechnicians = () => {
  const [technicians, setTechnicians] = useState<WorkingTechnician[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchWorkingTechnicians = async () => {
    setLoading(true);
    try {
      const data = await technicianService.getWorkingTechnicians();
      if (data.success) {
        setTechnicians(data.data);
        setError('');
      } else {
        throw new Error(data.message || 'Failed to fetch working technicians');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch working technicians');
      setTechnicians([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkingTechnicians();
  }, []);

  return {
    technicians,
    loading,
    error,
    refetch: fetchWorkingTechnicians,
  };
};