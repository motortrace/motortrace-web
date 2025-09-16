// // src/data/issuancesData.ts
// export interface IssuedPart {
//   id: string;
//   sku?: string;
//   name: string;
//   imageUrl?: string;
//   qty: number;
//   notes?: string;
//   price?: number;
// }

// export interface Issuance {
//   id: string;
//   issuanceNumber: string;
//   dateIssued: string; // ISO-like or display date
//   technicianName: string;
//   recipient?: string; // e.g., workshop/store or customer (used as "To whom")
//   quantity: number; // total quantity issued
//   parts: IssuedPart[];
//   notes?: string;
//   issuedBy?: string; // who created the issuance
//   serviceJob?: string;
//   carDetails?: string;
// }

// export const issuances: Issuance[] = [
//   {
//     id: "1",
//     issuanceNumber: "ISS-2001",
//     dateIssued: "2025-07-05",
//     technicianName: "K. Perera",
//     recipient: "AutoFix Garage (Job: Side Mirror Replacement)",
//     quantity: 2,
//     issuedBy: "Inventory Manager - A. Silva",
//     parts: [
//       { id: "p-001", sku: "BP-100", name: "Brake Pads", imageUrl: "/assets/images/brakePads.png", qty: 1 },
//       { id: "p-002", sku: "BAT-45", name: "Battery 45Ah", imageUrl: "/assets/images/battery.png", qty: 1 },
//     ],
//     notes: "Issued for front left brake replacement and battery swap. Technician confirmed fitment.",
//   },
//   {
//     id: "2",
//     issuanceNumber: "ISS-2002",
//     dateIssued: "2025-07-05",
//     technicianName: "S. Fernando",
//     recipient: "Customer: L. Weerasinghe (Oil Change)",
//     quantity: 1,
//     issuedBy: "Inventory Manager - R. Dissanayake",
//     parts: [
//       { id: "p-003", sku: "AF-200", name: "Air Filter", imageUrl: "https://via.placeholder.com/60", qty: 1 },
//     ],
//     notes: "Issued single air filter for routine service.",
//   },
// ];


// src/data/issuancesData.ts
export interface IssuedPart {
  id: number; // Changed from string to number to match SERIAL in database
  issuance_id: number; // Reference to issuances table
  product_id: number; // Reference to products table
  quantity: number;
  notes?: string;
  created_at: string; // TIMESTAMP
  // Optional fields that might be joined from products table
  sku?: string;
  name?: string;
  imageUrl?: string;
  price?: number;
}

export interface Issuance {
  id: number; // Changed from string to number to match SERIAL
  issuance_number: string; // Matches database column name
  date_issued: string; // DATE field
  technician_name: string; // Matches database column name
  recipient?: string;
  issued_by?: string;
  service_job?: string;
  car_details?: string;
  notes?: string;
  total_quantity: number; // DEFAULT 0 in database
  created_at: string; // TIMESTAMP
  updated_at: string; // TIMESTAMP
  // Array of parts for this issuance (will be joined from issuance_parts)
  parts: IssuedPart[];
}

// Sample data that matches your database structure
export const issuances: Issuance[] = [
  {
    id: 1, // SERIAL primary key
    issuance_number: "ISS-2001",
    date_issued: "2025-07-05",
    technician_name: "K. Perera",
    recipient: "AutoFix Garage (Job: Side Mirror Replacement)",
    issued_by: "Inventory Manager - A. Silva",
    service_job: "Side Mirror Replacement",
    car_details: "Toyota Corolla - ABC1234",
    notes: "Issued for front left brake replacement and battery swap. Technician confirmed fitment.",
    total_quantity: 2,
    created_at: "2025-07-05T08:30:00.000Z",
    updated_at: "2025-07-05T08:30:00.000Z",
    parts: [
      { 
        id: 1, 
        issuance_id: 1, 
        product_id: 101, 
        quantity: 1,
        notes: "Front brake pads",
        created_at: "2025-07-05T08:30:00.000Z",
        sku: "BP-100", 
        name: "Brake Pads", 
        imageUrl: "/assets/images/brakePads.png"
      },
      { 
        id: 2, 
        issuance_id: 1, 
        product_id: 102, 
        quantity: 1,
        notes: "45Ah battery",
        created_at: "2025-07-05T08:30:00.000Z",
        sku: "BAT-45", 
        name: "Battery 45Ah", 
        imageUrl: "/assets/images/battery.png"
      },
    ],
  },
  {
    id: 2,
    issuance_number: "ISS-2002",
    date_issued: "2025-07-05",
    technician_name: "S. Fernando",
    recipient: "Customer: L. Weerasinghe (Oil Change)",
    issued_by: "Inventory Manager - R. Dissanayake",
    service_job: "Oil Change Service",
    car_details: "Honda Civic - XYZ5678",
    notes: "Issued single air filter for routine service.",
    total_quantity: 1,
    created_at: "2025-07-05T14:15:00.000Z",
    updated_at: "2025-07-05T14:15:00.000Z",
    parts: [
      { 
        id: 3, 
        issuance_id: 2, 
        product_id: 103, 
        quantity: 1,
        created_at: "2025-07-05T14:15:00.000Z",
        sku: "AF-200", 
        name: "Air Filter", 
        imageUrl: "https://via.placeholder.com/60"
      },
    ],
  },
];