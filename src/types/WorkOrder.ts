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
    image: string;
    status: 'estimates' | 'approved' | 'in-progress' | 'completed';
  }