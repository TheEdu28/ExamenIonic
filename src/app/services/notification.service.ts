// src/app/services/notification.service.ts
import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { HouseMaintenanceService } from './house-maintenance.service';
import { VehicleMaintenanceService } from './vehicle-maintenance.service';
import { HealthMaintenanceService } from './health-maintenance.service';
import { PetMaintenanceService } from './pet-maintenance.service';

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: Date;
  category: string;
  read: boolean;
  createdAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly NOTIFICATIONS_KEY = 'notifications';
  private readonly SETTINGS_KEY = 'notification_settings';
  private notifications: Notification[] = [];
  private notificationsEnabled: boolean = true;

  constructor(
    private storage: StorageService,
    private houseService: HouseMaintenanceService,
    private vehicleService: VehicleMaintenanceService,
    private healthService: HealthMaintenanceService,
    private petService: PetMaintenanceService
  ) {
    this.loadNotifications();
    this.loadSettings();
  }

  async loadNotifications(): Promise<void> {
    this.notifications = await this.storage.get<Notification[]>(this.NOTIFICATIONS_KEY) || [];
  }

  async loadSettings(): Promise<void> {
    const settings = await this.storage.get<any>(this.SETTINGS_KEY);
    if (settings) {
      this.notificationsEnabled = settings.enabled !== false;
    }
  }

  async getAllNotifications(): Promise<Notification[]> {
    return this.notifications.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getUnreadCount(): Promise<number> {
    return this.notifications.filter(n => !n.read).length;
  }

  async markAsRead(id: string): Promise<void> {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
      await this.storage.set(this.NOTIFICATIONS_KEY, this.notifications);
    }
  }

  async markAllAsRead(): Promise<void> {
    this.notifications.forEach(n => n.read = true);
    await this.storage.set(this.NOTIFICATIONS_KEY, this.notifications);
  }

  async createNotification(title: string, message: string, category: string, date: Date): Promise<Notification> {
    if (!this.notificationsEnabled) {
      return {} as Notification;
    }

    const notification: Notification = {
      id: this.generateId(),
      title,
      message,
      date,
      category,
      read: false,
      createdAt: new Date()
    };

    this.notifications.push(notification);
    await this.storage.set(this.NOTIFICATIONS_KEY, this.notifications);
    return notification;
  }

  async deleteNotification(id: string): Promise<void> {
    const index = this.notifications.findIndex(n => n.id === id);
    if (index !== -1) {
      this.notifications.splice(index, 1);
      await this.storage.set(this.NOTIFICATIONS_KEY, this.notifications);
    }
  }

  async clearAllNotifications(): Promise<void> {
    this.notifications = [];
    await this.storage.set(this.NOTIFICATIONS_KEY, []);
  }

  async checkUpcomingMaintenances(): Promise<void> {
    if (!this.notificationsEnabled) return;

    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    // Check house maintenances
    const houseMaintenances = await this.houseService.getUpcoming();
    for (const maintenance of houseMaintenances) {
      const scheduledDate = new Date(maintenance.scheduledDate);
      if (scheduledDate <= sevenDaysFromNow && scheduledDate >= now) {
        const daysUntil = Math.ceil((scheduledDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        await this.createNotification(
          'Mantenimiento de Casa Próximo',
          `${maintenance.description} programado en ${daysUntil} día(s)`,
          'Casa',
          scheduledDate
        );
      }
    }

    // Check vehicle maintenances
    const vehicleMaintenances = await this.vehicleService.getUpcoming();
    for (const maintenance of vehicleMaintenances) {
      if (maintenance.nextMaintenanceDate) {
        const nextDate = new Date(maintenance.nextMaintenanceDate);
        if (nextDate <= sevenDaysFromNow && nextDate >= now) {
          const daysUntil = Math.ceil((nextDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          await this.createNotification(
            'Mantenimiento de Vehículo Próximo',
            `${maintenance.vehicleName} - ${maintenance.serviceDescription} en ${daysUntil} día(s)`,
            'Vehículos',
            nextDate
          );
        }
      }
    }

    // Check insurance alerts
    const insuranceAlerts = await this.vehicleService.getInsuranceAlerts();
    for (const alert of insuranceAlerts) {
      if (alert.insuranceExpiryDate) {
        const expiryDate = new Date(alert.insuranceExpiryDate);
        const daysUntil = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        await this.createNotification(
          'Seguro de Vehículo por Vencer',
          `Seguro de ${alert.vehicleName} vence en ${daysUntil} día(s)`,
          'Vehículos',
          expiryDate
        );
      }
    }

    // Check pet vaccines
    const upcomingVaccines = await this.petService.getUpcomingVaccines();
    for (const item of upcomingVaccines) {
      if (item.vaccine.nextApplicationDate) {
        const nextDate = new Date(item.vaccine.nextApplicationDate);
        const daysUntil = Math.ceil((nextDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        await this.createNotification(
          'Vacuna de Mascota Próxima',
          `${item.pet.name} - ${item.vaccine.name} en ${daysUntil} día(s)`,
          'Mascotas',
          nextDate
        );
      }
    }

    // Check health reminders
    const healthReminders = await this.healthService.getAllReminders();
    for (const reminder of healthReminders) {
      if (reminder.isActive) {
        const dueDate = new Date(reminder.dueDate);
        if (dueDate <= sevenDaysFromNow && dueDate >= now) {
          const daysUntil = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          await this.createNotification(
            'Recordatorio de Salud',
            `${reminder.title} - ${reminder.description} en ${daysUntil} día(s)`,
            'Salud',
            dueDate
          );
        }
      }
    }
  }

  async setNotificationsEnabled(enabled: boolean): Promise<void> {
    this.notificationsEnabled = enabled;
    await this.storage.set(this.SETTINGS_KEY, { enabled });
  }

  isNotificationsEnabled(): boolean {
    return this.notificationsEnabled;
  }

  private generateId(): string {
    return 'notif_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
}