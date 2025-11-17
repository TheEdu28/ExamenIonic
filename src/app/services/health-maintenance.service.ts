import { Injectable } from '@angular/core';
import { HealthInsurance, MedicalStudy, Reminder, MaintenanceCategory } from '../models/maintenance.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class HealthMaintenanceService {
  private readonly INSURANCE_KEY = 'health_insurances';
  private readonly STUDIES_KEY = 'medical_studies';
  private readonly REMINDERS_KEY = 'health_reminders';
  
  private insurances: HealthInsurance[] = [];
  private studies: MedicalStudy[] = [];
  private reminders: Reminder[] = [];

  constructor(private storage: StorageService) {
    this.loadData();
  }

  async loadData(): Promise<void> {
    this.insurances = await this.storage.get<HealthInsurance[]>(this.INSURANCE_KEY) || [];
    this.studies = await this.storage.get<MedicalStudy[]>(this.STUDIES_KEY) || [];
    this.reminders = await this.storage.get<Reminder[]>(this.REMINDERS_KEY) || [];
  }

  // Insurance methods
  async getAllInsurances(): Promise<HealthInsurance[]> {
    return this.insurances;
  }

  async createInsurance(insurance: Omit<HealthInsurance, 'id' | 'createdAt' | 'updatedAt'>): Promise<HealthInsurance> {
    const newInsurance: HealthInsurance = {
      ...insurance,
      id: this.generateId('insurance'),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.insurances.push(newInsurance);
    await this.storage.set(this.INSURANCE_KEY, this.insurances);
    return newInsurance;
  }

  async updateInsurance(id: string, insurance: Partial<HealthInsurance>): Promise<HealthInsurance | null> {
    const index = this.insurances.findIndex(i => i.id === id);
    if (index !== -1) {
      this.insurances[index] = {
        ...this.insurances[index],
        ...insurance,
        updatedAt: new Date()
      };
      await this.storage.set(this.INSURANCE_KEY, this.insurances);
      return this.insurances[index];
    }
    return null;
  }

  async deleteInsurance(id: string): Promise<boolean> {
    const index = this.insurances.findIndex(i => i.id === id);
    if (index !== -1) {
      this.insurances.splice(index, 1);
      await this.storage.set(this.INSURANCE_KEY, this.insurances);
      return true;
    }
    return false;
  }

  // Medical Studies methods
  async getAllStudies(): Promise<MedicalStudy[]> {
    return this.studies;
  }

  async createStudy(study: Omit<MedicalStudy, 'id' | 'createdAt' | 'updatedAt'>): Promise<MedicalStudy> {
    const newStudy: MedicalStudy = {
      ...study,
      id: this.generateId('study'),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.studies.push(newStudy);
    await this.storage.set(this.STUDIES_KEY, this.studies);
    return newStudy;
  }

  async updateStudy(id: string, study: Partial<MedicalStudy>): Promise<MedicalStudy | null> {
    const index = this.studies.findIndex(s => s.id === id);
    if (index !== -1) {
      this.studies[index] = {
        ...this.studies[index],
        ...study,
        updatedAt: new Date()
      };
      await this.storage.set(this.STUDIES_KEY, this.studies);
      return this.studies[index];
    }
    return null;
  }

  async deleteStudy(id: string): Promise<boolean> {
    const index = this.studies.findIndex(s => s.id === id);
    if (index !== -1) {
      this.studies.splice(index, 1);
      await this.storage.set(this.STUDIES_KEY, this.studies);
      return true;
    }
    return false;
  }

  // Reminders methods
  async getAllReminders(): Promise<Reminder[]> {
    return this.reminders;
  }

  async createReminder(reminder: Omit<Reminder, 'id' | 'createdAt'>): Promise<Reminder> {
    const newReminder: Reminder = {
      ...reminder,
      id: this.generateId('reminder'),
      createdAt: new Date()
    };
    this.reminders.push(newReminder);
    await this.storage.set(this.REMINDERS_KEY, this.reminders);
    return newReminder;
  }

  async deleteReminder(id: string): Promise<boolean> {
    const index = this.reminders.findIndex(r => r.id === id);
    if (index !== -1) {
      this.reminders.splice(index, 1);
      await this.storage.set(this.REMINDERS_KEY, this.reminders);
      return true;
    }
    return false;
  }

  private generateId(prefix: string): string {
    return prefix + '_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
}
