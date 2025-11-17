import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { HealthMaintenanceService } from '../../../services/health-maintenance.service';
import { Attachment } from '../../../models/maintenance.model';
import { addIcons } from 'ionicons';
import { closeCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-insurance-form',
  templateUrl: './insurance-form.page.html',
  styleUrls: ['./insurance-form.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class InsuranceFormPage implements OnInit {
  insurance: any = {
    type: '',
    startDate: new Date().toISOString(),
    expiryDate: new Date().toISOString(),
    provider: '',
    coverageNotes: '',
    cost: undefined,
    attachments: []
  };

  insuranceId?: string;

  constructor(
    private healthService: HealthMaintenanceService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    addIcons({ closeCircleOutline });
  }

  async ngOnInit() {
    this.insuranceId = this.route.snapshot.paramMap.get('id') || undefined;
    if (this.insuranceId) {
      const insurances = await this.healthService.getAllInsurances();
      const data = insurances.find(i => i.id === this.insuranceId);
      if (data) {
        this.insurance = { ...data };
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
          this.insurance.attachments.push(attachment);
        };
        reader.readAsDataURL(file);
      }
    }
  }

  removeAttachment(index: number) {
    this.insurance.attachments.splice(index, 1);
  }

  async save() {
    try {
      if (this.insuranceId) {
        await this.healthService.updateInsurance(this.insuranceId, this.insurance);
      } else {
        await this.healthService.createInsurance(this.insurance);
      }
      this.router.navigate(['/health-maintenance']);
    } catch (error) {
      alert('Error al guardar el seguro');
    }
  }
}
