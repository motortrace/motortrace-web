// src/types/WorkOrderTypes/enums.ts
export enum WorkOrderStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  ON_HOLD = 'ON_HOLD'
}

export enum JobType {
  REPAIR = 'REPAIR',
  MAINTENANCE = 'MAINTENANCE',
  INSPECTION = 'INSPECTION',
  WARRANTY = 'WARRANTY',
  RECALL = 'RECALL'
}

export enum JobPriority {
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

export enum JobSource {
  WALK_IN = 'WALK_IN',
  APPOINTMENT = 'APPOINTMENT',
  PHONE = 'PHONE',
  ONLINE = 'ONLINE',
  REFERRAL = 'REFERRAL'
}

export enum WarrantyStatus {
  NONE = 'NONE',
  MANUFACTURER = 'MANUFACTURER',
  EXTENDED = 'EXTENDED',
  THIRD_PARTY = 'THIRD_PARTY'
}

export enum WorkflowStep {
  RECEIVED = 'RECEIVED',
  INSPECTION = 'INSPECTION',
  DIAGNOSIS = 'DIAGNOSIS',
  ESTIMATE = 'ESTIMATE',
  APPROVAL = 'APPROVAL',
  WORK_IN_PROGRESS = 'WORK_IN_PROGRESS',
  QUALITY_CHECK = 'QUALITY_CHECK',
  COMPLETED = 'COMPLETED',
  INVOICED = 'INVOICED',
  PAID = 'PAID'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PARTIALLY_PAID = 'PARTIALLY_PAID',
  PAID = 'PAID',
  REFUNDED = 'REFUNDED',
  CANCELLED = 'CANCELLED'
}

export enum ServiceStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum PartSource {
  INVENTORY = 'INVENTORY',
  ORDERED = 'ORDERED',
  CUSTOMER_SUPPLIED = 'CUSTOMER_SUPPLIED'
}

export enum PaymentMethod {
  CASH = 'CASH',
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  CHECK = 'CHECK',
  BANK_TRANSFER = 'BANK_TRANSFER',
  DIGITAL_WALLET = 'DIGITAL_WALLET'
}

export enum ApprovalStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED'
}

export enum ApprovalMethod {
  IN_PERSON = 'IN_PERSON',
  PHONE = 'PHONE',
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  DIGITAL_SIGNATURE = 'DIGITAL_SIGNATURE'
}

export enum ChecklistStatus {
  PASS = 'PASS',
  FAIL = 'FAIL',
  WARNING = 'WARNING',
  NOT_APPLICABLE = 'NOT_APPLICABLE',
  PENDING = 'PENDING'
}

export enum TirePosition {
  FRONT_LEFT = 'FRONT_LEFT',
  FRONT_RIGHT = 'FRONT_RIGHT',
  REAR_LEFT = 'REAR_LEFT',
  REAR_RIGHT = 'REAR_RIGHT',
  SPARE = 'SPARE'
}

export enum AttachmentCategory {
  INSPECTION_PHOTO = 'INSPECTION_PHOTO',
  DAMAGE_PHOTO = 'DAMAGE_PHOTO',
  BEFORE_PHOTO = 'BEFORE_PHOTO',
  AFTER_PHOTO = 'AFTER_PHOTO',
  DOCUMENT = 'DOCUMENT',
  INVOICE = 'INVOICE',
  RECEIPT = 'RECEIPT',
  WARRANTY = 'WARRANTY',
  OTHER = 'OTHER'
}