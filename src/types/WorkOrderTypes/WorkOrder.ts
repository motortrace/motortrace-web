// src/types/WorkOrderTypes/WorkOrder.ts
import { 
  WorkOrderStatus, 
  JobType, 
  JobPriority, 
  JobSource, 
  WarrantyStatus, 
  WorkflowStep, 
  PaymentStatus,
  ServiceStatus,
  PartSource,
  PaymentMethod,
  ApprovalStatus,
  ApprovalMethod,
  ChecklistStatus,
  TirePosition,
  AttachmentCategory
} from './enums';

export interface WorkOrder {
  id: string;
  workOrderNumber: string;
  createdAt: Date;
  updatedAt: Date;
  customerId: string;
  vehicleId: string;
  appointmentId?: string;
  advisorId?: string;
  technicianId?: string;
  status: WorkOrderStatus;
  jobType: JobType;
  priority: JobPriority;
  source: JobSource;
  complaint?: string;
  odometerReading?: number;
  warrantyStatus: WarrantyStatus;
  estimatedTotal?: number;
  estimateNotes?: string;
  estimateApproved: boolean;
  subtotalLabor?: number;
  subtotalParts?: number;
  discountAmount?: number;
  taxAmount?: number;
  totalAmount?: number;
  paidAmount: number;
  openedAt?: Date;
  promisedAt?: Date;
  closedAt?: Date;
  workflowStep: WorkflowStep;
  internalNotes?: string;
  customerNotes?: string;
  invoiceNumber?: string;
  finalizedAt?: Date;
  paymentStatus: PaymentStatus;
  warrantyClaimNumber?: string;
  thirdPartyApprovalCode?: string;
  campaignId?: string;
  servicePackageId?: string;
  customerSignature?: string;
  customerFeedback?: string;
  
  // Relations
  customer: Customer;
  vehicle: Vehicle;
  appointment?: Appointment;
  serviceAdvisor?: ServiceAdvisor;
  services: WorkOrderService[];
  inspections: WorkOrderInspection[];
  laborItems: WorkOrderLabor[];
  partsUsed: WorkOrderPart[];
  payments: Payment[];
  estimates: WorkOrderEstimate[];
  attachments: WorkOrderAttachment[];

  // Frontend specific properties for compatibility
  title: string;
  estimateNumber: string;
  amount: number;
  assignedPeople?: AssignedPerson[];
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
}

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year?: number;
  licensePlate?: string;
  vin?: string;
}

export interface Appointment {
  id: string;
  requestedAt: Date;
  startTime?: Date;
  endTime?: Date;
}

export interface ServiceAdvisor {
  id: string;
  employeeId?: string;
  department?: string;
  userProfile: UserProfile;
}

export interface UserProfile {
  id: string;
  name?: string;
  phone?: string;
}

export interface WorkOrderService {
  id: string;
  cannedServiceId: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  status: ServiceStatus;
  notes?: string;
  cannedService: CannedService;
}

export interface CannedService {
  id: string;
  code: string;
  name: string;
  description?: string;
  duration: number;
  price: number;
}

export interface WorkOrderInspection {
  id: string;
  inspectorId: string;
  date: Date;
  notes?: string;
  inspector: Technician;
}

export interface WorkOrderLabor {
  id: string;
  laborCatalogId?: string;
  description: string;
  hours: number;
  rate: number;
  subtotal: number;
  technicianId?: string;
  startTime?: Date;
  endTime?: Date;
  notes?: string;
  laborCatalog?: LaborCatalog;
  technician?: Technician;
}

export interface LaborCatalog {
  id: string;
  code: string;
  name: string;
  estimatedHours: number;
  hourlyRate: number;
}

export interface Technician {
  id: string;
  employeeId?: string;
  userProfile: UserProfile;
}

export interface WorkOrderPart {
  id: string;
  inventoryItemId: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  source: PartSource;
  supplierName?: string;
  supplierInvoice?: string;
  warrantyInfo?: string;
  notes?: string;
  installedAt?: Date;
  installedById?: string;
  part: InventoryItem;
  installedBy?: Technician;
}

export interface InventoryItem {
  id: string;
  name: string;
  sku?: string;
  partNumber?: string;
  manufacturer?: string;
}

export interface Payment {
  id: string;
  method: PaymentMethod;
  amount: number;
  reference?: string;
  status: PaymentStatus;
  paidAt: Date;
  processedById?: string;
  notes?: string;
  refundAmount?: number;
  refundReason?: string;
  processedBy?: ServiceAdvisor;
}

export interface WorkOrderEstimate {
  id: string;
  version: number;
  description?: string;
  totalAmount: number;
  laborAmount?: number;
  partsAmount?: number;
  taxAmount?: number;
  discountAmount?: number;
  notes?: string;
  createdById?: string;
  approved: boolean;
  approvedAt?: Date;
  approvedById?: string;
  createdBy?: ServiceAdvisor;
  approvedBy?: ServiceAdvisor;
}

export interface WorkOrderAttachment {
  id: string;
  fileUrl: string;
  fileName?: string;
  fileType: string;
  fileSize?: number;
  description?: string;
  category: AttachmentCategory;
  uploadedById?: string;
  uploadedAt: Date;
  uploadedBy?: ServiceAdvisor;
}

export interface AssignedPerson {
  id: string;
  name: string;
  profilePhoto: string;
}

// Request/Response types
export interface CreateWorkOrderRequest {
  customerId: string;
  vehicleId: string;
  appointmentId?: string;
  advisorId?: string;
  status?: WorkOrderStatus;
  jobType?: JobType;
  priority?: JobPriority;
  source?: JobSource;
  complaint?: string;
  odometerReading?: number;
  warrantyStatus?: WarrantyStatus;
  estimatedTotal?: number;
  estimateNotes?: string;
  promisedAt?: Date;
  internalNotes?: string;
  customerNotes?: string;
  cannedServiceIds?: string[];
  quantities?: number[];
  prices?: number[];
  serviceNotes?: string[];
}

export interface UpdateWorkOrderRequest {
  status?: WorkOrderStatus;
  jobType?: JobType;
  priority?: JobPriority;
  complaint?: string;
  odometerReading?: number;
  warrantyStatus?: WarrantyStatus;
  estimatedTotal?: number;
  estimateNotes?: string;
  promisedAt?: Date;
  internalNotes?: string;
  customerNotes?: string;
  advisorId?: string;
  openedAt?: Date;
  closedAt?: Date;
  workflowStep?: WorkflowStep;
  invoiceNumber?: string;
  finalizedAt?: Date;
  paymentStatus?: PaymentStatus;
  warrantyClaimNumber?: string;
  thirdPartyApprovalCode?: string;
  customerSignature?: string;
  customerFeedback?: string;
}

export interface WorkOrderFilters {
  status?: WorkOrderStatus;
  jobType?: JobType;
  priority?: JobPriority;
  source?: JobSource;
  customerId?: string;
  vehicleId?: string;
  advisorId?: string;
  startDate?: Date;
  endDate?: Date;
  workflowStep?: WorkflowStep;
  paymentStatus?: PaymentStatus;
}