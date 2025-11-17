import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { addIcons } from 'ionicons';
import { logOutOutline, homeOutline, carOutline, fitnessOutline, pawOutline, barChartOutline, settingsOutline } from 'ionicons/icons';
import { HouseMaintenanceService } from '../../services/house-maintenance.service';
import { VehicleMaintenanceService } from '../../services/vehicle-maintenance.service';
import { PetMaintenanceService } from '../../services/pet-maintenance.service';

interface UpcomingItem {
  title: string;
  date: Date;
  category: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class DashboardPage implements OnInit {
  userName: string = '';
  upcomingCount: number = 0;
  alertsCount: number = 0;
  upcomingMaintenances: UpcomingItem[] = [];

  constructor(
    private authService: AuthService,
    private houseService: HouseMaintenanceService,
    private vehicleService: VehicleMaintenanceService,
    private petService: PetMaintenanceService,
    private router: Router
  ) {
    addIcons({ logOutOutline, homeOutline, carOutline, fitnessOutline, pawOutline, barChartOutline, settingsOutline });
  }

  async ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }
    this.userName = user.name;
    await this.loadDashboardData();
  }

  async loadDashboardData() {
    const houseMaintenances = await this.houseService.getUpcoming();
    const vehicleMaintenances = await this.vehicleService.getUpcoming();
    const insuranceAlerts = await this.vehicleService.getInsuranceAlerts();
    const upcomingVaccines = await this.petService.getUpcomingVaccines();

    this.upcomingCount = houseMaintenances.length + vehicleMaintenances.length;
    this.alertsCount = insuranceAlerts.length + upcomingVaccines.length;

    this.upcomingMaintenances = [];
    
    houseMaintenances.slice(0, 5).forEach(m => {
      this.upcomingMaintenances.push({
        title: m.description,
        date: m.scheduledDate,
        category: 'Casa'
      });
    });

    vehicleMaintenances.slice(0, 5).forEach(m => {
      this.upcomingMaintenances.push({
        title: m.serviceDescription,
        date: m.nextMaintenanceDate || m.maintenanceDate,
        category: 'Vehículo'
      });
    });

    this.upcomingMaintenances.sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }
}
