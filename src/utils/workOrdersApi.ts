const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/work-orders`;
const API_BASE_2 = `${import.meta.env.VITE_API_BASE_URL}/estimates`;

// Types based on backend API structure
export interface WorkOrder {
  id: string;
  workOrderNumber: string;
  customerId: string;
  vehicleId: string;
  appointmentId?: string;
  advisorId?: string;
  technicianId?: string;
  status: 'RECEIVED' | 'ESTIMATE' | 'APPROVAL' | 'IN_PROGRESS' | 'WAITING_FOR_PARTS' | 'COMPLETED' | 'CANCELLED';
  workflowStep: 'RECEIVED' | 'ESTIMATE' | 'APPROVAL' | 'IN_PROGRESS' | 'WAITING_FOR_PARTS' | 'COMPLETED' | 'CANCELLED';
  jobType: 'REPAIR' | 'MAINTENANCE' | 'INSPECTION' | 'DIAGNOSTIC' | 'OTHER';
  priority: 'HIGH' | 'MEDIUM' | 'LOW' | 'NORMAL';
  source: 'WALK_IN' | 'APPOINTMENT' | 'PHONE' | 'ONLINE' | 'OTHER';
  complaint?: string;
  odometerReading?: number;
  warrantyStatus?: string;
  estimatedTotal?: number;
  estimateNotes?: string;
  promisedAt?: string;
  internalNotes?: string;
  customerNotes?: string;
  subtotalLabor?: number;
  subtotalParts?: number;
  totalAmount?: number;
  taxAmount?: number;
  createdAt: string;
  updatedAt: string;
  
  // Related data
  customer?: {
    id: string;
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
  };
  vehicle?: {
    id: string;
    year: number;
    make: string;
    model: string;
    vin?: string;
    licensePlate?: string;
    imageUrl?: string;
  };
  serviceAdvisor?: {
    id: string;
    employeeId: string;
    department: string;
    userProfile: {
      id: string;
      phone: string;
      firstName: string;
      lastName: string;
    };
  };
  inspector?: {
    id: string;
    employeeId: string;
    userProfile: {
      id: string;
      firstName: string;
      lastName: string;
    };
  };
  estimates?: Estimate[];
  labor?: Labor[];
  parts?: Part[];
  services?: Service[];
  payments?: Payment[];
  attachments?: Attachment[];
  inspections?: Inspection[];
  qc?: QC[];
}

export interface Estimate {
  id: string;
  workOrderId: string;
  version: number;
  totalAmount: number;
  laborAmount?: number;
  partsAmount?: number;
  taxAmount?: number;
  discountAmount?: number;
  description?: string;
  notes?: string;
  approved: boolean;
  approvedAt?: string;
  approvedById?: string;
  createdAt: string;
  updatedAt: string;
  estimateItems: EstimateItem[];
}

export interface EstimateItem {
  id: string;
  estimateId: string;
  type: 'LABOR' | 'PART' | 'SERVICE';
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  notes?: string;
  // Added for backend compatibility
  customerApproved?: boolean | null;
}

export interface Labor {
  id: string;
  workOrderId: string;
  description: string;
  hours: number;
  rate: number;
  laborCatalogId?: string;
  technicianId?: string;
  startTime?: string;
  endTime?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Part {
  id: string;
  workOrderId: string;
  inventoryItemId: string;
  quantity: number;
  unitPrice: number;
  source?: 'INVENTORY' | 'SUPPLIER' | 'CUSTOMER_SUPPLIED';
  supplierName?: string;
  supplierInvoice?: string;
  warrantyInfo?: string;
  notes?: string;
  installedAt?: string;
  installedById?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Service {
  id: string;
  workOrderId: string;
  cannedServiceId: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  workOrderId: string;
  method: 'CASH' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'CHECK' | 'OTHER';
  amount: number;
  reference?: string;
  notes?: string;
  processedById?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Attachment {
  id: string;
  workOrderId: string;
  fileUrl: string;
  fileName?: string;
  fileType?: string;
  fileSize?: number;
  category?: string;
  description?: string;
  uploadedById?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Inspection {
  id: string;
  workOrderId: string;
  inspectorId: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface QC {
  id: string;
  workOrderId: string;
  passed: boolean;
  inspectorId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// API Functions
export async function getWorkOrders(params?: Record<string, any>) {
  const query = params ? '?' + new URLSearchParams(params).toString() : '';
  const res = await fetch(`${API_BASE}${query}`, {
    headers: {
      'Content-Type': 'application/json',
      // TODO: Add auth headers if needed
    },
  });
  if (!res.ok) throw new Error('Failed to fetch work orders');
  return res.json();
}

export async function getWorkOrder(id: string) {
  const res = await fetch(`${API_BASE}/${id}`, {
    headers: {
      'Content-Type': 'application/json',
      // TODO: Add auth headers if needed
    },
  });
  if (!res.ok) throw new Error('Failed to fetch work order');
  return res.json();
}

export async function createWorkOrder(data: Partial<WorkOrder>) {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // TODO: Add auth headers if needed
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create work order');
  return res.json();
}

export async function updateWorkOrder(id: string, data: Partial<WorkOrder>) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      // TODO: Add auth headers if needed
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update work order');
  return res.json();
}

export async function updateWorkOrderStatus(id: string, status: WorkOrder['status'], workflowStep?: WorkOrder['workflowStep']) {
  const res = await fetch(`${API_BASE}/${id}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      // TODO: Add auth headers if needed
    },
    body: JSON.stringify({ status, workflowStep }),
  });
  if (!res.ok) throw new Error('Failed to update work order status');
  return res.json();
}

