import { TestBed } from '@angular/core/testing';
import { MobilePersistenceService } from './mobile-persistence.service';
import { Storage } from '@ionic/storage-angular';

describe('MobilePersistenceService', () => {
  let service: MobilePersistenceService;
  let storageSpy: Storage;

  beforeEach(() => {
    storageSpy = jasmine.createSpyObj('Storage', {
      set: Promise.resolve(),
      get: Promise.resolve(''),
      clear: Promise.resolve(),
      create: Promise.resolve()
    });
    TestBed.configureTestingModule({
      providers: [{ provide: Storage, useValue: storageSpy }]
    });
    service = TestBed.inject(MobilePersistenceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
