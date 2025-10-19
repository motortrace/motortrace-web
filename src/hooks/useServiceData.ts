// src/hooks/useServiceData.ts
import { useState, useEffect } from 'react';
import type { Service, Package, CreateServiceRequest, UpdateServiceRequest, CreatePackageRequest, UpdatePackageRequest } from '../types/ServicesAndPackages';
import { laborService } from '../services/laborService';
import { cannedServiceService } from '../services/cannedServiceService';

export const useServiceData = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = async () => {
    try {
      const data = await laborService.getServices();
      setServices(data);
    } catch (err: any) {
      console.error('Error fetching services:', err);
      throw err; // Re-throw to be caught by fetchAllData
    }
  };

  const fetchPackages = async () => {
    try {
      const data = await cannedServiceService.getPackages();
      setPackages(data);
    } catch (err: any) {
      console.error('Error fetching packages:', err);
      throw err; // Re-throw to be caught by fetchAllData
    }
  };

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null); // Clear previous errors
      await Promise.all([fetchServices(), fetchPackages()]);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch data');
      console.error('Error in fetchAllData:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Service operations
  const addService = async (serviceData: CreateServiceRequest): Promise<void> => {
    try {
      const newService = await laborService.createService(serviceData);
      setServices(prev => [...prev, newService]);
    } catch (err: any) {
      throw new Error(err.message || 'Failed to create service');
    }
  };

  const updateService = async (id: string, serviceData: UpdateServiceRequest): Promise<void> => {
    try {
      const updatedService = await laborService.updateService(id, serviceData);
      setServices(prev => prev.map(service => 
        service.id === id ? updatedService : service
      ));
    } catch (err: any) {
      throw new Error(err.message || 'Failed to update service');
    }
  };

  const deleteService = async (id: string): Promise<void> => {
    try {
      await laborService.deleteService(id);
      setServices(prev => prev.filter(service => service.id !== id));
    } catch (err: any) {
      throw new Error(err.message || 'Failed to delete service');
    }
  };

  // Package operations
  const addPackage = async (packageData: CreatePackageRequest): Promise<void> => {
    try {
      const newPackage = await cannedServiceService.createPackage(packageData);
      setPackages(prev => [...prev, newPackage]);
    } catch (err: any) {
      throw new Error(err.message || 'Failed to create package');
    }
  };

  const updatePackage = async (id: string, packageData: UpdatePackageRequest): Promise<void> => {
    try {
      const updatedPackage = await cannedServiceService.updatePackage(id, packageData);
      setPackages(prev => prev.map(pkg => 
        pkg.id === id ? updatedPackage : pkg
      ));
    } catch (err: any) {
      throw new Error(err.message || 'Failed to update package');
    }
  };

  const deletePackage = async (id: string): Promise<void> => {
    try {
      await cannedServiceService.deletePackage(id);
      setPackages(prev => prev.filter(pkg => pkg.id !== id));
    } catch (err: any) {
      throw new Error(err.message || 'Failed to delete package');
    }
  };

  const togglePackageAvailability = async (id: string): Promise<void> => {
    try {
      const updatedPackage = await cannedServiceService.toggleAvailability(id);
      setPackages(prev => prev.map(pkg => 
        pkg.id === id ? updatedPackage : pkg
      ));
    } catch (err: any) {
      throw new Error(err.message || 'Failed to toggle package availability');
    }
  };

  return {
    services,
    packages,
    loading,
    error,
    addService,
    updateService,
    deleteService,
    addPackage,
    updatePackage,
    deletePackage,
    togglePackageAvailability,
    refreshData: fetchAllData,
  };
};