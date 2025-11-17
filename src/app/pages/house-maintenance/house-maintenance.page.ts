import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { addOutline, trashOutline } from 'ionicons/icons';
import { HouseMaintenanceService } from '../../services/house-maintenance.service';
import { HouseMaintenance, MaintenanceStatus, Priority } from '../../models/maintenance.model';

@Component({
  selector: 'app-house-maintenance',
  templateUrl: './house-maintenance.page.html',
  styleUrls: ['./house-maintenance.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class HouseMaintenancePage implements OnInit {
  maintenances: HouseMaintenance[] = [];

  constructor(
    private houseService: HouseMaintenanceService,
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
    this.maintenances = await this.houseService.getAll();
  }

  navigateToAdd() {
    this.router.navigate(['/house-maintenance/add']);
  }

  navigateToDetail(id: string) {
    this.router.navigate(['/house-maintenance/detail', id]);
  }

  async deleteMaintenance(id: string) {
    const confirm = window.confirm('¿Está seguro de eliminar este mantenimiento?');
    if (confirm) {
      await this.houseService.delete(id);
      await this.loadMaintenances();
    }
  }

  getStatusLabel(status: MaintenanceStatus): string {
    const labels = {
      [MaintenanceStatus.PENDING]: 'Pendiente',
      [MaintenanceStatus.IN_PROGRESS]: 'En Progreso',
      [MaintenanceStatus.COMPLETED]: 'Completado'
    };
    return labels[status];
  }

  getPriorityLabel(priority: Priority): string {
    const labels = {
      [Priority.LOW]: 'Baja',
      [Priority.MEDIUM]: 'Media',
      [Priority.HIGH]: 'Alta'
    };
    return labels[priority];
  }
}
