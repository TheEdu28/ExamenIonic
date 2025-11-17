import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { addIcons } from 'ionicons';
import { createOutline, addOutline } from 'ionicons/icons';
import { PetMaintenanceService } from '../../../services/pet-maintenance.service';
import { PetMaintenance } from '../../../models/maintenance.model';

@Component({
  selector: 'app-pet-detail',
  templateUrl: './pet-detail.page.html',
  styleUrls: ['./pet-detail.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class PetDetailPage implements OnInit {
  petMaintenance?: PetMaintenance;
  petId!: string;

  constructor(
    private petService: PetMaintenanceService,
    private router: Router,
    private route: ActivatedRoute,
    private alertController: AlertController
  ) {
    addIcons({ createOutline, addOutline });
  }

  async ngOnInit() {
    this.petId = this.route.snapshot.paramMap.get('id')!;
    await this.loadPet();
  }

  async loadPet() {
    this.petMaintenance = await this.petService.getById(this.petId);
  }

  edit() {
    this.router.navigate(['/pet-maintenance/edit', this.petId]);
  }

  async addVaccine() {
    const alert = await this.alertController.create({
      header: 'Agregar Vacuna',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Nombre de la vacuna'
        },
        {
          name: 'applicationDate',
          type: 'date',
          placeholder: 'Fecha de aplicación'
        },
        {
          name: 'nextApplicationDate',
          type: 'date',
          placeholder: 'Próxima aplicación (opcional)'
        },
        {
          name: 'veterinarian',
          type: 'text',
          placeholder: 'Veterinario'
        },
        {
          name: 'cost',
          type: 'number',
          placeholder: 'Costo (opcional)'
        },
        {
          name: 'notes',
          type: 'textarea',
          placeholder: 'Notas'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Guardar',
          handler: async (data) => {
            await this.petService.addVaccine(this.petId, {
              name: data.name,
              applicationDate: new Date(data.applicationDate),
              nextApplicationDate: data.nextApplicationDate ? new Date(data.nextApplicationDate) : undefined,
              veterinarian: data.veterinarian,
              cost: data.cost ? parseFloat(data.cost) : undefined,
              notes: data.notes || ''
            });
            await this.loadPet();
          }
        }
      ]
    });

    await alert.present();
  }

  async addAppointment() {
    const alert = await this.alertController.create({
      header: 'Agregar Cita',
      inputs: [
        {
          name: 'date',
          type: 'date',
          placeholder: 'Fecha'
        },
        {
          name: 'reason',
          type: 'text',
          placeholder: 'Motivo'
        },
        {
          name: 'result',
          type: 'textarea',
          placeholder: 'Resultado'
        },
        {
          name: 'veterinarian',
          type: 'text',
          placeholder: 'Veterinario'
        },
        {
          name: 'cost',
          type: 'number',
          placeholder: 'Costo (opcional)'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Guardar',
          handler: async (data) => {
            await this.petService.addVetAppointment(this.petId, {
              date: new Date(data.date),
              reason: data.reason,
              result: data.result,
              veterinarian: data.veterinarian,
              cost: data.cost ? parseFloat(data.cost) : undefined,
              attachments: []
            });
            await this.loadPet();
          }
        }
      ]
    });

    await alert.present();
  }

  async addReminder() {
    const alert = await this.alertController.create({
      header: 'Agregar Recordatorio',
      inputs: [
        {
          name: 'title',
          type: 'text',
          placeholder: 'Título (ej: Alimentación, Paseo, Tratamiento)'
        },
        {
          name: 'description',
          type: 'textarea',
          placeholder: 'Descripción'
        },
        {
          name: 'dueDate',
          type: 'datetime-local',
          placeholder: 'Fecha y hora'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Guardar',
          handler: async (data) => {
            await this.petService.addReminder(this.petId, {
              title: data.title,
              description: data.description,
              dueDate: new Date(data.dueDate),
              isActive: true
            });
            await this.loadPet();
          }
        }
      ]
    });

    await alert.present();
  }
}
