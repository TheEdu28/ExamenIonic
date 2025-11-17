import { Injectable } from '@angular/core';
import { MaintenanceReport, MaintenanceCategory, MaintenanceStatus } from '../models/maintenance.model';
import { HouseMaintenanceService } from './house-maintenance.service';
import { VehicleMaintenanceService } from './vehicle-maintenance.service';
import { HealthMaintenanceService } from './health-maintenance.service';
import { PetMaintenanceService } from './pet-maintenance.service';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  constructor(
    private houseService: HouseMaintenanceService,
    private vehicleService: VehicleMaintenanceService,
    private healthService: HealthMaintenanceService,
    private petService: PetMaintenanceService
  ) {}

  async generateReport(category: MaintenanceCategory, fromDate: Date, toDate: Date): Promise<MaintenanceReport> {
    let totalCost = 0;
    let completedCount = 0;
    let pendingCount = 0;

    switch (category) {
      case MaintenanceCategory.HOUSE:
        const houseMaintenances = await this.houseService.getAll();
        houseMaintenances.forEach(m => {
          const date = new Date(m.scheduledDate);
          if (date >= fromDate && date <= toDate) {
            if (m.cost) totalCost += m.cost;
            if (m.status === MaintenanceStatus.COMPLETED) completedCount++;
            if (m.status === MaintenanceStatus.PENDING) pendingCount++;
          }
        });
        break;

      case MaintenanceCategory.VEHICLE:
        const vehicleMaintenances = await this.vehicleService.getAll();
        vehicleMaintenances.forEach(m => {
          const date = new Date(m.maintenanceDate);
          if (date >= fromDate && date <= toDate) {
            totalCost += m.cost;
            if (m.status === MaintenanceStatus.COMPLETED) completedCount++;
            if (m.status === MaintenanceStatus.PENDING) pendingCount++;
          }
        });
        break;

      case MaintenanceCategory.HEALTH:
        const insurances = await this.healthService.getAllInsurances();
        const studies = await this.healthService.getAllStudies();
        
        insurances.forEach(i => {
          const date = new Date(i.startDate);
          if (date >= fromDate && date <= toDate) {
            if (i.cost) totalCost += i.cost;
            completedCount++;
          }
        });

        studies.forEach(s => {
          const date = new Date(s.datePerformed);
          if (date >= fromDate && date <= toDate) {
            if (s.cost) totalCost += s.cost;
            completedCount++;
          }
        });
        break;

      case MaintenanceCategory.PET:
        const petMaintenances = await this.petService.getAll();
        petMaintenances.forEach(p => {
          p.vaccines.forEach(v => {
            const date = new Date(v.applicationDate);
            if (date >= fromDate && date <= toDate) {
              if (v.cost) totalCost += v.cost;
              completedCount++;
            }
          });

          p.vetAppointments.forEach(a => {
            const date = new Date(a.date);
            if (date >= fromDate && date <= toDate) {
              if (a.cost) totalCost += a.cost;
              completedCount++;
            }
          });
        });
        break;
    }

    return {
      category,
      totalCost,
      completedCount,
      pendingCount,
      dateRange: { from: fromDate, to: toDate }
    };
  }

  async getAllReports(fromDate: Date, toDate: Date): Promise<MaintenanceReport[]> {
    const categories = [
      MaintenanceCategory.HOUSE,
      MaintenanceCategory.VEHICLE,
      MaintenanceCategory.HEALTH,
      MaintenanceCategory.PET
    ];

    const reports = await Promise.all(
      categories.map(cat => this.generateReport(cat, fromDate, toDate))
    );

    return reports;
  }

  async getTotalCost(fromDate: Date, toDate: Date): Promise<number> {
    const reports = await this.getAllReports(fromDate, toDate);
    return reports.reduce((sum, report) => sum + report.totalCost, 0);
  }
}
