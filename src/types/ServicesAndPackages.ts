export interface Service {
  id: string;
  name: string;
  shortDescription: string;
  detailedDescription: string;
  price: number;
  duration: string;
  image: string;
  isAvailable: boolean;
  warranty?: string;
  whatsIncluded: string[];
}

export interface Package {
  id: string;
  name: string;
  description: string;
  price: number;
  serviceIds: string[];
  image: string;
}

export interface ServiceFormData {
  name: string;
  shortDescription: string;
  detailedDescription: string;
  price: string;
  duration: string;
  image: string;
  warranty: string;
  whatsIncluded: string;
}

export interface PackageFormData {
  name: string;
  description: string;
  price: string;
  serviceIds: string[];
  image: string;
}