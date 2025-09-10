// src/types/ServicesAndPackages.ts
export interface Service {
  id: string;
  code: string;
  name: string;
  description?: string;
  estimatedHours: number;
  hourlyRate: number;
  category?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Package {
  id: string;
  code: string;
  name: string;
  description?: string;
  duration: number; // in minutes
  price: number;
  isAvailable: boolean;
  serviceIds: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateServiceRequest {
  code: string;
  name: string;
  description?: string;
  estimatedHours: number;
  hourlyRate: number;
  category?: string;
  isActive?: boolean;
}

export interface UpdateServiceRequest {
  code?: string;
  name?: string;
  description?: string;
  estimatedHours?: number;
  hourlyRate?: number;
  category?: string;
  isActive?: boolean;
}

export interface CreatePackageRequest {
  code: string;
  name: string;
  description?: string;
  duration: number;
  price: number;
  isAvailable?: boolean;
  serviceIds: string[];
}

export interface UpdatePackageRequest {
  code?: string;
  name?: string;
  description?: string;
  duration?: number;
  price?: number;
  isAvailable?: boolean;
  serviceIds?: string[];
}

export interface ServiceFilters {
  category?: string;
  isActive?: boolean;
  search?: string;
}

export interface PackageFilters {
  isAvailable?: boolean;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}