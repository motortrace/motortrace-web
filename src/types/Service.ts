export interface Service {
  id: string;
  code: string;
  name: string;
  description: string;
  duration: number;
  price: string;
  isAvailable: boolean;
  variantLabel: string;
  vehicleType: string;
  hasOptionalParts: boolean;
  hasOptionalLabor: boolean;
  category: string;
  minVehicleAge: number | null;
  maxVehicleMileage: number | null;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  laborOperations: any[];
  serviceIds: string[];
}