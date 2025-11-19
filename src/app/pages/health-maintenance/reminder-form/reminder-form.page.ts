// src/app/pages/health-maintenance/reminder-form/reminder-form.page.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { HealthMaintenanceService } from '../../../services/health-maintenance.service';
import { MaintenanceCategory } from '../../../models/maintenance.model';
import { addIcons } from 'ionicons';
import { closeCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-reminder-form',
  templateUrl: './reminder-form.page.html',
  styleUrls: ['./reminder-form.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ReminderFormPage implements OnInit {
  reminder: any = {
    title: '',
    description: '',
    dueDate: new Date().toISOString(),
    category: MaintenanceCategory.HEALTH,
    isActive: true
  };

  reminderId?: string;

  constructor(
    private healthService: HealthMaintenanceService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    addIcons({ closeCircleOutline });
  }

  async ngOnInit() {
    this.reminderId = this.route.snapshot.paramMap.get('id') || undefined;
    if (this.reminderId) {
      const reminders = await this.healthService.getAllReminders();
      const data = reminders.find(r => r.id === this.reminderId);
      if (data) {
        this.reminder = { ...data };
      }
    }
  }

  async save() {
    try {
      await this.healthService.createReminder(this.reminder);
      this.router.navigate(['/health-maintenance']);
    } catch (error) {
      alert('Error al guardar el recordatorio');
    }
  }
}