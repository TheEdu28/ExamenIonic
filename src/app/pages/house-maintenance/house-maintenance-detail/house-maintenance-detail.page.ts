import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { addIcons } from 'ionicons';
import { createOutline } from 'ionicons/icons';
import { HouseMaintenanceService } from '../../../services/house-maintenance.service';
import { HouseMaintenance, MaintenanceStatus, MaintenanceFrequency, Priority } from '../../../models/maintenance.model';

@Component({
  selector: 'app-house-maintenance-detail',
  templateUrl: './house-maintenance-detail.page.html',
  styleUrls: ['./house-maintenance-detail.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class HouseMaintenanceDetailPage implements OnInit {
  maintenance?: HouseMaintenance;
  maintenanceId!: string;

  constructor(
    private houseService: HouseMaintenanceService,
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
    this.maintenance = await this.houseService.getById(this.maintenanceId);
  }

  edit() {
    this.router.navigate(['/house-maintenance/edit', this.maintenanceId]);
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

  getFrequencyLabel(frequency: MaintenanceFrequency): string {
    const labels = {
      [MaintenanceFrequency.DAILY]: 'Diaria',
      [MaintenanceFrequency.WEEKLY]: 'Semanal',
      [MaintenanceFrequency.MONTHLY]: 'Mensual',
      [MaintenanceFrequency.YEARLY]: 'Anual',
      [MaintenanceFrequency.ONE_TIME]: 'Una vez'
    };
    return labels[frequency];
  }
}
