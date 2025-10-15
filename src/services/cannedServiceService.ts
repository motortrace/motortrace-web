// src/services/cannedServiceService.ts
import type { PackageFilters } from '../types/ServicesAndPackages'

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000/api';

class CannedServiceService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${API_BASE_URL}/canned-services`;
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

  async getPackages(filters?: PackageFilters): Promise<any[]> {
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
      console.error('Error fetching packages:', error);
      throw error;
    }
  }

  async getPackageById(id: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        headers: this.getAuthHeaders(),
      });

      const result = await this.handleResponse(response);
      return result.data;
    } catch (error) {
      console.error('Error fetching package:', error);
      throw error;
    }
  }

  async createPackage(data: any): Promise<any> {
    // try {
    //   const response = await fetch(this.baseUrl, {
    //     method: 'POST',
    //     headers: this.getAuthHeaders(),
    //     body: JSON.stringify(data),
    //   });

    //   const result = await this.handleResponse(response);
    //   return result.data;
    // } catch (error) {
    //   console.error('Error creating package:', error);
    //   throw error;
    // }

    try {
      // Transform package data to canned service with labor operations
      const cannedServiceData = {
        code: data.code,
        name: data.name,
        description: data.description,
        duration: data.duration,
        price: data.price,
        isAvailable: data.isAvailable !== undefined ? data.isAvailable : true,
        variantLabel: data.variantLabel,
        vehicleType: data.vehicleType,
        hasOptionalParts: data.hasOptionalParts,
        hasOptionalLabor: data.hasOptionalLabor,
        category: data.category,
        minVehicleAge: data.minVehicleAge,
        maxVehicleMileage: data.maxVehicleMileage,
        isArchived: data.isArchived,
        laborOperations: data.laborOperations || []
      };

      console.log('Sending canned service data:', cannedServiceData);

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(cannedServiceData),
      });

      const result = await this.handleResponse(response);
      return result.data;
    } catch (error) {
      console.error('Error creating package:', error);
      throw error;
    }

  }

  async updatePackage(id: string, data: any): Promise<any> {
    try {
      // Transform package data to canned service with labor operations
      const cannedServiceData = {
        code: data.code,
        name: data.name,
        description: data.description,
        duration: data.duration,
        price: data.price,
        isAvailable: data.isAvailable !== undefined ? data.isAvailable : true,
        laborOperations: data.serviceIds.map((serviceId: string, index: number) => ({
          laborCatalogId: serviceId,
          sequence: index + 1
        }))
      };

      console.log('Sending UPDATE data to backend:', {
        url: `${this.baseUrl}/${id}`,
        method: 'PUT',
        data: cannedServiceData,
        stringified: JSON.stringify(cannedServiceData)
      });

      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(cannedServiceData),
      });

      console.log('Update response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Update error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, details: ${errorText}`);
      }

      const result = await this.handleResponse(response);
      return result.data;
    } catch (error) {
      console.error('Error updating package:', error);
      throw error;
    }
  }

  async toggleAvailability(id: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}/toggle-availability`, {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
      });

      const result = await this.handleResponse(response);
      return result.data;
    } catch (error) {
      console.error('Error toggling availability:', error);
      throw error;
    }
  }

  async deletePackage(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      await this.handleResponse(response);
    } catch (error) {
      console.error('Error deleting package:', error);
      throw error;
    }
  }
}

export const cannedServiceService = new CannedServiceService();