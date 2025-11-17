import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { downloadOutline, cloudUploadOutline, trashOutline } from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';

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

  constructor(
    private authService: AuthService,
    private storageService: StorageService,
    private alertController: AlertController
  ) {
    addIcons({ downloadOutline, cloudUploadOutline, trashOutline });
  }

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userName = user.name;
      this.userEmail = user.email;
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
            message: 'Datos importados correctamente',
            buttons: ['OK']
          });
          await alert.present();
        } catch (error) {
          const alert = await this.alertController.create({
            header: 'Error',
            message: 'Error al importar los datos',
            buttons: ['OK']
          });
          await alert.present();
        }
      };
      reader.readAsText(file);
    };
    input.click();
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
              buttons: ['OK']
            });
            await confirmAlert.present();
          }
        }
      ]
    });

    await alert.present();
  }
}
