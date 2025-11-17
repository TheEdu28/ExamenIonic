import { Injectable } from '@angular/core';
import { HouseMaintenance, MaintenanceStatus, MaintenanceFrequency, Priority } from '../models/maintenance.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class HouseMaintenanceService {
  private readonly STORAGE_KEY = 'house_maintenances';
  private maintenances: HouseMaintenance[] = [];

  constructor(private storage: StorageService) {
    this.loadMaintenances();
  }

  async loadMaintenances(): Promise<void> {
    const data = await this.storage.get<HouseMaintenance[]>(this.STORAGE_KEY);
    this.maintenances = data || [];
  }

  async getAll(): Promise<HouseMaintenance[]> {
    return this.maintenances;
  }

  async getById(id: string): Promise<HouseMaintenance | undefined> {
    return this.maintenances.find(m => m.id === id);
  }

  async create(maintenance: Omit<HouseMaintenance, 'id' | 'createdAt' | 'updatedAt'>): Promise<HouseMaintenance> {
    const newMaintenance: HouseMaintenance = {
      ...maintenance,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.maintenances.push(newMaintenance);
    await this.storage.set(this.STORAGE_KEY, this.maintenances);
    return newMaintenance;
  }

  async update(id: string, maintenance: Partial<HouseMaintenance>): Promise<HouseMaintenance | null> {
    const index = this.maintenances.findIndex(m => m.id === id);
    if (index !== -1) {
      this.maintenances[index] = {
        ...this.maintenances[index],
        ...maintenance,
        updatedAt: new Date()
      };
      await this.storage.set(this.STORAGE_KEY, this.maintenances);
      return this.maintenances[index];
    }
    return null;
  }

  async delete(id: string): Promise<boolean> {
    const index = this.maintenances.findIndex(m => m.id === id);
    if (index !== -1) {
      this.maintenances.splice(index, 1);
      await this.storage.set(this.STORAGE_KEY, this.maintenances);
      return true;
    }
    return false;
  }

  async getUpcoming(): Promise<HouseMaintenance[]> {
    const now = new Date();
    return this.maintenances.filter(m => 
      new Date(m.scheduledDate) >= now && 
      m.status !== MaintenanceStatus.COMPLETED
    ).sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime());
  }

  async getPending(): Promise<HouseMaintenance[]> {
    return this.maintenances.filter(m => m.status === MaintenanceStatus.PENDING);
  }

  private generateId(): string {
    return 'house_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
}
