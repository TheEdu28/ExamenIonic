import { Injectable } from '@angular/core';
import { User } from '../models/maintenance.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly USER_KEY = 'current_user';
  private readonly USERS_KEY = 'users';
  private currentUser: User | null = null;

  constructor(private storage: StorageService) {
    this.loadCurrentUser();
  }

  async loadCurrentUser(): Promise<void> {
    this.currentUser = await this.storage.get<User>(this.USER_KEY);
  }

  async register(email: string, password: string, name: string): Promise<User> {
    const users = await this.storage.get<any[]>(this.USERS_KEY) || [];
    
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      throw new Error('El usuario ya existe');
    }

    const newUser: User = {
      id: this.generateId(),
      email,
      name,
      createdAt: new Date()
    };

    users.push({ ...newUser, password });
    await this.storage.set(this.USERS_KEY, users);
    
    return newUser;
  }

  async login(email: string, password: string): Promise<User> {
    const users = await this.storage.get<any[]>(this.USERS_KEY) || [];
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    const userData: User = {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt
    };

    this.currentUser = userData;
    await this.storage.set(this.USER_KEY, userData);
    
    return userData;
  }

  async logout(): Promise<void> {
    this.currentUser = null;
    await this.storage.remove(this.USER_KEY);
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  private generateId(): string {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
}
