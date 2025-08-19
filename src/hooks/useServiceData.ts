import { useState } from 'react';
import type { Service, Package } from '../types/ServicesAndPackages';
import fullBodyWash from '../assets/images/serviceListings/serviceImages/carFullBodyWash.jpg'
import engineTuneUp from '../assets/images/serviceListings/serviceImages/engineTuneUp.jpg'
import interiorDetailing from '../assets/images/serviceListings/serviceImages/interiorDetailing.jpg'

// Mock Data
const initialServices: Service[] = [
  {
    id: '1',
    name: 'Full Body Wash',
    shortDescription: 'Complete exterior wash with premium soap and wax',
    detailedDescription: 'Our comprehensive full body wash service includes pre-wash inspection, foam application, hand washing, wheel cleaning, and protective wax coating to give your vehicle a showroom shine.',
    price: 2500,
    duration: '45 minutes',
    image: fullBodyWash,
    isAvailable: true,
    warranty: '7-day shine guarantee',
    whatsIncluded: ['Exterior foam wash', 'Hand drying', 'Wheel cleaning', 'Premium wax coating', 'Interior vacuum']
  },
  {
    id: '2',
    name: 'Interior Detailing',
    shortDescription: 'Deep cleaning and conditioning of vehicle interior',
    detailedDescription: 'Thorough interior detailing service covering seat cleaning, dashboard conditioning, carpet shampooing, and leather treatment to restore your vehicle\'s interior to pristine condition.',
    price: 5000,
    duration: '1.5-2 hours',
    image: interiorDetailing,
    isAvailable: true,
    warranty: '14-day freshness guarantee',
    whatsIncluded: ['Seat deep cleaning', 'Dashboard conditioning', 'Carpet shampooing', 'Window cleaning', 'Air freshening']
  },
  {
    id: '3',
    name: 'Engine Tune-Up',
    shortDescription: 'Complete engine diagnostic and performance optimization',
    detailedDescription: 'Professional engine tune-up service including diagnostic scan, oil change, filter replacements, spark plug inspection, and performance optimization to keep your engine running smoothly.',
    price: 7500,
    duration: '2-3 hours',
    image: engineTuneUp,
    isAvailable: true,
    warranty: '30-day performance guarantee',
    whatsIncluded: ['Engine diagnostic scan', 'Oil and filter change', 'Spark plug inspection', 'Air filter replacement', 'Performance report']
  }
];

const initialPackages: Package[] = [
  {
    id: '1',
    name: 'Complete Care Package',
    description: 'Full service package including wash, interior detailing, and basic maintenance',
    price: 12000,
    serviceIds: ['1', '3'],
    image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=300&fit=crop'
  },
  {
    id: '2',
    name: 'Premium Service Package',
    description: 'All-inclusive package with wash, detailing, and complete engine tune-up',
    price: 18000,
    serviceIds: ['1', '2', '3'],
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=300&fit=crop'
  }
];

export const useServiceData = () => {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [packages, setPackages] = useState<Package[]>(initialPackages);

  const addService = (newService: Omit<Service, 'id'>) => {
    const service: Service = {
      ...newService,
      id: Date.now().toString()
    };
    setServices(prev => [service, ...prev]);
  };

  const updateService = (id: string, updatedService: Omit<Service, 'id'>) => {
    const updated: Service = { ...updatedService, id };
    setServices(prev => prev.map(s => s.id === id ? updated : s));
  };

  const toggleServiceAvailability = (serviceId: string) => {
    setServices(prev => prev.map(s => 
      s.id === serviceId ? {...s, isAvailable: !s.isAvailable} : s
    ));
  };

  const deleteService = (serviceId: string) => {
    setServices(prev => prev.filter(s => s.id !== serviceId));
  };

  const addPackage = (newPackage: Omit<Package, 'id'>) => {
    const pkg: Package = {
      ...newPackage,
      id: Date.now().toString()
    };
    setPackages(prev => [pkg, ...prev]);
  };

  const updatePackage = (id: string, updatedPackage: Omit<Package, 'id'>) => {
    const updated: Package = { ...updatedPackage, id };
    setPackages(prev => prev.map(p => p.id === id ? updated : p));
  };

  const deletePackage = (packageId: string) => {
    setPackages(prev => prev.filter(p => p.id !== packageId));
  };

  return {
    services,
    packages,
    addService,
    updateService,
    toggleServiceAvailability,
    deleteService,
    addPackage,
    updatePackage,
    deletePackage
  };
};