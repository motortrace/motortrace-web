export interface JobCard {
  id: string;
  customer: string;
  vehicle: string;
  status: 'opened' | 'estimate_sent' | 'approved' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
  jobServices: JobService[];
}

export interface JobService {
  id: string;
  jobCardId: string;
  serviceId: string;
  serviceName: string;
  estimatedDuration: number; // in minutes
  requiredSkill: string;
  technicianId: string | null;
  scheduledStart: Date | null;
  scheduledEnd: Date | null;
  status: 'pending' | 'assigned' | 'in_progress' | 'completed';
  notes?: string;
}

export interface Technician {
  id: string;
  name: string;
  skills: string[];
  workingHours: {
    start: string; // e.g., "09:00"
    end: string;   // e.g., "18:00"
  };
  dailyCapacity: number; // max concurrent jobs
  color: string; // for calendar display
  isActive: boolean;
}

export interface Service {
  id: string;
  name: string;
  category: string;
  estimatedDuration: number; // in minutes
  requiredSkill: string;
} 