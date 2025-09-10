// src/services/laborService.ts
import type { ServiceFilters } from '../types/ServicesAndPackages'

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000/api';

class LaborService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${API_BASE_URL}/labor/catalog`;
  }

  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('supabaseToken') || localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    };
  }

  private async handleResponse(response: Response): Promise<any> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  async getServices(filters?: ServiceFilters): Promise<any[]> {
    try {
      const queryParams = new URLSearchParams();

      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            queryParams.append(key, value.toString());
          }
        });
      }

      const url = queryParams.toString() ? `${this.baseUrl}?${queryParams}` : this.baseUrl;

      const response = await fetch(url, {
        headers: this.getAuthHeaders(),
      });

      const result = await this.handleResponse(response);
      return result.data;
    } catch (error) {
      console.error('Error fetching services:', error);
      throw error;
    }
  }

  async getServiceById(id: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        headers: this.getAuthHeaders(),
      });

      const result = await this.handleResponse(response);
      return result.data;
    } catch (error) {
      console.error('Error fetching service:', error);
      throw error;
    }
  }

  async createService(data: any): Promise<any> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      });

      const result = await this.handleResponse(response);
      return result.data;
    } catch (error) {
      console.error('Error creating service:', error);
      throw error;
    }
  }

  async updateService(id: string, data: any): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      });

      const result = await this.handleResponse(response);
      return result.data;
    } catch (error) {
      console.error('Error updating service:', error);
      throw error;
    }
  }

  async toggleServiceAvailability(id: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}/toggle-availability`, {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
      });

      const result = await this.handleResponse(response);
      return result.data;
    } catch (error) {
      console.error('Error toggling service availability:', error);
      throw error;
    }
  }

  async deleteService(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      await this.handleResponse(response);
    } catch (error) {
      console.error('Error deleting service:', error);
      throw error;
    }
  }

  async getCategories(): Promise<string[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/labor/categories`, {
        headers: this.getAuthHeaders(),
      });

      const result = await this.handleResponse(response);
      return result.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }
}

export const laborService = new LaborService();