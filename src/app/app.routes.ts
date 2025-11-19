// src/app/app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.page').then((m) => m.RegisterPage),
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.page').then((m) => m.DashboardPage),
  },
  {
    path: 'house-maintenance',
    loadComponent: () => import('./pages/house-maintenance/house-maintenance.page').then((m) => m.HouseMaintenancePage),
  },
  {
    path: 'house-maintenance/add',
    loadComponent: () => import('./pages/house-maintenance/house-maintenance-form/house-maintenance-form.page').then((m) => m.HouseMaintenanceFormPage),
  },
  {
    path: 'house-maintenance/edit/:id',
    loadComponent: () => import('./pages/house-maintenance/house-maintenance-form/house-maintenance-form.page').then((m) => m.HouseMaintenanceFormPage),
  },
  {
    path: 'house-maintenance/detail/:id',
    loadComponent: () => import('./pages/house-maintenance/house-maintenance-detail/house-maintenance-detail.page').then((m) => m.HouseMaintenanceDetailPage),
  },
  {
    path: 'vehicle-maintenance',
    loadComponent: () => import('./pages/vehicle-maintenance/vehicle-maintenance.page').then((m) => m.VehicleMaintenancePage),
  },
  {
    path: 'vehicle-maintenance/add',
    loadComponent: () => import('./pages/vehicle-maintenance/vehicle-maintenance-form/vehicle-maintenance-form.page').then((m) => m.VehicleMaintenanceFormPage),
  },
  {
    path: 'vehicle-maintenance/edit/:id',
    loadComponent: () => import('./pages/vehicle-maintenance/vehicle-maintenance-form/vehicle-maintenance-form.page').then((m) => m.VehicleMaintenanceFormPage),
  },
  {
    path: 'vehicle-maintenance/detail/:id',
    loadComponent: () => import('./pages/vehicle-maintenance/vehicle-maintenance-detail/vehicle-maintenance-detail.page').then((m) => m.VehicleMaintenanceDetailPage),
  },
  {
    path: 'health-maintenance',
    loadComponent: () => import('./pages/health-maintenance/health-maintenance.page').then((m) => m.HealthMaintenancePage),
  },
  {
    path: 'health-maintenance/insurance/add',
    loadComponent: () => import('./pages/health-maintenance/insurance-form/insurance-form.page').then((m) => m.InsuranceFormPage),
  },
  {
    path: 'health-maintenance/insurance/edit/:id',
    loadComponent: () => import('./pages/health-maintenance/insurance-form/insurance-form.page').then((m) => m.InsuranceFormPage),
  },
  {
    path: 'health-maintenance/insurance/detail/:id',
    loadComponent: () => import('./pages/health-maintenance/insurance-form/insurance-form.page').then((m) => m.InsuranceFormPage),
  },
  {
    path: 'health-maintenance/study/add',
    loadComponent: () => import('./pages/health-maintenance/study-form/study-form.page').then((m) => m.StudyFormPage),
  },
  {
    path: 'health-maintenance/study/edit/:id',
    loadComponent: () => import('./pages/health-maintenance/study-form/study-form.page').then((m) => m.StudyFormPage),
  },
  {
    path: 'health-maintenance/study/detail/:id',
    loadComponent: () => import('./pages/health-maintenance/study-form/study-form.page').then((m) => m.StudyFormPage),
  },
  {
    path: 'health-maintenance/reminder/add',
    loadComponent: () => import('./pages/health-maintenance/reminder-form/reminder-form.page').then((m) => m.ReminderFormPage),
  },
  {
    path: 'health-maintenance/reminder/edit/:id',
    loadComponent: () => import('./pages/health-maintenance/reminder-form/reminder-form.page').then((m) => m.ReminderFormPage),
  },
  {
    path: 'pet-maintenance',
    loadComponent: () => import('./pages/pet-maintenance/pet-maintenance.page').then((m) => m.PetMaintenancePage),
  },
  {
    path: 'pet-maintenance/add',
    loadComponent: () => import('./pages/pet-maintenance/pet-form/pet-form.page').then((m) => m.PetFormPage),
  },
  {
    path: 'pet-maintenance/edit/:id',
    loadComponent: () => import('./pages/pet-maintenance/pet-form/pet-form.page').then((m) => m.PetFormPage),
  },
  {
    path: 'pet-maintenance/detail/:id',
    loadComponent: () => import('./pages/pet-maintenance/pet-detail/pet-detail.page').then((m) => m.PetDetailPage),
  },
  {
    path: 'reports',
    loadComponent: () => import('./pages/reports/reports.page').then((m) => m.ReportsPage),
  },
  {
    path: 'settings',
    loadComponent: () => import('./pages/settings/settings.page').then((m) => m.SettingsPage),
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'notifications',
    loadComponent: () => import('./pages/notifications/notifications.page').then((m) => m.NotificationsPage),
  },
];