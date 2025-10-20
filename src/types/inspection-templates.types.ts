// types/inspection-templates.types.ts

// Base Types matching Prisma schema
export interface InspectionTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  isActive: boolean;
  sortOrder: number;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  templateItems: InspectionTemplateItem[];
}

export interface InspectionTemplateItem {
  id: string;
  templateId: string;
  name: string;
  description?: string;
  category: string;
  isRequired: boolean;
  allowsNotes: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkOrderInspection {
  id: string;
  workOrderId: string;
  templateId?: string;
  inspectorId?: string;
  notes?: string;
  date: Date;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  template?: InspectionTemplate;
  checklistItems: InspectionChecklistItem[];
  inspector?: any; // Technician type
  workOrder?: any; // WorkOrder type
  tireChecks?: any[]; // TireCheck type
  attachments?: any[]; // WorkOrderInspectionAttachment type
}

export interface InspectionChecklistItem {
  id: string;
  inspectionId: string;
  templateItemId?: string;
  category?: string;
  item: string;
  status: any;
  notes?: string;
  requiresFollowUp: boolean;
  createdAt: Date;
  updatedAt: Date;
  templateItem?: InspectionTemplateItem;
}

// Request Types
export interface CreateInspectionTemplateRequest {
  name: string;
  description: string;
  category: string;
  sortOrder: number;
  templateItems?: Array<{
    name: string;
    description?: string;
    category: string;
    isRequired?: boolean;
    allowsNotes?: boolean;
    sortOrder: number;
  }>;
}

export interface UpdateInspectionTemplateRequest {
  name?: string;
  description?: string;
  category?: string;
  isActive?: boolean;
  sortOrder?: number;
  imageUrl?: string;
}

export interface AssignTemplateToWorkOrderRequest {
  workOrderId: string;
  templateId: string;
  inspectorId?: string;
  notes?: string;
}

export interface CreateInspectionFromTemplateRequest {
  workOrderId: string;
  templateId: string;
  inspectorId?: string;
  notes?: string;
  checklistItems?: CreateChecklistItemRequest[];
}

export interface CreateChecklistItemRequest {
  templateItemId?: string;
  category?: string;
  item: string;
  status: any;
  notes?: string;
  requiresFollowUp?: boolean;
}

export interface UpdateChecklistItemRequest {
  status?: any;
  notes?: string;
  requiresFollowUp?: boolean;
}

// Filter Types
export interface InspectionTemplateFilters {
  category?: string;
  isActive?: boolean;
  search?: string;
}

export interface WorkOrderInspectionFilters {
  workOrderId?: string;
  inspectorId?: string;
  templateId?: string;
  isCompleted?: boolean;
  dateFrom?: Date;
  dateTo?: Date;
}

// Response Types
export interface InspectionTemplateResponse {
  success: boolean;
  data?: InspectionTemplate;
  message?: string;
  error?: string;
}

export interface InspectionTemplatesResponse {
  success: boolean;
  data: InspectionTemplate[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  error?: string;
}

export interface WorkOrderInspectionResponse {
  success: boolean;
  data?: WorkOrderInspection & { workOrderNumber?: string };
  message?: string;
  error?: string;
}

export interface WorkOrderInspectionsResponse {
  success: boolean;
  data: Array<WorkOrderInspection & { workOrderNumber?: string }>;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  error?: string;
}

export interface TemplateAssignmentResponse {
  success: boolean;
  data?: {
    inspection: WorkOrderInspection & { workOrderNumber?: string };
    template: InspectionTemplate;
    checklistItems: InspectionChecklistItem[];
  };
  message?: string;
  error?: string;
}