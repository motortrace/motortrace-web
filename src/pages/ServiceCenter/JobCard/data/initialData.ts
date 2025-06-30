import type { ServicePackage, PartItem } from '../types/jobCard.types';

export const initialServices: ServicePackage[] = [
  {
    id: 'service-1',
    name: 'Standard Oil Change Service',
    authorized: false,
    note: 'Customer requested standard 5W-30 synthetic oil. Also check tire pressure.',
    lineItems: [
      {
        id: 'li-1',
        type: 'Labor',
        name: 'Oil & Filter Change',
        description: 'Replace engine oil and filter.',
        cost: 0,
        price: 120.00,
        quantity: 0.5,
        hours: 0.5,
        amount: 60.00,
        discount: 0,
        netAmount: 60.00,
        taxable: false,
        status: 'pending'
      },
      {
        id: 'li-2',
        type: 'Part',
        name: 'OEM Engine Oil Filter',
        description: 'Part #OF-001',
        cost: 8.00,
        price: 15.00,
        quantity: 1,
        hours: 0,
        amount: 15.00,
        discount: 0,
        netAmount: 15.00,
        taxable: true,
        status: 'pending'
      },
      {
        id: 'li-3',
        type: 'Part',
        name: '5W-30 Synthetic Engine Oil',
        description: '5 Quarts',
        cost: 25.00,
        price: 45.00,
        quantity: 1,
        hours: 0,
        amount: 45.00,
        discount: 0,
        netAmount: 45.00,
        taxable: true,
        status: 'pending'
      }
    ]
  },
  {
    id: 'service-2',
    name: 'Brake Inspection',
    authorized: true,
    note: 'Customer reports grinding noise from front right.',
    lineItems: [
      {
        id: 'li-4',
        type: 'Labor',
        name: 'Complete Brake System Inspection',
        description: 'Inspect pads, rotors, calipers, and fluid.',
        cost: 0,
        price: 120.00,
        quantity: 1.0,
        hours: 1.0,
        amount: 120.00,
        discount: 0,
        netAmount: 120.00,
        taxable: false,
        status: 'in-progress'
      }
    ]
  }
];

export const partItems: PartItem[] = [
  {
    id: '1',
    partNumber: 'OF-001',
    name: 'Engine Oil Filter',
    description: 'OEM oil filter',
    quantity: 1,
    unitPrice: 15.00,
    totalPrice: 15.00,
    supplier: 'AutoParts Direct',
    availability: 'in-stock',
    markup: 1.3
  },
  {
    id: '2',
    partNumber: 'BP-205',
    name: 'Brake Pads - Front Set',
    description: 'Ceramic brake pads',
    quantity: 1,
    unitPrice: 85.00,
    totalPrice: 85.00,
    supplier: 'Brake Specialists',
    availability: 'order-required',
    expectedDelivery: '2024-03-15',
    markup: 1.4
  }
];

export const customerComplaint = "Customer states there is a 'grinding noise' coming from the front right wheel when braking. Also mentions the vehicle pulls to the right on the highway.";
export const vehicleImageUrl = "https://i.redd.it/f0v56ae4s8ce1.png";
export const customerImageUrl = "https://i.pravatar.cc/150?u=a042581f4e29026704d";
export const vehicleArrival = "Mar 1, 2024, 10:30 AM";
export const personalItems = "Sunglasses on dashboard, baby seat in the back.";
