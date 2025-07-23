// hooks/useJobCardCalculations.ts
import type { ServicePackage } from "../types/jobCard.types";

export const useJobCardCalculations = (services: ServicePackage[]) => {
  const calculateAuthorizedLabor = () => services
    .filter(s => s.authorized)
    .flatMap(s => s.lineItems)
    .filter(li => li.type === 'Labor')
    .reduce((sum, li) => sum + li.netAmount, 0);

  const calculateAuthorizedParts = () => services
    .filter(s => s.authorized)
    .flatMap(s => s.lineItems)
    .filter(li => li.type === 'Part')
    .reduce((sum, li) => sum + li.netAmount, 0);

  const calculateTax = () => {
    const taxableSubtotal = services
      .filter(s => s.authorized)
      .flatMap(s => s.lineItems)
      .filter(li => li.taxable)
      .reduce((sum, li) => sum + li.netAmount, 0);
    return taxableSubtotal * 0.08;
  };

  const calculateTotal = () => {
    return calculateAuthorizedLabor() + calculateAuthorizedParts() + calculateTax();
  };

  const calculateGrandTotal = () => services
    .flatMap(s => s.lineItems)
    .reduce((sum, li) => sum + li.netAmount, 0);

  return {
    calculateAuthorizedLabor,
    calculateAuthorizedParts,
    calculateTax,
    calculateTotal,
    calculateGrandTotal
  };
};