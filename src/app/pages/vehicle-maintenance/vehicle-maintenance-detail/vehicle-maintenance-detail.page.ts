import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { addIcons } from 'ionicons';
import { createOutline } from 'ionicons/icons';
import { VehicleMaintenanceService } from '../../../services/vehicle-maintenance.service';
import { VehicleMaintenance, MaintenanceStatus, Priority } from '../../../models/maintenance.model';

@Component({
  selector: 'app-vehicle-maintenance-detail',
  templateUrl: './vehicle-maintenance-detail.page.html',
  styleUrls: ['./vehicle-maintenance-detail.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class VehicleMaintenanceDetailPage implements OnInit {
  maintenance?: VehicleMaintenance;
  maintenanceId!: string;

  constructor(
    private vehicleService: VehicleMaintenanceService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    addIcons({ createOutline });
  }

  async ngOnInit() {
    this.maintenanceId = this.route.snapshot.paramMap.get('id')!;
    await this.loadMaintenance();
  }

  async loadMaintenance() {
    this.maintenance = await this.vehicleService.getById(this.maintenanceId);
  }

  edit() {
    this.router.navigate(['/vehicle-maintenance/edit', this.maintenanceId]);
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
