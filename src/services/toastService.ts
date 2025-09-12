// src/services/toastService.ts
import { toast, type ToastOptions } from 'react-toastify';

export enum ToastType {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info'
}

class ToastService {
  private defaultOptions: ToastOptions = {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    pauseOnFocusLoss: true,
    rtl: false,
    theme: 'light',
  };

  success(message: string, options?: ToastOptions) {
    return toast.success(message, { ...this.defaultOptions, ...options });
  }

  error(message: string, options?: ToastOptions) {
    return toast.error(message, { ...this.defaultOptions, ...options });
  }

  warning(message: string, options?: ToastOptions) {
    return toast.warning(message, { ...this.defaultOptions, ...options });
  }

  info(message: string, options?: ToastOptions) {
    return toast.info(message, { ...this.defaultOptions, ...options });
  }

  // Work Order specific toast messages
  workOrderCreated(workOrderNumber: string) {
    return this.success(`Work Order #${workOrderNumber} created successfully!`);
  }

  workOrderUpdated(workOrderNumber: string) {
    return this.success(`Work Order #${workOrderNumber} updated successfully!`);
  }

  workOrderDeleted(workOrderNumber: string) {
    return this.success(`Work Order #${workOrderNumber} deleted successfully!`);
  }

  workOrderCreationFailed(error?: string) {
    return this.error(error || 'Failed to create work order. Please try again.');
  }

  workOrderUpdateFailed(error?: string) {
    return this.error(error || 'Failed to update work order. Please try again.');
  }

  workOrderDeleteFailed(error?: string) {
    return this.error(error || 'Failed to delete work order. Please try again.');
  }

  workOrderSearchFailed(error?: string) {
    return this.error(error || 'Failed to search work orders. Please try again.');
  }

  workOrderLoadFailed(error?: string) {
    return this.error(error || 'Failed to load work orders. Please try again.');
  }

  // Status update specific
  statusUpdated(workOrderNumber: string, status: string) {
    return this.success(`Work Order #${workOrderNumber} status updated to ${status.replace('_', ' ')}`);
  }

  statusUpdateFailed(error?: string) {
    return this.error(error || 'Failed to update work order status. Please try again.');
  }

  // Assignment specific
  workOrderAssigned(workOrderNumber: string, assigneeName?: string) {
    const message = assigneeName 
      ? `Work Order #${workOrderNumber} assigned to ${assigneeName}`
      : `Work Order #${workOrderNumber} assigned successfully`;
    return this.success(message);
  }

  assignmentFailed(error?: string) {
    return this.error(error || 'Failed to assign work order. Please try again.');
  }

  // Data loading
  dataLoadSuccess(dataType: string, count?: number) {
    const message = count !== undefined 
      ? `${count} ${dataType} loaded successfully`
      : `${dataType} loaded successfully`;
    return this.info(message, { autoClose: 3000 });
  }

  dataLoadFailed(dataType: string, error?: string) {
    return this.error(error || `Failed to load ${dataType}. Please try again.`);
  }

  // Validation errors
  validationError(message: string) {
    return this.warning(message, { autoClose: 7000 });
  }

  // Network/connectivity
  networkError() {
    return this.error('Network error. Please check your connection and try again.', { autoClose: 8000 });
  }

  // Generic confirmation
  operationSuccess(operation: string) {
    return this.success(`${operation} completed successfully!`);
  }

  operationFailed(operation: string, error?: string) {
    return this.error(error || `${operation} failed. Please try again.`);
  }

  // Utility methods
  dismiss(toastId?: string | number) {
    if (toastId) {
      toast.dismiss(toastId);
    } else {
      toast.dismiss();
    }
  }

  dismissAll() {
    toast.dismiss();
  }

  // Check if toast is active
  isActive(toastId: string | number) {
    return toast.isActive(toastId);
  }
}

// Create a singleton instance
export const toastService = new ToastService();