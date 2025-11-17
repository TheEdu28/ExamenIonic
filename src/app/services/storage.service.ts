import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly STORAGE_PREFIX = 'maintenance_app_';

  constructor() {}

  async set(key: string, value: any): Promise<void> {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(this.STORAGE_PREFIX + key, serializedValue);
    } catch (error) {
      console.error('Error saving to storage:', error);
      throw error;
    }
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const item = localStorage.getItem(this.STORAGE_PREFIX + key);
      if (item) {
        return JSON.parse(item) as T;
      }
      return null;
    } catch (error) {
      console.error('Error getting from storage:', error);
      return null;
    }
  }

  async remove(key: string): Promise<void> {
    try {
      localStorage.removeItem(this.STORAGE_PREFIX + key);
    } catch (error) {
      console.error('Error removing from storage:', error);
      throw error;
    }
  }

  async clear(): Promise<void> {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.STORAGE_PREFIX)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  }

  async exportData(): Promise<string> {
    const data: any = {};
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(this.STORAGE_PREFIX)) {
        const cleanKey = key.replace(this.STORAGE_PREFIX, '');
        data[cleanKey] = localStorage.getItem(key);
      }
    });
    return JSON.stringify(data);
  }

  async importData(jsonData: string): Promise<void> {
    try {
      const data = JSON.parse(jsonData);
      Object.keys(data).forEach(key => {
        localStorage.setItem(this.STORAGE_PREFIX + key, data[key]);
      });
    } catch (error) {
      console.error('Error importing data:', error);
      throw error;
    }
  }
}
