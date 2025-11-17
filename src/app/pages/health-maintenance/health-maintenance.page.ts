import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { addOutline, trashOutline } from 'ionicons/icons';
import { HealthMaintenanceService } from '../../services/health-maintenance.service';
import { HealthInsurance, MedicalStudy, Reminder } from '../../models/maintenance.model';

@Component({
  selector: 'app-health-maintenance',
  templateUrl: './health-maintenance.page.html',
  styleUrls: ['./health-maintenance.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class HealthMaintenancePage implements OnInit {
  selectedSegment: string = 'insurances';
  insurances: HealthInsurance[] = [];
  studies: MedicalStudy[] = [];
  reminders: Reminder[] = [];

  constructor(
    private healthService: HealthMaintenanceService,
    private router: Router
  ) {
    addIcons({ addOutline, trashOutline });
  }

  async ngOnInit() {
    await this.loadData();
  }

  async ionViewWillEnter() {
    await this.loadData();
  }

  async loadData() {
    this.insurances = await this.healthService.getAllInsurances();
    this.studies = await this.healthService.getAllStudies();
    this.reminders = await this.healthService.getAllReminders();
  }

  addInsurance() {
    this.router.navigate(['/health-maintenance/insurance/add']);
  }

  viewInsurance(id: string) {
    this.router.navigate(['/health-maintenance/insurance/detail', id]);
  }

  async deleteInsurance(id: string) {
    const confirm = window.confirm('¿Está seguro de eliminar este seguro?');
    if (confirm) {
      await this.healthService.deleteInsurance(id);
      await this.loadData();
    }
  }

  addStudy() {
    this.router.navigate(['/health-maintenance/study/add']);
  }

  viewStudy(id: string) {
    this.router.navigate(['/health-maintenance/study/detail', id]);
  }

  async deleteStudy(id: string) {
    const confirm = window.confirm('¿Está seguro de eliminar este estudio?');
    if (confirm) {
      await this.healthService.deleteStudy(id);
      await this.loadData();
    }
  }

  addReminder() {
    this.router.navigate(['/health-maintenance/reminder/add']);
  }

  async deleteReminder(id: string) {
    const confirm = window.confirm('¿Está seguro de eliminar este recordatorio?');
    if (confirm) {
      await this.healthService.deleteReminder(id);
      await this.loadData();
    }
  }
}
