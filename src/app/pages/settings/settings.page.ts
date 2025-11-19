// src/app/pages/settings/settings.page.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { downloadOutline, cloudUploadOutline, trashOutline, syncOutline, cloudDoneOutline } from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';
import { NotificationService } from '../../services/notification.service';
import { SyncService } from '../../services/sync.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class SettingsPage implements OnInit {
  userName: string = '';
  userEmail: string = '';
  notificationsEnabled: boolean = true;
  dailyReminders: boolean = true;
  lastSyncDate: Date | null = null;

  constructor(
    private authService: AuthService,
    private storageService: StorageService,
    private notificationService: NotificationService,
    private syncService: SyncService,
    private alertController: AlertController
  ) {
    addIcons({ 
      downloadOutline, 
      cloudUploadOutline, 
      trashOutline,
      syncOutline,
      cloudDoneOutline
    });
  }

  async ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userName = user.name;
      this.userEmail = user.email;
    }
    
    this.notificationsEnabled = this.notificationService.isNotificationsEnabled();
    this.lastSyncDate = await this.syncService.getLastSyncDate();
  }

  async onNotificationsToggle() {
    await this.notificationService.setNotificationsEnabled(this.notificationsEnabled);
    
    if (this.notificationsEnabled) {
      await this.notificationService.checkUpcomingMaintenances();
    }
  }

  async exportData() {
    try {
      const data = await this.storageService.exportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `maintenance-backup-${new Date().getTime()}.json`;
      a.click();
      window.URL.revokeObjectURL(url);

      const alert = await this.alertController.create({
        header: 'Éxito',
        message: 'Datos exportados correctamente',
        buttons: ['OK']
      });
      await alert.present();
    } catch (error) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Error al exportar los datos',
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  async importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = async (e: any) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = async (event: any) => {
        try {
          await this.storageService.importData(event.target.result);
          const alert = await this.alertController.create({
            header: 'Éxito',
            message: 'Datos importados correctamente. La aplicación se recargará.',
            buttons: [{
              text: 'OK',
              handler: () => {
                window.location.reload();
              }
            }]
          });
          await alert.present();
        } catch (error) {
          const alert = await this.alertController.create({
            header: 'Error',
            message: 'Error al importar los datos. Verifica que el archivo sea válido.',
            buttons: ['OK']
          });
          await alert.present();
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }

  async syncToCloud() {
    const success = await this.syncService.syncToCloud();
    if (success) {
      this.lastSyncDate = await this.syncService.getLastSyncDate();
    }
  }

  async restoreFromCloud() {
    const alert = await this.alertController.create({
      header: 'Restaurar desde la Nube',
      message: 'Esto reemplazará todos tus datos actuales. ¿Deseas continuar?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Restaurar',
          handler: async () => {
            const success = await this.syncService.restoreFromCloud();
            if (success) {
              window.location.reload();
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async clearAllData() {
    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: '¿Está seguro de que desea borrar todos los datos? Esta acción no se puede deshacer.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Borrar',
          role: 'destructive',
          handler: async () => {
            await this.storageService.clear();
            const confirmAlert = await this.alertController.create({
              header: 'Éxito',
              message: 'Todos los datos han sido borrados',
              buttons: [{
                text: 'OK',
                handler: () => {
                  window.location.reload();
                }
              }]
            });
            await confirmAlert.present();
          }
        }
      ]
    });

    await alert.present();
  }
}