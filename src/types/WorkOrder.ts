// types/WorkOrder.ts
export interface WorkOrder {
    id: string;
    title: string;
    customer: string;
    vehicle: string;
    year: number;
    estimateNumber?: string;
    amount: number;
    paidAmount?: number; // Total amount paid
    hours: {
      left: number;
      billed: number;
    };
    tags: string[];
    status: 'opened' | 'in-progress' | 'on-hold' | 'completed';
    isApproved?: boolean; // Flag to indicate if estimate is approved
    image?: string;
    assignedPeople?: {
      id: string;
      name: string;
      profilePhoto: string;
    }[];
    source?: 'WALK_IN' | 'APPOINTMENT' | 'PHONE' | 'ONLINE' | 'OTHER';
  }