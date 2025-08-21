// src/data/issuancesData.ts
export interface IssuedPart {
  id: string;
  sku?: string;
  name: string;
  imageUrl?: string;
  qty: number;
  notes?: string;
}

export interface Issuance {
  id: string;
  issuanceNumber: string;
  dateIssued: string; // ISO-like or display date
  technicianName: string;
  recipient?: string; // e.g., workshop/store or customer (used as "To whom")
  quantity: number; // total quantity issued
  parts: IssuedPart[];
  notes?: string;
  issuedBy?: string; // who created the issuance
}

export const issuances: Issuance[] = [
  {
    id: "1",
    issuanceNumber: "ISS-2001",
    dateIssued: "2025-07-05",
    technicianName: "K. Perera",
    recipient: "AutoFix Garage (Job: Side Mirror Replacement)",
    quantity: 2,
    issuedBy: "Inventory Manager - A. Silva",
    parts: [
      { id: "p-001", sku: "BP-100", name: "Brake Pads", imageUrl: "/assets/images/brakePads.png", qty: 1 },
      { id: "p-002", sku: "BAT-45", name: "Battery 45Ah", imageUrl: "/assets/images/battery.png", qty: 1 },
    ],
    notes: "Issued for front left brake replacement and battery swap. Technician confirmed fitment.",
  },
  {
    id: "2",
    issuanceNumber: "ISS-2002",
    dateIssued: "2025-07-05",
    technicianName: "S. Fernando",
    recipient: "Customer: L. Weerasinghe (Oil Change)",
    quantity: 1,
    issuedBy: "Inventory Manager - R. Dissanayake",
    parts: [
      { id: "p-003", sku: "AF-200", name: "Air Filter", imageUrl: "https://via.placeholder.com/60", qty: 1 },
    ],
    notes: "Issued single air filter for routine service.",
  },
];
