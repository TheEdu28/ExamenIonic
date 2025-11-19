// src/app/pages/notifications/notifications.page.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController } from '@ionic/angular';
import { NotificationService, Notification } from '../../services/notification.service';
import { addIcons } from 'ionicons';
import { trashOutline, checkmarkDoneOutline } from 'ionicons/icons';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class NotificationsPage implements OnInit {
  notifications: Notification[] = [];

  constructor(
    private notificationService: NotificationService,
    private alertController: AlertController
  ) {
    addIcons({ trashOutline, checkmarkDoneOutline });
  }

  async ngOnInit() {
    await this.loadNotifications();
  }

  async ionViewWillEnter() {
    await this.loadNotifications();
  }

  async loadNotifications() {
    this.notifications = await this.notificationService.getAllNotifications();
  }

  async markAsRead(id: string) {
    await this.notificationService.markAsRead(id);
    await this.loadNotifications();
  }

  async markAllAsRead() {
    await this.notificationService.markAllAsRead();
    await this.loadNotifications();
  }

  async deleteNotification(id: string) {
    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: '¿Desea eliminar esta notificación?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: async () => {
            await this.notificationService.deleteNotification(id);
            await this.loadNotifications();
          }
        }
      ]
    });

    await alert.present();
  }

  async clearAll() {
    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: '¿Desea eliminar todas las notificaciones?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar Todo',
          handler: async () => {
            await this.notificationService.clearAllNotifications();
            await this.loadNotifications();
          }
        }
      ]
    });

    await alert.present();
  }

  getDaysUntil(date: Date): number {
    const now = new Date();
    const targetDate = new Date(date);
    const diff = targetDate.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  getNotificationColor(notification: Notification): string {
    const daysUntil = this.getDaysUntil(notification.date);
    if (daysUntil < 0) return 'danger';
    if (daysUntil <= 2) return 'warning';
    return 'medium';
  }
}