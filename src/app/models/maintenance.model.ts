export enum MaintenanceCategory {
  HOUSE = 'house',
  VEHICLE = 'vehicle',
  HEALTH = 'health',
  PET = 'pet'
}

export enum MaintenanceStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed'
}

export enum MaintenanceFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
  ONE_TIME = 'one_time'
}

export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  uploadDate: Date;
}

export interface HouseMaintenance {
  id: string;
  description: string;
  scheduledDate: Date;
  frequency: MaintenanceFrequency;
  status: MaintenanceStatus;
  priority: Priority;
  notes: string;
  attachments: Attachment[];
  cost?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface VehicleMaintenance {
  id: string;
  vehicleName: string;
  serviceDescription: string;
  maintenanceDate: Date;
  nextMaintenanceDate?: Date;
  currentMileage: number;
  cost: number;
  status: MaintenanceStatus;
  priority: Priority;
  notes: string;
  attachments: Attachment[];
  insuranceExpiryDate?: Date;
  technicalInspectionDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface HealthInsurance {
  id: string;
  type: string;
  startDate: Date;
  expiryDate: Date;
  provider: string;
  coverageNotes: string;
  cost?: number;
  attachments: Attachment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface MedicalStudy {
  id: string;
  studyType: string;
  datePerformed: Date;
  results: string;
  nextAppointment?: Date;
  doctor?: string;
  cost?: number;
  attachments: Attachment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface HealthMaintenance {
  id: string;
  insurances: HealthInsurance[];
  medicalStudies: MedicalStudy[];
  reminders: Reminder[];
}

export interface Pet {
  id: string;
  name: string;
  type: string;
  breed: string;
  birthDate?: Date;
  photo?: string;
}

export interface Vaccine {
  id: string;
  name: string;
  applicationDate: Date;
  nextApplicationDate?: Date;
  veterinarian?: string;
  cost?: number;
  notes: string;
}

export interface VetAppointment {
  id: string;
  date: Date;
  reason: string;
  result: string;
  veterinarian: string;
  cost?: number;
  attachments: Attachment[];
}

export interface PetMaintenance {
  id: string;
  pet: Pet;
  vaccines: Vaccine[];
  vetAppointments: VetAppointment[];
  feedingSchedule: string;
  specialCare: string;
  reminders: Reminder[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Reminder {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  category: MaintenanceCategory;
  isActive: boolean;
  createdAt: Date;
}

export interface MaintenanceReport {
  category: MaintenanceCategory;
  totalCost: number;
  completedCount: number;
  pendingCount: number;
  dateRange: {
    from: Date;
    to: Date;
  };
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}
