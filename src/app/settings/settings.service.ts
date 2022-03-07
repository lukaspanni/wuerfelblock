import { Injectable } from '@angular/core';
import { PersistenceService } from '../services/persistence/persistence.service';

export interface Setting {
  id: string;
  name: string;
  description?: string;
  type: 'boolean' | 'string' | 'number';
  value: boolean | string | number;
}

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private _settings: Promise<Setting[]>;

  public get settings(): Promise<Setting[]> {
    return this._settings;
  }

  constructor(private persistenceService: PersistenceService) {
    this._settings = this.loadSettings();
  }

  public async storeSettings(settings: Setting[]): Promise<void> {
    await this.persistenceService.store('settings', JSON.stringify(settings));
  }

  private async loadSettings(): Promise<Setting[]> {
    await this.persistenceService.ready;
    const settingsJson = await this.persistenceService.retrieve('settings');
    if (settingsJson.length === 0) return [];
    return JSON.parse(settingsJson);
  }
}
