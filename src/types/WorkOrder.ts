// types/WorkOrder.ts
export interface WorkOrder {
    id: string;
    title: string;
    customer: string;
    vehicle: string;
    year: number;
    estimateNumber: string;
    amount: number;
    hours: {
      left: number;
      billed: number;
    };
    tags: string[];
    status: 'opened' | 'estimate-sent' | 'in-progress' | 'invoiced' | 'closed';
    assignedPeople?: {
      id: string;
      name: string;
      profilePhoto: string;
    }[];
  }