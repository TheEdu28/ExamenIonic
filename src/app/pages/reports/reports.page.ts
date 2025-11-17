import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ReportsService } from '../../services/reports.service';
import { MaintenanceReport, MaintenanceCategory } from '../../models/maintenance.model';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.page.html',
  styleUrls: ['./reports.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ReportsPage {
  selectedCategory: MaintenanceCategory = MaintenanceCategory.HOUSE;
  fromDate: string = new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString();
  toDate: string = new Date().toISOString();
  report?: MaintenanceReport;
  allReports?: MaintenanceReport[];

  constructor(private reportsService: ReportsService) {}

  async generateReport() {
    this.report = await this.reportsService.generateReport(
      this.selectedCategory,
      new Date(this.fromDate),
      new Date(this.toDate)
    );
    this.allReports = undefined;
  }

  async generateAllReports() {
    this.allReports = await this.reportsService.getAllReports(
      new Date(this.fromDate),
      new Date(this.toDate)
    );
    this.report = undefined;
  }

  getCategoryLabel(category: MaintenanceCategory): string {
    const labels = {
      [MaintenanceCategory.HOUSE]: 'Casa',
      [MaintenanceCategory.VEHICLE]: 'Vehículos',
      [MaintenanceCategory.HEALTH]: 'Salud',
      [MaintenanceCategory.PET]: 'Mascotas'
    };
    return labels[category];
  }

  getTotalCost(): number {
    if (!this.allReports) return 0;
    return this.allReports.reduce((sum, rep) => sum + rep.totalCost, 0);
  }
}
