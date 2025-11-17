import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { PetMaintenanceService } from '../../../services/pet-maintenance.service';

@Component({
  selector: 'app-pet-form',
  templateUrl: './pet-form.page.html',
  styleUrls: ['./pet-form.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class PetFormPage implements OnInit {
  petData: any = {
    pet: {
      id: '',
      name: '',
      type: '',
      breed: '',
      birthDate: undefined,
      photo: undefined
    },
    vaccines: [],
    vetAppointments: [],
    feedingSchedule: '',
    specialCare: '',
    reminders: []
  };

  petId?: string;

  constructor(
    private petService: PetMaintenanceService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  async ngOnInit() {
    this.petId = this.route.snapshot.paramMap.get('id') || undefined;
    if (this.petId) {
      const data = await this.petService.getById(this.petId);
      if (data) {
        this.petData = { ...data };
      }
    }
  }

  async save() {
    try {
      if (this.petId) {
        await this.petService.update(this.petId, this.petData);
      } else {
        await this.petService.create(this.petData);
      }
      this.router.navigate(['/pet-maintenance']);
    } catch (error) {
      alert('Error al guardar la mascota');
    }
  }
}
