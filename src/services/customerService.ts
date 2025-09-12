// src/services/customerService.ts
import type { Customer, CreateCustomerDto, UpdateCustomerDto, CustomerFilters } from '../types/CustomerTypes/Customer';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

class CustomerService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${API_BASE_URL}/customers`;
  }

  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    };
  }

  async getCustomers(filters?: CustomerFilters): Promise<Customer[]> {
    try {
      const queryParams = new URLSearchParams();

      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            queryParams.append(key, value.toString());
          }
        });
      }

      let url = queryParams.toString()
        ? `${this.baseUrl}?${queryParams.toString()}`
        : this.baseUrl;

      url = url + "?hasVehicles=true";

      console.log(url);

      const response = await fetch(url, {
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`Failed to fetch customers: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('API Success Response:', result);

      // FIX: Return the data array from the successful response
      return result.data || [];
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }
  }

  async getCustomerById(id: string): Promise<Customer> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);

        if (response.status === 404) {
          throw new Error('Customer not found');
        }

        throw new Error(`Failed to fetch customer: ${response.statusText}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch customer');
      }

      return result.data;
    } catch (error) {
      console.error('Error fetching customer:', error);
      throw error;
    }
  }

  async getCustomerVehicles(customerId: string): Promise<any[]> {
    try {
      const response = await fetch(`${this.baseUrl}/${customerId}/vehicles`, {
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch customer vehicles: ${response.statusText}`);
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching customer vehicles:', error);
      throw error;
    }
  }

  async createCustomer(customerData: CreateCustomerDto): Promise<Customer> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(customerData),
      });

      if (!response.ok) {
        throw new Error(`Failed to create customer: ${response.statusText}`);
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
  }
}

// Create a singleton instance
export const customerService = new CustomerService();