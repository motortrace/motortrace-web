// Type definitions for ManageWorkOrderModal and its sub-components

// ==================== Labor Related Types ====================

export interface LaborCatalog {
  id: string;
  code: string;
  name: string;
  description?: string;
  estimatedHours: number;
  hourlyRate: number;
  category?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  profileImage?: string | null;
  phone?: string;
}

export interface TechnicianProfile {
  id: string;
  userProfileId?: string;
  employeeId?: string;
  specialization?: string;
  certifications?: string[];
  userProfile?: UserProfile | null;
}

export interface WorkOrderLabor {
  id: string;
  workOrderId: string;
  laborCatalog?: LaborCatalog | null;
  laborCatalogId?: string | null;
  description: string;
  hours: number;
  rate: number;
  technician?: TechnicianProfile | null;
  technicianId?: string | null;
  subtotal: number;
  startTime?: string | null;
  endTime?: string | null;
  status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | null;
  notes?: string | null;
  cannedServiceId?: string | null;
  serviceDiscountAmount?: number | null;
  serviceDiscountType?: string | null;
  createdAt: string;
  updatedAt: string;
}

// ==================== Inspection Related Types ====================

export interface InspectionTemplateItem {
  id: string;
  name: string;
  description?: string;
  category?: string;
  sortOrder?: number;
  isRequired: boolean;
  allowsNotes: boolean;
}

export interface InspectionTemplate {
  id: string;
  name: string;
  description?: string;
  category?: string;
  sortOrder?: number;
  templateItems: InspectionTemplateItem[];
}

export type ChecklistStatus = 'GREEN' | 'YELLOW' | 'RED';

export interface InspectionChecklistItem {
  id: string;
  inspectionId: string;
  templateItemId?: string;
  category?: string;
  item: string;
  status: ChecklistStatus;
  notes?: string;
  requiresFollowUp: boolean;
  createdAt: string;
}

export interface TireInspection {
  id: string;
  inspectionId: string;
  position: string;
  brand?: string;
  model?: string;
  size?: string;
  psi?: number;
  treadDepth?: number;
  damageNotes?: string;
  createdAt: string;
}

export interface WorkOrderInspectionAttachment {
  id: string;
  inspectionId: string;
  fileUrl: string;
  fileName?: string;
  fileType?: string;
  fileSize?: number;
  description?: string;
  uploadedAt: string;
}

export interface WorkOrderInspection {
  id: string;
  workOrderId: string;
  inspector: { id: string; name: string };
  template?: InspectionTemplate;
  templateId?: string;
  date: string;
  notes?: string;
  isCompleted: boolean;
  checklistItems: InspectionChecklistItem[];
  tireChecks: TireInspection[];
  attachments: WorkOrderInspectionAttachment[];
}

// ==================== Service Related Types ====================

export interface CannedService {
  id: string;
  code: string;
  name: string;
  description?: string;
  duration: number;
  price: number;
}

export type ServiceStatus = 'ESTIMATED' | 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface WorkOrderLaborItem {
  id: string;
  workOrderId: string;
  laborCatalogId?: string | null;
  description: string;
  technicianId?: string | null;
  technician?: TechnicianProfile | null;
  startTime?: string | null;
  endTime?: string | null;
  status: ServiceStatus;
  notes?: string | null;
  serviceId: string;
  estimatedMinutes?: number | null;
  actualMinutes?: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface WorkOrderService {
  id: string;
  workOrderId: string;
  cannedServiceId?: string | null;
  cannedService?: CannedService | null;
  description: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  status: ServiceStatus;
  notes?: string | null;
  customerApproved: boolean;
  customerRejected: boolean;
  approvedAt?: string | null;
  rejectedAt?: string | null;
  customerNotes?: string | null;
  createdAt: string;
  updatedAt: string;
  laborItems?: WorkOrderLaborItem[];
}

// ==================== Modal Props ====================

export interface ManageWorkOrderModalProps {
  open: boolean;
  onClose: () => void;
  workOrder?: any;
  onUpdate?: () => void;
}
