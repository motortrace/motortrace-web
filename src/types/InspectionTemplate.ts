export interface InspectionTemplate {
  id: string;
  name: string;
  description?: string;
  category?: string;
  isActive: boolean;
  sortOrder?: number;
  createdAt: string;
  updatedAt: string;
  templateItems: InspectionTemplateItem[];
  workOrderInspections?: any[]; // We'll define this later if needed
}

export interface InspectionTemplateItem {
  id: string;
  templateId: string;
  name: string;
  description?: string;
  category?: string;
  sortOrder?: number;
  isRequired: boolean;
  allowsNotes: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTemplateRequest {
  name: string;
  description?: string;
  category?: string;
  sortOrder?: number;
  templateItems?: Omit<InspectionTemplateItem, 'id' | 'templateId' | 'createdAt' | 'updatedAt'>[];
}

export interface UpdateTemplateRequest {
  name?: string;
  description?: string;
  category?: string;
  isActive?: boolean;
  sortOrder?: number;
}
