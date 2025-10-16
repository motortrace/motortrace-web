// src/services/laborCatalogService.ts

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000/api';

class LaborCatalogService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${API_BASE_URL}/labor`;
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

  async getCatalog(): Promise<any[]> {
    try {
      const response = await fetch(`${this.baseUrl}/catalog`, {
        headers: this.getAuthHeaders(),
      });

      const result = await this.handleResponse(response);
      return result.data;
    } catch (error) {
      console.error('Error fetching labor catalog:', error);
      throw error;
    }
  }
}

export const laborCatalogService = new LaborCatalogService();