import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { addOutline, trashOutline } from 'ionicons/icons';
import { PetMaintenanceService } from '../../services/pet-maintenance.service';
import { PetMaintenance } from '../../models/maintenance.model';

@Component({
  selector: 'app-pet-maintenance',
  templateUrl: './pet-maintenance.page.html',
  styleUrls: ['./pet-maintenance.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class PetMaintenancePage implements OnInit {
  petMaintenances: PetMaintenance[] = [];

  constructor(
    private petService: PetMaintenanceService,
    private router: Router
  ) {
    addIcons({ addOutline, trashOutline });
  }

  async ngOnInit() {
    await this.loadPets();
  }

  async ionViewWillEnter() {
    await this.loadPets();
  }

  async loadPets() {
    this.petMaintenances = await this.petService.getAll();
  }

  navigateToAdd() {
    this.router.navigate(['/pet-maintenance/add']);
  }

  navigateToDetail(id: string) {
    this.router.navigate(['/pet-maintenance/detail', id]);
  }

  async deletePet(id: string) {
    const confirm = window.confirm('¿Está seguro de eliminar esta mascota?');
    if (confirm) {
      await this.petService.delete(id);
      await this.loadPets();
    }
  }
}
