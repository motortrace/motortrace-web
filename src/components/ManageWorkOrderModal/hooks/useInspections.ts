import { useState, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import type { WorkOrderInspection, WorkOrderInspectionAttachment } from '../types';

interface UseInspectionsProps {
  workOrderId: number;
}

export const useInspections = ({ workOrderId }: UseInspectionsProps) => {
  const { token } = useAuth();
  
  const [inspections, setInspections] = useState<WorkOrderInspection[]>([]);
  const [attachments, setAttachments] = useState<{ [key: number]: WorkOrderInspectionAttachment[] }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'pending'>('all');

  /**
   * Fetch inspections for the work order
   */
  const fetchInspections = async () => {
    if (!token || !workOrderId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `http://localhost:3000/inspection-templates/work-orders/${workOrderId}/inspections`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch inspections');
      }

      const data = await response.json();
      
      // Handle both array and object responses
      const inspectionsArray = Array.isArray(data) ? data : (data.inspections || []);
      setInspections(inspectionsArray);

      // Fetch attachments for each inspection
      inspectionsArray.forEach((inspection: WorkOrderInspection) => {
        fetchAttachments(Number(inspection.id));
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching inspections:', err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Fetch attachments for a specific inspection
   */
  const fetchAttachments = async (inspectionId: number) => {
    if (!token) return;

    try {
      const response = await fetch(
        `http://localhost:3000/inspection-templates/inspections/${inspectionId}/attachments`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setAttachments((prev) => ({
          ...prev,
          [inspectionId]: data,
        }));
      }
    } catch (err) {
      console.error(`Error fetching attachments for inspection ${inspectionId}:`, err);
    }
  };

  /**
   * Refetch inspections (useful after updates)
   */
  const refetchInspections = () => {
    fetchInspections();
  };

  /**
   * Get filtered inspections based on search and status filter
   */
  const getFilteredInspections = () => {
    // Safety check: ensure inspections is an array
    if (!Array.isArray(inspections)) return [];
    
    let filtered = inspections;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (inspection) =>
          inspection.template?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          inspection.notes?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          inspection.inspector?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((inspection) => {
        const isCompleted = inspection.isCompleted;
        return statusFilter === 'completed' ? isCompleted : !isCompleted;
      });
    }

    return filtered;
  };

  /**
   * Get inspection summary counts
   */
  const getInspectionSummary = () => {
    // Safety check: ensure inspections is an array
    if (!Array.isArray(inspections)) {
      return { total: 0, completed: 0, pending: 0 };
    }
    
    const total = inspections.length;
    const completed = inspections.filter((i) => i.isCompleted).length;
    const pending = total - completed;

    return { total, completed, pending };
  };

  // Fetch inspections on mount and when workOrderId changes
  useEffect(() => {
    fetchInspections();
  }, [workOrderId, token]);

  return {
    inspections,
    filteredInspections: getFilteredInspections(),
    attachments,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    summary: getInspectionSummary(),
    refetchInspections,
    fetchAttachments,
  };
};
