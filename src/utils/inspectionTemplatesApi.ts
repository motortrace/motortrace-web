import type { 
  InspectionTemplate, 
  InspectionTemplateItem, 
  CreateTemplateRequest, 
  UpdateTemplateRequest 
} from '../types/InspectionTemplate';

const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/inspection-templates/templates`;

export const inspectionTemplatesApi = {
  // Get all templates
  async getTemplates(): Promise<InspectionTemplate[]> {
    try {
      const response = await fetch(API_BASE, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch templates: ${response.statusText}`);
      }

      const result = await response.json();
      
      // Handle the API response structure with success/data wrapper
      if (result.success && result.data) {
        return result.data;
      } else {
        throw new Error('Invalid response format from API');
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
      throw error;
    }
  },

  // Get single template by ID
  async getTemplate(id: string): Promise<InspectionTemplate> {
    try {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch template: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.success && result.data) {
        return result.data;
      } else {
        throw new Error('Invalid response format from API');
      }
    } catch (error) {
      console.error('Error fetching template:', error);
      throw error;
    }
  },

  // Create new template
  async createTemplate(template: CreateTemplateRequest): Promise<InspectionTemplate> {
    try {
      const response = await fetch(API_BASE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(template),
      });

      if (!response.ok) {
        throw new Error(`Failed to create template: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.success && result.data) {
        return result.data;
      } else {
        throw new Error('Invalid response format from API');
      }
    } catch (error) {
      console.error('Error creating template:', error);
      throw error;
    }
  },

  // Update template
  async updateTemplate(id: string, updates: UpdateTemplateRequest): Promise<InspectionTemplate> {
    try {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error(`Failed to update template: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.success && result.data) {
        return result.data;
      } else {
        throw new Error('Invalid response format from API');
      }
    } catch (error) {
      console.error('Error updating template:', error);
      throw error;
    }
  },

  // Delete template
  async deleteTemplate(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete template: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error deleting template:', error);
      throw error;
    }
  },

  // Template Items API
  async getTemplateItems(templateId: string): Promise<InspectionTemplateItem[]> {
    try {
      const response = await fetch(`${API_BASE}/${templateId}/items`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch template items: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching template items:', error);
      throw error;
    }
  },

  // Add item to template
  async addTemplateItem(templateId: string, item: Omit<InspectionTemplateItem, 'id' | 'templateId' | 'createdAt' | 'updatedAt'>): Promise<InspectionTemplateItem> {
    try {
      const response = await fetch(`${API_BASE}/${templateId}/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(item),
      });

      if (!response.ok) {
        throw new Error(`Failed to add template item: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error adding template item:', error);
      throw error;
    }
  },

  // Update template item
  async updateTemplateItem(templateId: string, itemId: string, updates: Partial<InspectionTemplateItem>): Promise<InspectionTemplateItem> {
    try {
      const response = await fetch(`${API_BASE}/${templateId}/items/${itemId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error(`Failed to update template item: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating template item:', error);
      throw error;
    }
  },

  // Delete template item
  async deleteTemplateItem(templateId: string, itemId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE}/${templateId}/items/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete template item: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error deleting template item:', error);
      throw error;
    }
  }
};
