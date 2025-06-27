export interface LineItem {
    id: string;
    type: 'Labor' | 'Part' | 'Note';
    name: string;
    description: string;
    cost: number;
    price: number;
    quantity: number;
    hours: number;
    amount: number;
    discount: number;
    netAmount: number;
    taxable: boolean;
    status: 'pending' | 'approved' | 'in-progress' | 'completed' | 'declined';
  }
  
  export interface ServicePackage {
    id: string;
    name: string;
    authorized: boolean;
    note: string;
    lineItems: LineItem[];
  }
  
  export interface PartItem {
    id: string;
    partNumber: string;
    name: string;
    description: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    supplier: string;
    availability: 'in-stock' | 'order-required' | 'backordered';
    expectedDelivery?: string;
    markup: number;
  }