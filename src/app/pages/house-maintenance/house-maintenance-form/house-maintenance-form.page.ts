import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { HouseMaintenanceService } from '../../../services/house-maintenance.service';
import { MaintenanceStatus, MaintenanceFrequency, Priority, Attachment } from '../../../models/maintenance.model';
import { addIcons } from 'ionicons';
import { closeCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-house-maintenance-form',
  templateUrl: './house-maintenance-form.page.html',
  styleUrls: ['./house-maintenance-form.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class HouseMaintenanceFormPage implements OnInit {
  maintenance: any = {
    description: '',
    scheduledDate: new Date().toISOString(),
    frequency: MaintenanceFrequency.ONE_TIME,
    status: MaintenanceStatus.PENDING,
    priority: Priority.MEDIUM,
    notes: '',
    attachments: [],
    cost: undefined
  };

  maintenanceId?: string;

  constructor(
    private houseService: HouseMaintenanceService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    addIcons({ closeCircleOutline });
  }

  async ngOnInit() {
    this.maintenanceId = this.route.snapshot.paramMap.get('id') || undefined;
    if (this.maintenanceId) {
      const data = await this.houseService.getById(this.maintenanceId);
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
        await this.houseService.update(this.maintenanceId, this.maintenance);
      } else {
        await this.houseService.create(this.maintenance);
      }
      this.router.navigate(['/house-maintenance']);
    } catch (error) {
      alert('Error al guardar el mantenimiento');
    }
  }
}
