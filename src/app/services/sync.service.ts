// src/app/services/sync.service.ts
import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class SyncService {
  private readonly LAST_SYNC_KEY = 'last_sync_date';
  private isSyncing: boolean = false;

  constructor(
    private storage: StorageService,
    private alertController: AlertController
  ) {}

  async getLastSyncDate(): Promise<Date | null> {
    const dateStr = await this.storage.get<string>(this.LAST_SYNC_KEY);
    return dateStr ? new Date(dateStr) : null;
  }

  async syncToCloud(): Promise<boolean> {
    if (this.isSyncing) {
      return false;
    }

    this.isSyncing = true;

    try {
      // Exportar todos los datos
      const data = await this.storage.exportData();
      
      // En una implementación real, aquí se subiría a Google Drive
      // Por ahora, simulamos la sincronización guardando en localStorage
      const timestamp = new Date().toISOString();
      localStorage.setItem('cloud_backup_' + timestamp, data);
      
      // Guardar fecha de última sincronización
      await this.storage.set(this.LAST_SYNC_KEY, timestamp);

      const alert = await this.alertController.create({
        header: 'Sincronización Exitosa',
        message: 'Tus datos han sido respaldados correctamente.',
        buttons: ['OK']
      });
      await alert.present();

      this.isSyncing = false;
      return true;
    } catch (error) {
      console.error('Error al sincronizar:', error);
      
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No se pudo completar la sincronización. Por favor, intenta de nuevo.',
        buttons: ['OK']
      });
      await alert.present();

      this.isSyncing = false;
      return false;
    }
  }

  async restoreFromCloud(): Promise<boolean> {
    if (this.isSyncing) {
      return false;
    }

    this.isSyncing = true;

    try {
      // Buscar el backup más reciente
      const keys = Object.keys(localStorage).filter(k => k.startsWith('cloud_backup_'));
      
      if (keys.length === 0) {
        const alert = await this.alertController.create({
          header: 'Sin Respaldo',
          message: 'No se encontró ningún respaldo en la nube.',
          buttons: ['OK']
        });
        await alert.present();
        this.isSyncing = false;
        return false;
      }

      // Obtener el más reciente
      const latestKey = keys.sort().reverse()[0];
      const data = localStorage.getItem(latestKey);

      if (data) {
        // Restaurar los datos
        await this.storage.importData(data);

        const alert = await this.alertController.create({
          header: 'Restauración Exitosa',
          message: 'Tus datos han sido restaurados correctamente.',
          buttons: ['OK']
        });
        await alert.present();

        this.isSyncing = false;
        return true;
      }

      this.isSyncing = false;
      return false;
    } catch (error) {
      console.error('Error al restaurar:', error);
      
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No se pudo restaurar los datos. Por favor, intenta de nuevo.',
        buttons: ['OK']
      });
      await alert.present();

      this.isSyncing = false;
      return false;
    }
  }

  async getAvailableBackups(): Promise<Array<{ date: Date; size: number }>> {
    const keys = Object.keys(localStorage).filter(k => k.startsWith('cloud_backup_'));
    
    return keys.map(key => {
      const dateStr = key.replace('cloud_backup_', '');
      const data = localStorage.getItem(key);
      return {
        date: new Date(dateStr),
        size: data ? new Blob([data]).size : 0
      };
    }).sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  isSyncInProgress(): boolean {
    return this.isSyncing;
  }
}