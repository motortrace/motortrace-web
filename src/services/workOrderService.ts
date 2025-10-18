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
}

export const workOrderService = new WorkOrderService();