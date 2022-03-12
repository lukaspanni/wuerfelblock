import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Setting, SettingsService } from './settings.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss']
})
export class SettingsPage implements OnInit {
  private _settings: Setting[] = [];

  public get settings(): Setting[] {
    return this._settings;
  }

  public get settingsAvailable(): boolean {
    return this._settings.length > 0;
  }

  constructor(private settingsService: SettingsService) {}

  public ngOnInit(): void {
    this.settingsService.settings.subscribe((settings) => {
      this._settings = settings;
    });
  }

  public async store(): Promise<void> {
    this.settingsService.storeSettings(this._settings);
  }

  public async restoreDefaults(): Promise<void> {
    this.settingsService.restoreDefaults();
    this._settings = await this.settingsService.settings.toPromise();
  }
}
