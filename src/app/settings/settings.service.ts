import { Injectable } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { default as defaultSettings } from '../../assets/default-settings.json';
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
  private _settings: Observable<Setting[]>;

  public get settings(): Observable<Setting[]> {
    return this._settings;
  }

  constructor(private persistenceService: PersistenceService) {
    this.reload();
  }

  public async storeSettings(settings: Setting[]): Promise<void> {
    await this.persistenceService.store('settings', JSON.stringify(settings));
  }

  public reload(): void {
    this._settings = from(this.loadSettings());
  }

  public restoreDefaults(): void {
    this._settings = of(defaultSettings as Setting[]);
  }

  private async loadSettings(): Promise<Setting[]> {
    await this.persistenceService.ready;
    const settingsJson = await this.persistenceService.retrieve('settings');
    if (settingsJson.length === 0) return defaultSettings as Setting[];
    return JSON.parse(settingsJson);
  }
}
