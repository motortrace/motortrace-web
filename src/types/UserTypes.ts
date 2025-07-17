export interface BaseUser {
  id: string;
  userType: 'car_user' | 'service_center' | 'spare_parts_seller';
  status: 'active' | 'suspended';
  dateJoined: string;
  email: string;
  phoneNumber: string;
}

export interface CarUser extends BaseUser {
  userType: 'car_user';
  name: string;
  profilePicture?: string | null;
  vehicles: Vehicle[];
  totalBookings: number;
  totalPosts: number;
}

export interface ServiceCenter extends BaseUser {
  userType: 'service_center';
  businessName: string;
  businessLogo?: string | null;
  contactPersonName: string;
  location: string;
  operatingHours: string;
  totalServices: number;
  completedServices: number;
  averageRating: number;
  services: Service[];
}

export interface SparePartsSeller extends BaseUser {
  userType: 'spare_parts_seller';
  businessName: string;
  businessLogo?: string | null;
  contactPersonName: string;
  shopLocation: string;
  operatingHours: string;
  totalPartsListed: number;
  parts: SparePart[];
}

export interface Vehicle {
  id: string;
  make: string;
  brand: string;
  year: number;
  model?: string;
}

export interface Service {
  id: string;
  name: string;
  category: string;
  description: string;
  estimatedPrice: number;
  estimatedCompletionTime: string;
  status: 'active' | 'inactive';
}

export interface SparePart {
  id: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  stockQuantity: number;
  status: 'in_stock' | 'out_of_stock' | 'low_stock';
}

export type User = CarUser | ServiceCenter | SparePartsSeller;