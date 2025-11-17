import { Injectable } from '@angular/core';
import { PetMaintenance, Pet, Vaccine, VetAppointment, Reminder, MaintenanceCategory } from '../models/maintenance.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class PetMaintenanceService {
  private readonly STORAGE_KEY = 'pet_maintenances';
  private petMaintenances: PetMaintenance[] = [];

  constructor(private storage: StorageService) {
    this.loadData();
  }

  async loadData(): Promise<void> {
    const data = await this.storage.get<PetMaintenance[]>(this.STORAGE_KEY);
    this.petMaintenances = data || [];
  }

  async getAll(): Promise<PetMaintenance[]> {
    return this.petMaintenances;
  }

  async getById(id: string): Promise<PetMaintenance | undefined> {
    return this.petMaintenances.find(p => p.id === id);
  }

  async create(petData: Omit<PetMaintenance, 'id' | 'createdAt' | 'updatedAt'>): Promise<PetMaintenance> {
    const newPet: PetMaintenance = {
      ...petData,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.petMaintenances.push(newPet);
    await this.storage.set(this.STORAGE_KEY, this.petMaintenances);
    return newPet;
  }

  async update(id: string, petData: Partial<PetMaintenance>): Promise<PetMaintenance | null> {
    const index = this.petMaintenances.findIndex(p => p.id === id);
    if (index !== -1) {
      this.petMaintenances[index] = {
        ...this.petMaintenances[index],
        ...petData,
        updatedAt: new Date()
      };
      await this.storage.set(this.STORAGE_KEY, this.petMaintenances);
      return this.petMaintenances[index];
    }
    return null;
  }

  async delete(id: string): Promise<boolean> {
    const index = this.petMaintenances.findIndex(p => p.id === id);
    if (index !== -1) {
      this.petMaintenances.splice(index, 1);
      await this.storage.set(this.STORAGE_KEY, this.petMaintenances);
      return true;
    }
    return false;
  }

  async addVaccine(petId: string, vaccine: Omit<Vaccine, 'id'>): Promise<PetMaintenance | null> {
    const pet = this.petMaintenances.find(p => p.id === petId);
    if (pet) {
      const newVaccine: Vaccine = {
        ...vaccine,
        id: this.generateId('vaccine')
      };
      pet.vaccines.push(newVaccine);
      pet.updatedAt = new Date();
      await this.storage.set(this.STORAGE_KEY, this.petMaintenances);
      return pet;
    }
    return null;
  }

  async addVetAppointment(petId: string, appointment: Omit<VetAppointment, 'id'>): Promise<PetMaintenance | null> {
    const pet = this.petMaintenances.find(p => p.id === petId);
    if (pet) {
      const newAppointment: VetAppointment = {
        ...appointment,
        id: this.generateId('appointment')
      };
      pet.vetAppointments.push(newAppointment);
      pet.updatedAt = new Date();
      await this.storage.set(this.STORAGE_KEY, this.petMaintenances);
      return pet;
    }
    return null;
  }

  async addReminder(petId: string, reminder: Omit<Reminder, 'id' | 'createdAt' | 'category'>): Promise<PetMaintenance | null> {
    const pet = this.petMaintenances.find(p => p.id === petId);
    if (pet) {
      const newReminder: Reminder = {
        ...reminder,
        id: this.generateId('reminder'),
        category: MaintenanceCategory.PET,
        createdAt: new Date()
      };
      pet.reminders.push(newReminder);
      pet.updatedAt = new Date();
      await this.storage.set(this.STORAGE_KEY, this.petMaintenances);
      return pet;
    }
    return null;
  }

  async getUpcomingVaccines(): Promise<Array<{pet: Pet, vaccine: Vaccine}>> {
    const upcoming: Array<{pet: Pet, vaccine: Vaccine}> = [];
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    this.petMaintenances.forEach(petMaintenance => {
      petMaintenance.vaccines.forEach(vaccine => {
        if (vaccine.nextApplicationDate && 
            new Date(vaccine.nextApplicationDate) <= thirtyDaysFromNow) {
          upcoming.push({ pet: petMaintenance.pet, vaccine });
        }
      });
    });

    return upcoming;
  }

  private generateId(prefix: string = 'pet'): string {
    return prefix + '_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
}
