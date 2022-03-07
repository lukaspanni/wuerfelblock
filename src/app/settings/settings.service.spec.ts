import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { PersistenceService } from '../services/persistence/persistence.service';

import { Setting, SettingsService } from './settings.service';

describe('SettingsService', () => {
  let service: SettingsService;
  let persistenceSpy: jasmine.SpyObj<PersistenceService>;
  let readyResolve;
  let readyReject;

  beforeEach(() => {
    persistenceSpy = jasmine.createSpyObj('PersistenceSpy', ['retrieve', 'store'], {
      ready: new Promise((resolve, reject) => {
        readyResolve = resolve;
        readyReject = reject;
      })
    });
    TestBed.configureTestingModule({
      providers: [{ provide: PersistenceService, useValue: persistenceSpy }]
    });
    service = TestBed.inject(SettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load settings on construction', fakeAsync(async () => {
    const testSetting: Setting = { id: 'setting-1', name: 'Test-Setting', type: 'boolean', value: true };
    persistenceSpy.retrieve.and.resolveTo('[' + JSON.stringify(testSetting) + ']');
    readyResolve();
    tick();
    expect(persistenceSpy.retrieve).toHaveBeenCalledWith('settings');
    const actualTestSetting = (await service.settings)[0];
    expect(actualTestSetting).toEqual(testSetting);
  }));

  it('storeSettings should store json settings', fakeAsync(async () => {
    persistenceSpy.retrieve.and.resolveTo('');
    readyResolve();
    const settings: Setting[] = [{ id: 'setting-1', name: 'Test-Setting', type: 'boolean', value: true }];
    const expectedJson = '[{"id":"setting-1","name":"Test-Setting","type":"boolean","value":true}]';
    persistenceSpy.store.and.resolveTo();
    await service.storeSettings(settings);
    expect(persistenceSpy.store).toHaveBeenCalledWith('settings', expectedJson);
  }));
});
