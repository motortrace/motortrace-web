export interface PendingRequest {
  id: string;
  customer: string;
  phone: string;
  vehicle: string;
  requestedDate: string;
  requestedTime: string;
  services: string[];
  priority: 'normal' | 'urgent' | 'moderate';
  createdAt: string;
  technician?: string;
  notes?: string;
} 