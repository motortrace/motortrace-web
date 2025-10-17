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

// ==================== Technician Assignment Types ====================

export interface Technician {
  id: string;
  userProfileId?: string;
  employeeId?: string;
  specialization?: string;
  certifications?: string[];
  userProfile?: UserProfile | null;
  isActive?: boolean;
}

export interface TechnicianActiveWork {
  workOrderId: string;
  workOrderNumber?: string;
  laborItem?: {
    id: string;
    description: string;
    status: ServiceStatus;
  } | null;
  part?: {
    id: string;
    description: string;
    status: string;
  } | null;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'UNASSIGNED';
}

export interface TechnicianWithStatus extends Technician {
  activeWork?: TechnicianActiveWork[];
  isBusy: boolean;
}

// ==================== Work Order Approval Types ====================

export interface WorkOrderApproval {
  id: string;
  workOrderId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED';
  requestedAt: string;
  approvedAt: string | null;
  approvedById: string | null;
  method: string | null;
  notes: string | null;
  customerSignature: string | null;
  pdfUrl: string | null;
  createdAt: string;
  updatedAt: string;
  approvedBy?: {
    id: string;
    name: string;
    profileImage?: string | null;
  } | null;
}

// ==================== Payment Types ====================

export type PaymentMethod = 'CASH' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'BANK_TRANSFER' | 'UPI' | 'CHEQUE' | 'DIGITAL_WALLET' | 'INSURANCE' | 'WARRANTY';

export type PaymentStatus = 'PENDING' | 'PARTIALLY_PAID' | 'PAID' | 'OVERDUE' | 'COMPLETED' | 'FAILED' | 'REFUNDED' | 'PARTIAL_REFUND' | 'CANCELLED';

export interface WorkOrderPayment {
  id: string;
  workOrderId: string;
  method: PaymentMethod;
  amount: number;
  reference?: string;
  status: PaymentStatus;
  paidAt: string;
  processedById?: string;
  notes?: string;
  refundAmount?: number;
  refundReason?: string;
  createdAt: string;
  updatedAt: string;
  processedBy?: {
    id: string;
    employeeId: string;
    userProfile: {
      id: string;
      name: string;
    };
  };
}

// ==================== Modal Props ====================

export interface ManageWorkOrderModalProps {
  open: boolean;
  onClose: () => void;
  workOrder?: any;
  onUpdate?: () => void;
}

// ==================== Invoice Types ====================

export interface InvoiceLineItem {
  id: string;
  invoiceId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  type: 'SERVICE' | 'PART' | 'LABOR';
  createdAt: string;
}

export interface InvoiceCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface InvoiceVehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
}

export interface InvoiceWorkOrder {
  id: string;
  workOrderNumber: string;
  customer: InvoiceCustomer;
  vehicle: InvoiceVehicle;
}

export type InvoiceStatus = 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE' | 'CANCELLED';

export interface Invoice {
  id: string;
  invoiceNumber: string;
  workOrderId: string;
  issueDate: string;
  dueDate: string;
  status: InvoiceStatus;
  subtotalServices: number;
  subtotalLabor: number;
  subtotalParts: number;
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  notes?: string;
  terms?: string;
  workOrder: InvoiceWorkOrder;
  lineItems: InvoiceLineItem[];
}
