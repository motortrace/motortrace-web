// services/inspectionTemplatesService.ts
import type {
    CreateInspectionTemplateRequest,
    UpdateInspectionTemplateRequest,
    AssignTemplateToWorkOrderRequest,
    CreateInspectionFromTemplateRequest,
    CreateChecklistItemRequest,
    UpdateChecklistItemRequest,
    InspectionTemplateFilters,
    WorkOrderInspectionFilters,
    InspectionTemplateResponse,
    InspectionTemplatesResponse,
    WorkOrderInspectionResponse,
    WorkOrderInspectionsResponse,
    TemplateAssignmentResponse
} from '../types/inspection-templates.types';

const API_BASE = 'http://localhost:3000/inspection-templates';

export const inspectionTemplatesService = {
    // Template Management
    async createInspectionTemplate(data: CreateInspectionTemplateRequest): Promise<InspectionTemplateResponse> {
        try {
            console.log('📤 Sending request to create inspection template:', data);

            const response = await fetch(`${API_BASE}/templates`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            console.log('📥 Response status:', response.status, response.statusText);

            // Check if response has content before trying to parse JSON
            const contentType = response.headers.get('content-type');
            const responseText = await response.text();

            console.log('📄 Response content type:', contentType);
            console.log('📄 Response text:', responseText);

            if (!response.ok) {
                // Try to parse error response as JSON, fallback to text
                let errorMessage = `HTTP error! status: ${response.status}`;

                if (responseText && contentType?.includes('application/json')) {
                    try {
                        const errorData = JSON.parse(responseText);
                        errorMessage = errorData.error || errorData.message || errorMessage;
                    } catch (e) {
                        errorMessage = responseText || errorMessage;
                    }
                }

                throw new Error(errorMessage);
            }

            // If response is empty but successful
            if (!responseText) {
                return {
                    success: true,
                    message: 'Inspection template created successfully'
                };
            }

            // Parse successful JSON response
            if (contentType?.includes('application/json')) {
                return JSON.parse(responseText);
            } else {
                throw new Error('Server returned non-JSON response');
            }

        } catch (error: any) {
            console.error('❌ Service error - createInspectionTemplate:', error);

            // Re-throw with more context
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                throw new Error('Network error: Unable to reach the server');
            }

            throw error;
        }
    },

    async getInspectionTemplates(
        filters: InspectionTemplateFilters = {},
        page: number = 1,
        limit: number = 10
    ): Promise<InspectionTemplatesResponse> {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
            ...(filters.category && { category: filters.category }),
            ...(filters.isActive !== undefined && { isActive: filters.isActive.toString() }),
            ...(filters.search && { search: filters.search }),
        });

        const response = await fetch(`/api/inspection-templates/templates?${params}`);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch inspection templates');
        }

        return response.json();
    },

    async updateInspectionTemplate(
        id: string,
        data: UpdateInspectionTemplateRequest
    ): Promise<InspectionTemplateResponse> {
        const response = await fetch(`/api/inspection-templates/templates/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to update inspection template');
        }

        return response.json();
    },

    async deleteInspectionTemplate(id: string): Promise<InspectionTemplateResponse> {
        const response = await fetch(`/api/inspection-templates/templates/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to delete inspection template');
        }

        return response.json();
    },

    // Work Order Inspection Management
    async assignTemplateToWorkOrder(data: AssignTemplateToWorkOrderRequest): Promise<TemplateAssignmentResponse> {
        const response = await fetch('/api/inspection-templates/work-orders/assign-template', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to assign template to work order');
        }

        return response.json();
    },

    async createInspectionFromTemplate(data: CreateInspectionFromTemplateRequest): Promise<TemplateAssignmentResponse> {
        const response = await fetch('/api/inspection-templates/work-orders/create-inspection', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to create inspection from template');
        }

        return response.json();
    },

    async getWorkOrderInspection(id: string): Promise<WorkOrderInspectionResponse> {
        const response = await fetch(`/api/inspection-templates/inspections/${id}`);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch work order inspection');
        }

        return response.json();
    },

    async getWorkOrderInspections(
        filters: WorkOrderInspectionFilters = {},
        page: number = 1,
        limit: number = 10
    ): Promise<WorkOrderInspectionsResponse> {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
            ...(filters.workOrderId && { workOrderId: filters.workOrderId }),
            ...(filters.inspectorId && { inspectorId: filters.inspectorId }),
            ...(filters.templateId && { templateId: filters.templateId }),
            ...(filters.isCompleted !== undefined && { isCompleted: filters.isCompleted.toString() }),
            ...(filters.dateFrom && { dateFrom: filters.dateFrom.toISOString() }),
            ...(filters.dateTo && { dateTo: filters.dateTo.toISOString() }),
        });

        const response = await fetch(`/api/inspection-templates/work-orders/inspections?${params}`);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch work order inspections');
        }

        return response.json();
    },

    async updateWorkOrderInspection(
        id: string,
        data: { notes?: string; isCompleted?: boolean; inspectorId?: string }
    ): Promise<WorkOrderInspectionResponse> {
        const response = await fetch(`/api/inspection-templates/inspections/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to update work order inspection');
        }

        return response.json();
    },

    // Checklist Item Management
    async updateChecklistItem(
        id: string,
        data: UpdateChecklistItemRequest
    ): Promise<WorkOrderInspectionResponse> {
        const response = await fetch(`/api/inspection-templates/checklist-items/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to update checklist item');
        }

        return response.json();
    },

    async addChecklistItem(
        inspectionId: string,
        data: CreateChecklistItemRequest
    ): Promise<WorkOrderInspectionResponse> {
        const response = await fetch(`/api/inspection-templates/inspections/${inspectionId}/checklist-items`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to add checklist item');
        }

        return response.json();
    },

    async deleteChecklistItem(id: string): Promise<WorkOrderInspectionResponse> {
        const response = await fetch(`/api/inspection-templates/checklist-items/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to delete checklist item');
        }

        return response.json();
    },

    // Utility Methods
    async getAvailableTemplates(): Promise<InspectionTemplatesResponse> {
        const response = await fetch('/api/inspection-templates/templates/available');

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch available templates');
        }

        return response.json();
    },

    async getTemplatesByCategory(category: string): Promise<InspectionTemplatesResponse> {
        const response = await fetch(`/api/inspection-templates/templates/category/${category}`);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch templates by category');
        }

        return response.json();
    },

    async getWorkOrderInspectionsByWorkOrder(workOrderId: string): Promise<WorkOrderInspectionsResponse> {
        const response = await fetch(`/api/inspection-templates/work-orders/${workOrderId}/inspections`);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch work order inspections by work order');
        }

        return response.json();
    },

    async getWorkOrderInspectionsByInspector(inspectorId: string): Promise<WorkOrderInspectionsResponse> {
        const response = await fetch(`/api/inspection-templates/inspectors/${inspectorId}/inspections`);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch work order inspections by inspector');
        }

        return response.json();
    },

    // Work Order Inspection Status Methods
    async getWorkOrderInspectionStatus(workOrderId: string): Promise<{
        success: boolean;
        data?: {
            totalInspections: number;
            completedInspections: number;
            pendingInspections: number;
            allCompleted: boolean;
            inspections: Array<{
                id: string;
                templateName: string;
                inspectorName: string;
                isCompleted: boolean;
                completedAt?: Date;
                checklistItems: Array<{
                    id: string;
                    item: string;
                    status: string;
                    requiresFollowUp: boolean;
                    notes?: string;
                }>;
            }>;
        };
        error?: string;
    }> {
        const response = await fetch(`/api/inspection-templates/work-orders/${workOrderId}/inspection-status`);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to get work order inspection status');
        }

        return response.json();
    },

    async canProceedToEstimate(workOrderId: string): Promise<{
        success: boolean;
        data?: {
            canProceed: boolean;
            reason?: string;
            inspectionStatus: {
                totalInspections: number;
                completedInspections: number;
                pendingInspections: number;
                allCompleted: boolean;
            };
            followUpItems: Array<{
                inspectionId: string;
                templateName: string;
                itemName: string;
                status: string;
                notes?: string;
            }>;
        };
        error?: string;
    }> {
        const response = await fetch(`/api/inspection-templates/work-orders/${workOrderId}/can-proceed-to-estimate`);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to check estimate readiness');
        }

        return response.json();
    },

    // Inspection Attachment Management
    async createInspectionAttachment(
        inspectionId: string,
        file: File,
        description?: string
    ): Promise<any> {
        const formData = new FormData();
        formData.append('file', file);
        if (description) {
            formData.append('description', description);
        }

        const response = await fetch(`/api/inspection-templates/inspections/${inspectionId}/attachments`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to create inspection attachment');
        }

        return response.json();
    },

    async getInspectionAttachments(inspectionId: string): Promise<any> {
        const response = await fetch(`/api/inspection-templates/inspections/${inspectionId}/attachments`);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch inspection attachments');
        }

        return response.json();
    },

    async deleteInspectionAttachment(attachmentId: string): Promise<any> {
        const response = await fetch(`/api/inspection-templates/attachments/${attachmentId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to delete inspection attachment');
        }

        return response.json();
    },

    // Template Image Management
    async uploadTemplateImage(templateId: string, file: File): Promise<any> {
        const formData = new FormData();
        formData.append('templateImage', file);

        const response = await fetch(`/api/inspection-templates/templates/${templateId}/image`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to upload template image');
        }

        return response.json();
    },

    async deleteTemplateImage(templateId: string): Promise<any> {
        const response = await fetch(`/api/inspection-templates/templates/${templateId}/image`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to delete template image');
        }

        return response.json();
    },

    // Get all templates for templates page (no pagination)
    async getAllTemplatesForPage(): Promise<InspectionTemplatesResponse> {
        const response = await fetch('/api/inspection-templates/templates?limit=1000'); // Large limit to get all
        // Alternatively, you might want to create a specific endpoint for this

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch all templates');
        }

        return response.json();
    }
};