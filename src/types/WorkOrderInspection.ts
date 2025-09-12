export interface WorkOrderInspection {
  id: string;
  workOrderId: string;
  workOrderNumber: string;
  inspectorId: string;
  templateId?: string;
  date: string;
  notes?: string;
  isCompleted: boolean;
  
  // Related data
  workOrder?: {
    id: string;
    workOrderNumber: string;
  };
  template?: {
    id: string;
    name: string;
    description?: string;
    category?: string;
    imageUrl?: string;
    isActive: boolean;
    sortOrder?: number;
    createdAt: string;
    updatedAt: string;
  };
  inspector?: {
    id: string;
    userProfileId: string;
    employeeId: string;
    specialization: string;
    certifications: string[];
    createdAt: string;
    updatedAt: string;
    userProfile: {
      id: string;
      supabaseUserId: string;
      name: string;
      phone: string;
      profileImage?: string;
      role: string;
      isRegistrationComplete: boolean;
      createdAt: string;
      updatedAt: string;
    };
  };
  checklistItems?: InspectionChecklistItem[];
}

export interface InspectionChecklistItem {
  id: string;
  inspectionId: string;
  templateItemId: string;
  category: string;
  item: string;
  status: 'GREEN' | 'YELLOW' | 'RED';
  notes?: string;
  requiresFollowUp: boolean;
  createdAt: string;
  templateItem: {
    id: string;
    templateId: string;
    name: string;
    description: string;
    category: string;
    sortOrder: number;
    isRequired: boolean;
    allowsNotes: boolean;
    createdAt: string;
    updatedAt: string;
  };
}