export async function assignWorkOrder(id: string, advisorId?: string, technicianId?: string) {
  const res = await fetch(`${API_BASE}/${id}/assign`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      // TODO: Add auth headers if needed
    },
    body: JSON.stringify({ advisorId, technicianId }),
  });
  if (!res.ok) throw new Error('Failed to assign work order');
  return res.json();
}

export async function generateEstimate(workOrderId: string) {
  const res = await fetch(`${API_BASE}/${workOrderId}/generate-estimate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // TODO: Add auth headers if needed
    },
  });
  if (!res.ok) throw new Error('Failed to generate estimate');
  return res.json();
}

export async function getWorkOrderEstimates(workOrderId: string) {
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/estimates?workOrderId=${workOrderId}`, {
    headers: {
      'Content-Type': 'application/json',
      // TODO: Add auth headers if needed
    },
  });
  if (!res.ok) throw new Error('Failed to fetch work order estimates');
  return res.json();
}

export async function approveEstimate(workOrderId: string, estimateId: string, approvedById: string) {
  const res = await fetch(`${API_BASE}/${workOrderId}/estimates/${estimateId}/approve`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      // TODO: Add auth headers if needed
    },
    body: JSON.stringify({ approvedById }),
  });
  if (!res.ok) throw new Error('Failed to approve estimate');
  return res.json();
}

export async function getWorkOrderLabor(workOrderId: string) {
  const res = await fetch(`${API_BASE}/${workOrderId}/labor`, {
    headers: {
      'Content-Type': 'application/json',
      // TODO: Add auth headers if needed
    },
  });
  if (!res.ok) throw new Error('Failed to fetch work order labor');
  return res.json();
}

export async function createWorkOrderLabor(workOrderId: string, data: Partial<Labor>) {
  const res = await fetch(`${API_BASE}/${workOrderId}/labor`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // TODO: Add auth headers if needed
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create work order labor');
  return res.json();
}

export async function getWorkOrderParts(workOrderId: string) {
  const res = await fetch(`${API_BASE}/${workOrderId}/parts`, {
    headers: {
      'Content-Type': 'application/json',
      // TODO: Add auth headers if needed
    },
  });
  if (!res.ok) throw new Error('Failed to fetch work order parts');
  return res.json();
}

export async function createWorkOrderPart(workOrderId: string, data: Partial<Part>) {
  const res = await fetch(`${API_BASE}/${workOrderId}/parts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // TODO: Add auth headers if needed
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create work order part');
  return res.json();
}

export async function getWorkOrderServices(workOrderId: string) {
  const res = await fetch(`${API_BASE}/${workOrderId}/services`, {
    headers: {
      'Content-Type': 'application/json',
      // TODO: Add auth headers if needed
    },
  });
  if (!res.ok) throw new Error('Failed to fetch work order services');
  return res.json();
}

export async function createWorkOrderService(workOrderId: string, data: Partial<Service>) {
  const res = await fetch(`${API_BASE}/${workOrderId}/services`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // TODO: Add auth headers if needed
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create work order service');
  return res.json();
}

export async function getWorkOrderPayments(workOrderId: string) {
  const res = await fetch(`${API_BASE}/${workOrderId}/payments`, {
    headers: {
      'Content-Type': 'application/json',
      // TODO: Add auth headers if needed
    },
  });
  if (!res.ok) throw new Error('Failed to fetch work order payments');
  return res.json();
}

export async function createWorkOrderPayment(workOrderId: string, data: Partial<Payment>) {
  const res = await fetch(`${API_BASE}/${workOrderId}/payments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // TODO: Add auth headers if needed
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create work order payment');
  return res.json();
}

export async function getWorkOrderAttachments(workOrderId: string, category?: string) {
  const query = category ? `?category=${encodeURIComponent(category)}` : '';
  const res = await fetch(`${API_BASE}/${workOrderId}/attachments${query}`, {
    headers: {
      'Content-Type': 'application/json',
      // TODO: Add auth headers if needed
    },
  });
  if (!res.ok) throw new Error('Failed to fetch work order attachments');
  return res.json();
}

export async function uploadWorkOrderAttachment(workOrderId: string, data: Partial<Attachment>) {
  const res = await fetch(`${API_BASE}/${workOrderId}/attachments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // TODO: Add auth headers if needed
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to upload work order attachment');
  return res.json();
}

export async function getWorkOrderInspections(workOrderId: string) {
  const res = await fetch(`${API_BASE}/${workOrderId}/inspections`, {
    headers: {
      'Content-Type': 'application/json',
      // TODO: Add auth headers if needed
    },
  });
  if (!res.ok) throw new Error('Failed to fetch work order inspections');
  return res.json();
}

export async function createWorkOrderInspection(workOrderId: string, data: Partial<Inspection>) {
  const res = await fetch(`${API_BASE}/${workOrderId}/inspections`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // TODO: Add auth headers if needed
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create work order inspection');
  return res.json();
}

export async function getWorkOrderQC(workOrderId: string) {
  const res = await fetch(`${API_BASE}/${workOrderId}/qc`, {
    headers: {
      'Content-Type': 'application/json',
      // TODO: Add auth headers if needed
    },
  });
  if (!res.ok) throw new Error('Failed to fetch work order QC');
  return res.json();
}

export async function createWorkOrderQC(workOrderId: string, data: Partial<QC>) {
  const res = await fetch(`${API_BASE}/${workOrderId}/qc`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // TODO: Add auth headers if needed
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create work order QC');
  return res.json();
}

export async function deleteWorkOrder(id: string) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      // TODO: Add auth headers if needed
    },
  });
  if (!res.ok) throw new Error('Failed to delete work order');
  return res.json();
}
