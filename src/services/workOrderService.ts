// src/services/workOrderService.ts
import type { WorkOrder, CreateWorkOrderRequest, UpdateWorkOrderRequest, WorkOrderFilters } from '../types/WorkOrderTypes/WorkOrder';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

class WorkOrderService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${API_BASE_URL}/work-orders`;
  }

  // Get authorization headers
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token'); // Adjust based on your auth storage
    return {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    };
  }

  // Get all work orders with optional filters
  async getWorkOrders(filters?: WorkOrderFilters): Promise<WorkOrder[]> {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            queryParams.append(key, value.toString());
          }
        });
      }

      const url = queryParams.toString() 
        ? `${this.baseUrl}?${queryParams.toString()}`
        : this.baseUrl;

      const response = await fetch(url, {
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch work orders: ${response.statusText}`);
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching work orders:', error);
      throw error;
    }
  }

  // Get work order by ID
  async getWorkOrderById(id: string): Promise<WorkOrder> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch work order: ${response.statusText}`);
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching work order:', error);
      throw error;
    }
  }

  // Create a new work order
  async createWorkOrder(workOrderData: CreateWorkOrderRequest): Promise<WorkOrder> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(workOrderData),
      });

      if (!response.ok) {
        throw new Error(`Failed to create work order: ${response.statusText}`);
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error creating work order:', error);
      throw error;
    }
  }

  // Update work order
  async updateWorkOrder(id: string, updateData: UpdateWorkOrderRequest): Promise<WorkOrder> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error(`Failed to update work order: ${response.statusText}`);
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error updating work order:', error);
      throw error;
    }
  }

  // Delete work order
  async deleteWorkOrder(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to delete work order: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error deleting work order:', error);
      throw error;
    }
  }

  // Update work order status
  async updateWorkOrderStatus(id: string, status: string, workflowStep?: string): Promise<WorkOrder> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}/status`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ status, workflowStep }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update work order status: ${response.statusText}`);
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error updating work order status:', error);
      throw error;
    }
  }

  // Assign work order
  async assignWorkOrder(id: string, advisorId?: string, technicianId?: string): Promise<WorkOrder> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}/assign`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ advisorId, technicianId }),
      });

      if (!response.ok) {
        throw new Error(`Failed to assign work order: ${response.statusText}`);
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error assigning work order:', error);
      throw error;
    }
  }

  // Search work orders
  async searchWorkOrders(query: string, filters?: WorkOrderFilters): Promise<WorkOrder[]> {
    try {
      const response = await fetch(`${this.baseUrl}/search`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ query, filters }),
      });

      if (!response.ok) {
        throw new Error(`Failed to search work orders: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Search API response:', result);

      return result.data;
    } catch (error) {
      console.error('Error searching work orders:', error);
      throw error;
    }
  }

  // Generate estimate from labor and parts
  async generateEstimateFromLaborAndParts(workOrderId: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/${workOrderId}/generate-estimate`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to generate estimate: ${response.statusText}`);
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error generating estimate:', error);
      throw error;
    }
  }
}

// Create a singleton instance
export const workOrderService = new WorkOrderService();