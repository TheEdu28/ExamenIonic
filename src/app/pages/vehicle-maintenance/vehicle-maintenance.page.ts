import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { addOutline, trashOutline } from 'ionicons/icons';
import { VehicleMaintenanceService } from '../../services/vehicle-maintenance.service';
import { VehicleMaintenance } from '../../models/maintenance.model';

@Component({
  selector: 'app-vehicle-maintenance',
  templateUrl: './vehicle-maintenance.page.html',
  styleUrls: ['./vehicle-maintenance.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class VehicleMaintenancePage implements OnInit {
  maintenances: VehicleMaintenance[] = [];

  constructor(
    private vehicleService: VehicleMaintenanceService,
    private router: Router
  ) {
    addIcons({ addOutline, trashOutline });
  }

  async ngOnInit() {
    await this.loadMaintenances();
  }

  async ionViewWillEnter() {
    await this.loadMaintenances();
  }

  async loadMaintenances() {
    this.maintenances = await this.vehicleService.getAll();
  }

  navigateToAdd() {
    this.router.navigate(['/vehicle-maintenance/add']);
  }

  navigateToDetail(id: string) {
    this.router.navigate(['/vehicle-maintenance/detail', id]);
  }

  async deleteMaintenance(id: string) {
    const confirm = window.confirm('¿Está seguro de eliminar este mantenimiento?');
    if (confirm) {
      await this.vehicleService.delete(id);
      await this.loadMaintenances();
    }
  }
}
