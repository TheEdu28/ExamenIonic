import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { VehicleMaintenanceService } from '../../../services/vehicle-maintenance.service';
import { MaintenanceStatus, Priority, Attachment } from '../../../models/maintenance.model';
import { addIcons } from 'ionicons';
import { closeCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-vehicle-maintenance-form',
  templateUrl: './vehicle-maintenance-form.page.html',
  styleUrls: ['./vehicle-maintenance-form.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class VehicleMaintenanceFormPage implements OnInit {
  maintenance: any = {
    vehicleName: '',
    serviceDescription: '',
    maintenanceDate: new Date().toISOString(),
    nextMaintenanceDate: undefined,
    currentMileage: 0,
    cost: 0,
    status: MaintenanceStatus.PENDING,
    priority: Priority.MEDIUM,
    notes: '',
    attachments: [],
    insuranceExpiryDate: undefined,
    technicalInspectionDate: undefined
  };

  maintenanceId?: string;
  insuranceAlertEnabled: boolean = false;
  technicalAlertEnabled: boolean = false;

  constructor(
    private vehicleService: VehicleMaintenanceService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    addIcons({ closeCircleOutline });
  }

  async ngOnInit() {
    this.maintenanceId = this.route.snapshot.paramMap.get('id') || undefined;
    if (this.maintenanceId) {
      const data = await this.vehicleService.getById(this.maintenanceId);
      if (data) {
        this.maintenance = { ...data };
      }
    }
  }

  onFileSelected(event: any) {
    const files = event.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const attachment: Attachment = {
            id: 'att_' + Date.now() + '_' + i,
            name: file.name,
            url: e.target.result,
            type: file.type,
            uploadDate: new Date()
          };
          this.maintenance.attachments.push(attachment);
        };
        reader.readAsDataURL(file);
      }
    }
  }

  removeAttachment(index: number) {
    this.maintenance.attachments.splice(index, 1);
  }

  async save() {
    try {
      if (this.maintenanceId) {
        await this.vehicleService.update(this.maintenanceId, this.maintenance);
      } else {
        await this.vehicleService.create(this.maintenance);
      }
      this.router.navigate(['/vehicle-maintenance']);
    } catch (error) {
      alert('Error al guardar el mantenimiento');
    }
  }
}
