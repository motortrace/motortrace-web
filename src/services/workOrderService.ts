// src/services/workOrderService.ts

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

class WorkOrderService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${API_BASE_URL}`;
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

  async getWorkOrderMessages(workOrderId: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/messages/${workOrderId}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      const result = await this.handleResponse(response);
      return result.data; // Assuming the response has { success: true, data: [...] }
    } catch (error) {
      console.error('Error fetching work order messages:', error);
      throw error;
    }
  }

  async sendWorkOrderMessage(messageData: {
    workOrderId: string;
    message: string;
    messageType: string;
    attachments?: any[];
  }): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/messages`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(messageData),
      });

      const result = await this.handleResponse(response);
      return result;
    } catch (error) {
      console.error('Error sending work order message:', error);
      throw error;
    }
  }

  // Misc Charges API methods
  async getMiscCharges(workOrderId: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/work-orders/${workOrderId}/misc-charges`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      const result = await this.handleResponse(response);
      return result.data; // Assuming the response has { success: true, data: [...] }
    } catch (error) {
      console.error('Error fetching misc charges:', error);
      throw error;
    }
  }

  async createMiscCharge(workOrderId: string, miscChargeData: {
    category: string;
    description: string;
    amount: number;
    quantity: number;
    notes?: string;
  }): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/work-orders/${workOrderId}/misc-charges`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(miscChargeData),
      });

      const result = await this.handleResponse(response);
      return result;
    } catch (error) {
      console.error('Error creating misc charge:', error);
      throw error;
    }
  }

  async updateMiscCharge(miscChargeId: string, miscChargeData: {
    category?: string;
    description?: string;
    amount?: number;
    quantity?: number;
    notes?: string;
  }): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/misc-charges/${miscChargeId}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(miscChargeData),
      });

      const result = await this.handleResponse(response);
      return result;
    } catch (error) {
      console.error('Error updating misc charge:', error);
      throw error;
    }
  }

  async deleteMiscCharge(miscChargeId: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/misc-charges/${miscChargeId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      const result = await this.handleResponse(response);
      return result;
    } catch (error) {
      console.error('Error deleting misc charge:', error);
      throw error;
    }
  }

  // Service management
  async deleteService(serviceId: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/work-orders/services/${serviceId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      const result = await this.handleResponse(response);
      return result;
    } catch (error) {
      console.error('Error deleting service:', error);
      throw error;
    }
  }

  // Inspection management
  async deleteInspection(inspectionId: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/work-orders/inspections/${inspectionId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      const result = await this.handleResponse(response);
      return result;
    } catch (error) {
      console.error('Error deleting inspection:', error);
      throw error;
    }
  }
}

export const workOrderService = new WorkOrderService();