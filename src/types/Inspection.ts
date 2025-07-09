export interface InspectionItem {
  id: string;
  title: string;
  description?: string;
  category: string;
  status: 'pending' | 'pass' | 'fail' | 'na' | 'warning';
  notes?: string;
  images?: string[];
  technician?: string;
  completedAt?: string;
  required: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export interface InspectionTemplate {
  id: string;
  name: string;
  description: string;
  category: 'safety' | 'maintenance' | 'diagnostic' | 'pre-delivery' | 'custom';
  items: InspectionItem[];
  estimatedDuration: number; // in minutes
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface DigitalInspection {
  id: string;
  workOrderId: string;
  templateId: string;
  templateName: string;
  status: 'draft' | 'in-progress' | 'completed' | 'cancelled';
  overallStatus: 'pass' | 'fail' | 'warning' | 'pending';
  items: InspectionItem[];
  technician: string;
  customerName: string;
  vehicleInfo: string;
  licensePlate: string;
  startedAt: string;
  completedAt?: string;
  totalItems: number;
  passedItems: number;
  failedItems: number;
  warningItems: number;
  naItems: number;
  notes?: string;
  images?: string[];
  signature?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface InspectionSummary {
  totalInspections: number;
  completedInspections: number;
  pendingInspections: number;
  failedInspections: number;
  averageCompletionTime: number; // in minutes
  passRate: number; // percentage
  mostCommonIssues: Array<{
    issue: string;
    count: number;
  }>;
}

export type TrafficLightStatus = 'red' | 'yellow' | 'green' | 'gray';

export interface InspectionFilters {
  status: 'all' | 'draft' | 'in-progress' | 'completed' | 'cancelled';
  overallStatus: 'all' | 'pass' | 'fail' | 'warning' | 'pending';
  technician: string;
  dateRange: {
    start: string;
    end: string;
  };
  template: string;
} 