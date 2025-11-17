import { Injectable } from '@angular/core';
import { VehicleMaintenance, MaintenanceStatus, Priority } from '../models/maintenance.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class VehicleMaintenanceService {
  private readonly STORAGE_KEY = 'vehicle_maintenances';
  private maintenances: VehicleMaintenance[] = [];

  constructor(private storage: StorageService) {
    this.loadMaintenances();
  }

  async loadMaintenances(): Promise<void> {
    const data = await this.storage.get<VehicleMaintenance[]>(this.STORAGE_KEY);
    this.maintenances = data || [];
  }

  async getAll(): Promise<VehicleMaintenance[]> {
    return this.maintenances;
  }

  async getById(id: string): Promise<VehicleMaintenance | undefined> {
    return this.maintenances.find(m => m.id === id);
  }

  async create(maintenance: Omit<VehicleMaintenance, 'id' | 'createdAt' | 'updatedAt'>): Promise<VehicleMaintenance> {
    const newMaintenance: VehicleMaintenance = {
      ...maintenance,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.maintenances.push(newMaintenance);
    await this.storage.set(this.STORAGE_KEY, this.maintenances);
    return newMaintenance;
  }

  async update(id: string, maintenance: Partial<VehicleMaintenance>): Promise<VehicleMaintenance | null> {
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

  async getUpcoming(): Promise<VehicleMaintenance[]> {
    const now = new Date();
    return this.maintenances.filter(m => 
      m.nextMaintenanceDate && 
      new Date(m.nextMaintenanceDate) >= now && 
      m.status !== MaintenanceStatus.COMPLETED
    ).sort((a, b) => {
      if (!a.nextMaintenanceDate || !b.nextMaintenanceDate) return 0;
      return new Date(a.nextMaintenanceDate).getTime() - new Date(b.nextMaintenanceDate).getTime();
    });
  }

  async getInsuranceAlerts(): Promise<VehicleMaintenance[]> {
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    return this.maintenances.filter(m => 
      m.insuranceExpiryDate && 
      new Date(m.insuranceExpiryDate) <= thirtyDaysFromNow
    );
  }

  private generateId(): string {
    return 'vehicle_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
}
