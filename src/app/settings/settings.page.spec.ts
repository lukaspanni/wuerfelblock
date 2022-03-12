import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { of } from 'rxjs';

import { SettingsPage } from './settings.page';
import { SettingsService } from './settings.service';

describe('SettingsPage', () => {
  let component: SettingsPage;
  let fixture: ComponentFixture<SettingsPage>;
  let settingsSpy: jasmine.SpyObj<SettingsService>;

  beforeEach(
    waitForAsync(() => {
      settingsSpy = jasmine.createSpyObj('SettingsService', ['storeSettings'], { settings: of([]) });
      TestBed.configureTestingModule({
        declarations: [SettingsPage],
        imports: [IonicModule.forRoot()],
        providers: [{ provide: SettingsService, useValue: settingsSpy }]
      }).compileComponents();

      fixture = TestBed.createComponent(SettingsPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
