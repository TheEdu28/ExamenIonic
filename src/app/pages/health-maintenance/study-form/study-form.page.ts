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
  selector: 'app-study-form',
  templateUrl: './study-form.page.html',
  styleUrls: ['./study-form.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class StudyFormPage implements OnInit {
  study: any = {
    studyType: '',
    datePerformed: new Date().toISOString(),
    results: '',
    nextAppointment: undefined,
    doctor: '',
    cost: undefined,
    attachments: []
  };

  studyId?: string;
  reminderEnabled: boolean = false;

  constructor(
    private healthService: HealthMaintenanceService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    addIcons({ closeCircleOutline });
  }

  async ngOnInit() {
    this.studyId = this.route.snapshot.paramMap.get('id') || undefined;
    if (this.studyId) {
      const studies = await this.healthService.getAllStudies();
      const data = studies.find(s => s.id === this.studyId);
      if (data) {
        this.study = { ...data };
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
          this.study.attachments.push(attachment);
        };
        reader.readAsDataURL(file);
      }
    }
  }

  removeAttachment(index: number) {
    this.study.attachments.splice(index, 1);
  }

  async save() {
    try {
      if (this.studyId) {
        await this.healthService.updateStudy(this.studyId, this.study);
      } else {
        await this.healthService.createStudy(this.study);
      }
      this.router.navigate(['/health-maintenance']);
    } catch (error) {
      alert('Error al guardar el estudio');
    }
  }
}
